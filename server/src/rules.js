
export class Alerts {
  constructor(store) {
    this.rules = []; // {id, symbol, op, price}
    this.store = store;
  }
  add(rule) {
    const id = Math.random().toString(36).slice(2, 10);
    const out = { id, ...rule, symbol: rule.symbol.toUpperCase() };
    this.rules.push(out);
    return out;
  }
  remove(id) {
    this.rules = this.rules.filter(r => r.id !== id);
  }
  getAll() { return this.rules; }
  evaluate(bar) {
    for (const r of this.rules) {
      if (r.symbol !== bar.symbol) continue;
      if (r.op === '>=' && bar.price >= r.price) this._notify(r, bar);
      if (r.op === '<=' && bar.price <= r.price) this._notify(r, bar);
    }
  }
  _notify(r, bar) {
    // In a real app you'd send push/email/etc.
    // Here we simply log and rely on server 'toast' messages when rules are added.
    console.log(`[ALERT] ${r.symbol} ${r.op} ${r.price} hit at ${bar.price}`);
  }
}
