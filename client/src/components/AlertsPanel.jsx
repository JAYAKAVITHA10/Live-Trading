
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx'
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'

export default function AlertsPanel({ rules, onAdd, onRemove }) {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [op, setOp] = useState('>=')
  const [price, setPrice] = useState(60000)

  return (
    <Card>
      <CardHeader><CardTitle>Alerts</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Input value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} />
          <select className="px-3 py-2 rounded-xl bg-muted" value={op} onChange={e=>setOp(e.target.value)}>
            <option>{'>='}</option>
            <option>{'<='}</option>
          </select>
          <Input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} />
          <Button onClick={()=> onAdd({ symbol, op, price: Number(price) })}>Add</Button>
        </div>
        <ul className="space-y-2">
          {rules.map(r => (
            <li key={r.id} className="flex items-center justify-between bg-muted rounded-xl px-3 py-2">
              <div>{r.symbol} {r.op} {r.price}</div>
              <Button className="bg-negative" onClick={()=>onRemove(r.id)}>Remove</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
