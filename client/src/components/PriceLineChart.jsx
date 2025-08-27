
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function PriceLineChart({ data }) {
  const mapped = data.map(d => ({
    t: new Date(d.t).toLocaleTimeString(),
    price: d.c
  }))
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mapped} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <XAxis dataKey="t" hide />
          <YAxis domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
