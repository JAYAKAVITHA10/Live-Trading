
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx'
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'

export default function Portfolio({ holdings, onAdd, onRemove, latestPrices }){
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [qty, setQty] = useState(0.01)
  const [avg, setAvg] = useState(50000)

  const rows = holdings.map(h => {
    const p = latestPrices[h.symbol] ?? h.avg
    const value = p * h.qty
    const pl = (p - h.avg) * h.qty
    return { ...h, price: p, value, pl }
  })

  return (
    <Card>
      <CardHeader><CardTitle>Portfolio</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Input value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} placeholder="Symbol" />
          <Input type="number" value={qty} onChange={e=>setQty(parseFloat(e.target.value))} placeholder="Qty" />
          <Input type="number" value={avg} onChange={e=>setAvg(parseFloat(e.target.value))} placeholder="Avg Price" />
          <Button onClick={()=> onAdd({ symbol, qty: Number(qty), avg: Number(avg) })}>Add</Button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-300">
            <tr><th>Symbol</th><th>Qty</th><th>Avg</th><th>Price</th><th>Value</th><th>P/L</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-muted">
                <td>{r.symbol}</td>
                <td>{r.qty}</td>
                <td>{r.avg.toFixed(2)}</td>
                <td>{r.price.toFixed(2)}</td>
                <td>{r.value.toFixed(2)}</td>
                <td className={r.pl>=0?'text-positive':'text-negative'}>{r.pl.toFixed(2)}</td>
                <td><Button className="bg-negative" onClick={()=>onRemove(r.id)}>Remove</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
