
# Live Trading Dashboard (React + Node + Socket.IO + Recharts + Tailwind)

A simple real-time stocks/crypto dashboard with:
- 📈 Live prices via WebSockets (mock generator included; plug in real feeds easily)
- 💼 Portfolio tracking
- 🔔 Price alerts
- 🧰 React (Vite) + Tailwind + minimal shadcn-style UI
- 📊 Recharts (line + candlestick)
- ⚡ Socket.IO
- 🧠 Optional Redis for persistence (fallback to JSON file)

## Quick Start

### 1) Server
```bash
cd server
npm i
npm run dev     # starts on http://localhost:4000
```
> Set `USE_REDIS=true` in `.env` if you want Redis. `docker-compose up -d` in the project root to start Redis quickly.

### 2) Client
```bash
cd client
npm i
npm run dev     # opens http://localhost:5173
```

The client expects the server at `http://localhost:4000`. Edit `VITE_SERVER_URL` in `client/.env` if different.

## Features
- Real-time updates for symbols: `AAPL, TSLA, BTCUSDT, ETHUSDT` (add more in `server/src/priceFeed.js`)
- Add holdings to a portfolio; P/L and total value update live
- Create alert rules by symbol & threshold; toast when triggered
- Candlestick + line charts, symbol switcher
- Minimal shadcn-style components in `client/src/components/ui` (no generator step needed)

## Swap to a Real Market Feed
In `server/src/priceFeed.js`, see the `// --- REAL FEED ADAPTER EXAMPLE` section for Binance/Alpha Vantage notes.
Replace the `MockPriceFeed` with your adapter and emit prices in the same shape:
```js
{ symbol: "BTCUSDT", price: 65000.12, o: 64900, h: 65210, l: 64500, c: 65000, t: 1690000000000 }
```

## Redis
- Provide `REDIS_URL=redis://localhost:6379` in `server/.env` and set `USE_REDIS=true`.
- If Redis isn't available, the server falls back to a local JSON file at `server/data/state.json`.

## Scripts
- Server: `dev` (nodemon), `start`
- Client: `dev`, `build`, `preview`

---

MIT License.
# Live-Trading
