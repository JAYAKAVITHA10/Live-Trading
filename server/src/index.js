
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createStore } from './store.js';
import { MockPriceFeed } from './priceFeed.js';
import { Alerts } from './rules.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 4000;

const store = await createStore();
const alerts = new Alerts(store);

// price feed
const feed = new MockPriceFeed(['AAPL','TSLA','BTCUSDT','ETHUSDT']);
feed.on('tick', (bar) => {
  io.emit('price', bar);                 // broadcase live price
  store.appendCandle(bar);               // persist last N bars per symbol
  alerts.evaluate(bar);                  // check alerts
});

// socket wiring
io.on('connection', (socket) => {
  // send initial snapshot
  socket.emit('snapshot', store.getSnapshot());

  socket.on('portfolio:add', (item) => {
    store.addHolding(item);
    io.emit('portfolio:state', store.getPortfolio());
  });
  socket.on('portfolio:remove', ({ id }) => {
    store.removeHolding(id);
    io.emit('portfolio:state', store.getPortfolio());
  });
  socket.on('alerts:add', (rule) => {
    const created = alerts.add(rule);
    io.emit('alerts:state', alerts.getAll());
    socket.emit('toast', { title: 'Alert Added', description: `${created.symbol} ${created.op} ${created.price}` });
  });
  socket.on('alerts:remove', ({ id }) => {
    alerts.remove(id);
    io.emit('alerts:state', alerts.getAll());
  });
});

// simple health
app.get('/health', (_req, res) => res.json({ ok: true }));

server.listen(PORT, () => console.log(`Server on :${PORT}`));
