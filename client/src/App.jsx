
import { useEffect, useMemo, useRef, useState } from 'react'
import io from 'socket.io-client'
import TopBar from './components/TopBar.jsx'
import CandlestickChart from './components/CandlestickChart.jsx'
import PriceLineChart from './components/PriceLineChart.jsx'
import Portfolio from './components/Portfolio.jsx'
import AlertsPanel from './components/AlertsPanel.jsx'
import { Card, CardContent } from './components/ui/card.jsx'

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'

export default function App(){
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [candles, setCandles] = useState({}) // sym -> array
  const [portfolio, setPortfolio] = useState([])
  const [rules, setRules] = useState([])
  const [toasts, setToasts] = useState([])
  const latestPriceRef = useRef({})

  useEffect(()=>{
    const socket = io(SERVER, { transports: ['websocket'] })

    socket.on('connect', ()=> console.log('connected'))
    socket.on('snapshot', (snap)=>{
      setCandles(snap.candles || {})
      setPortfolio(snap.portfolio || [])
    })
    socket.on('price', (bar)=>{
      setCandles(prev => {
        const arr = (prev[bar.symbol] || []).slice(-199).concat(bar)
        return { ...prev, [bar.symbol]: arr }
      })
      latestPriceRef.current[bar.symbol] = bar.price
    })
    socket.on('portfolio:state', setPortfolio)
    socket.on('alerts:state', setRules)
    socket.on('toast', (t)=> setToasts(prev => [...prev, { id: Math.random(), ...t }]))

    // expose some emitters
    App._emit = {
      addHolding: (item) => socket.emit('portfolio:add', item),
      removeHolding: (id) => socket.emit('portfolio:remove', { id }),
      addAlert: (rule) => socket.emit('alerts:add', rule),
      removeAlert: (id) => socket.emit('alerts:remove', { id })
    }

    return () => socket.close()
  }, [])

  const latestPrices = latestPriceRef.current
  const data = candles[symbol] || []
  const small = data.slice(-60)
  const medium = data.slice(-150)

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <TopBar symbol={symbol} setSymbol={setSymbol} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent>
            <h2 className="font-semibold mb-2">{symbol} — Candlesticks</h2>
            <CandlestickChart data={medium} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-semibold mb-2">{symbol} — Price</h2>
            <PriceLineChart data={small} />
            <div className="mt-2 text-sm opacity-80">
              Last: {small.at(-1)?.c?.toFixed?.(2) ?? '-'}
            </div>
          </CardContent>
        </Card>

        <Portfolio
          holdings={portfolio}
          onAdd={(item)=> App._emit.addHolding(item)}
          onRemove={(id)=> App._emit.removeHolding(id)}
          latestPrices={latestPrices}
        />

        <AlertsPanel
          rules={rules}
          onAdd={(rule)=> App._emit.addAlert(rule)}
          onRemove={(id)=> App._emit.removeAlert(id)}
        />
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="bg-card rounded-xl px-4 py-3 shadow">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm opacity-80">{t.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
