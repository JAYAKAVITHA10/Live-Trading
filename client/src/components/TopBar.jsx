
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'
import { Label } from './ui/label.jsx'

export default function TopBar({ symbol, setSymbol }){
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-2xl">
      <div className="text-xl font-bold">📊 Live Trading</div>
      <div className="flex items-center gap-2 ml-auto">
        <Label>Symbol</Label>
        <Input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="e.g. BTCUSDT" />
        <Button onClick={()=>{}}>Go</Button>
      </div>
    </div>
  )
}
