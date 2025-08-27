
import EventEmitter from 'events';

/**
 * Emits bar-like objects for symbols:
 * { symbol, price, o, h, l, c, t }
 */
export class MockPriceFeed extends EventEmitter {
  constructor(symbols) {
    super();
    this.symbols = symbols;
    this.state = {};
    const now = Date.now();
    for (const s of symbols) {
      const base = 100 + Math.random() * 200;
      this.state[s] = { o: base, h: base, l: base, c: base, t: now };
    }
    setInterval(() => this._tick(), 1000);
  }
  _tick() {
    const t = Date.now();
    for (const s of this.symbols) {
      const prev = this.state[s];
      const drift = (Math.random() - 0.5) * (s.includes('USD') ? 30 : 2);
      const c = Math.max(1, prev.c + drift);
      const o = prev.c;
      const h = Math.max(prev.h, c, o);
      const l = Math.min(prev.l, c, o);
      const bar = { symbol: s, price: c, o, h, l, c, t };
      this.state[s] = { o, h, l, c, t };
      this.emit('tick', bar);
    }
  }
}

/* --- REAL FEED ADAPTER EXAMPLE (pseudo) ---
import WebSocket from 'ws';
export class BinanceFeed extends EventEmitter {
  constructor(symbols) {
    super();
    const streams = symbols.map(s => `${s.toLowerCase()}@kline_1s`).join('/');
    this.ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
    this.ws.on('message', (msg) => {
      const { data } = JSON.parse(msg);
      const { s, o, h, l, c, T } = data.k;
      this.emit('tick', { symbol: s, price: +c, o:+o, h:+h, l:+l, c:+c, t:T });
    });
  }
}
*/
