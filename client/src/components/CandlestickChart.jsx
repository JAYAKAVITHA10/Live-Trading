import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function CandlestickChart({ data }) {
  const mapped = data.map((d) => ({
    t: new Date(d.t).toLocaleTimeString(),
    open: d.o,
    close: d.c,
    high: d.h,
    low: d.l,
    dir: d.c >= d.o ? 1 : -1,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={mapped} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
          <XAxis dataKey="t" hide />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip />

          {/* Draw body as a thin bar (color shows up/down) */}
          <Bar
            dataKey="close"
            shape={(props) => {
              const { x, y, width, payload } = props;
              const color = payload.dir >= 0 ? "#16a34a" : "#dc2626";
              const openY = props.yAxis?.scale(payload.open) ?? y;
              const closeY = props.yAxis?.scale(payload.close) ?? y;
              const highY = props.yAxis?.scale(payload.high) ?? Math.min(openY, closeY);
              const lowY = props.yAxis?.scale(payload.low) ?? Math.max(openY, closeY);

              return (
                <g>
                  {/* Wick */}
                  <line
                    x1={x + width / 2}
                    x2={x + width / 2}
                    y1={highY}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={2}
                  />
                  {/* Body */}
                  <rect
                    x={x + width / 2 - 3}
                    y={Math.min(openY, closeY)}
                    width={6}
                    height={Math.max(2, Math.abs(closeY - openY))}
                    fill={color}
                    rx={2}
                  />
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
