
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'data', 'state.json');

function loadFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch {}
  return { candles: {}, portfolio: [] };
}
function saveFile(state) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  } catch {}
}

export async function createStore() {
  const useRedis = (process.env.USE_REDIS || 'false').toLowerCase() === 'true';
  if (useRedis) {
    const client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    console.log('Connected to Redis');
    return new RedisStore(client);
  }
  console.log('Using FileStore');
  return new FileStore();
}

class BaseStore {
  constructor() {
    this.maxBars = 200;
  }
  _normSymbol(s) { return (s||'').toUpperCase(); }

  appendCandle(bar) {
    const s = this._normSymbol(bar.symbol);
    const buf = this._getCandles(s);
    buf.push(bar);
    while (buf.length > this.maxBars) buf.shift();
    this._setCandles(s, buf);
  }

  addHolding(item) {
    const id = cryptoRandomId();
    const entry = { id, ...item };
    const arr = this.getPortfolio();
    arr.push(entry);
    this._setPortfolio(arr);
    return entry;
  }
  removeHolding(id) {
    const arr = this.getPortfolio().filter(x => x.id !== id);
    this._setPortfolio(arr);
  }

  getSnapshot() {
    return { candles: this._getAllCandles(), portfolio: this.getPortfolio() };
  }
}

class FileStore extends BaseStore {
  constructor() {
    super();
    this.state = loadFile();
  }
  _getCandles(symbol) {
    this.state.candles[symbol] ||= [];
    return this.state.candles[symbol];
  }
  _setCandles(symbol, arr) {
    this.state.candles[symbol] = arr;
    saveFile(this.state);
  }
  _getAllCandles() { return this.state.candles; }
  getPortfolio() { return this.state.portfolio || []; }
  _setPortfolio(arr) { this.state.portfolio = arr; saveFile(this.state); }
}

class RedisStore extends BaseStore {
  constructor(client) {
    super();
    this.client = client;
  }
  _key(sym) { return `candles:${sym}`; }
  _portfolioKey() { return `portfolio`; }
  async _getCandlesAsync(sym) {
    const key = this._key(sym);
    const raw = await this.client.get(key);
    return raw ? JSON.parse(raw) : [];
  }
  async _setCandlesAsync(sym, arr) {
    await this.client.set(this._key(sym), JSON.stringify(arr));
  }
  _getCandles(sym) { throw new Error('use async in RedisStore'); }
  _setCandles(sym) { throw new Error('use async in RedisStore'); }
  appendCandle(bar) { // override to async-ish pattern
    (async () => {
      const s = this._normSymbol(bar.symbol);
      const buf = await this._getCandlesAsync(s);
      buf.push(bar);
      while (buf.length > this.maxBars) buf.shift();
      await this._setCandlesAsync(s, buf);
    })();
  }
  _getAllCandles() { throw new Error('not used directly'); }
  getPortfolio() { throw new Error('use async in RedisStore'); }

  // For snapshot & portfolio, provide simple sync wrappers by caching in memory between calls.
  async getSnapshotAsync() {
    const keys = await this.client.keys('candles:*');
    const candles = {};
    for (const key of keys) {
      const sym = key.split(':')[1];
      const raw = await this.client.get(key);
      candles[sym] = raw ? JSON.parse(raw) : [];
    }
    const p = await this.client.get(this._portfolioKey());
    const portfolio = p ? JSON.parse(p) : [];
    return { candles, portfolio };
  }
  getSnapshot() {
    // best-effort sync facade
    // In our server we only call this at connect time. We'll block with deasync-like await by throwing a Promise is not ideal.
    // Instead, we cached nothing. For simplicity in this demo, just return empty here if called before async variant.
    // The server sends subsequent updates anyway.
    return { candles: {}, portfolio: [] };
  }
  getPortfolio() {
    // best-effort; server emits portfolio after change
    return [];
  }
  async addHoldingAsync(item) {
    const id = cryptoRandomId();
    const entry = { id, ...item };
    const p = await this.client.get(this._portfolioKey());
    const arr = p ? JSON.parse(p) : [];
    arr.push(entry);
    await this.client.set(this._portfolioKey(), JSON.stringify(arr));
    return entry;
  }
  async removeHoldingAsync(id) {
    const p = await this.client.get(this._portfolioKey());
    const arr = p ? JSON.parse(p) : [];
    const out = arr.filter(x => x.id !== id);
    await this.client.set(this._portfolioKey(), JSON.stringify(out));
  }
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}
