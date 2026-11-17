import { useLayoutEffect, useRef, useState } from 'react';
import { weeklyChart } from '../data/team';

const NARROW = 520;

/** Responsive line chart with direct labels at the line ends. */
export function TrendChart() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { series, yMax, yTicks } = weeklyChart;
  const n = series[0].values.length;
  const narrow = width < NARROW;
  const W = width;
  const H = narrow ? 260 : 300;
  const L = 34;
  const R = narrow ? 84 : 120;
  const T = 16;
  const B = 32;
  const x = (i: number) => L + (i * (W - L - R)) / (n - 1);
  const y = (v: number) => T + (H - T - B) * (1 - v / yMax);

  const summary = series
    .map((s) => `${s.label}: week 1 ${s.values[0]}, week ${n} ${s.values[n - 1]}`)
    .join('; ');

  return (
    <div className="chart" ref={box} style={{ height: H }}>
      {W > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${weeklyChart.title}. ${summary}.`}>
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="chart-grid" />
              <text x={L - 8} y={y(v) + 4} textAnchor="end" className="chart-tick">
                {v}
              </text>
            </g>
          ))}
          {series[0].values.map((_, i) => (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="chart-tick">
              {narrow ? i + 1 : `Wk ${i + 1}`}
            </text>
          ))}
          {narrow && (
            <text x={W - R + 10} y={H - 8} className="chart-tick">
              Week
            </text>
          )}
          {series.map((s) => {
            const floor = series.find((o) => o.id === s.areaTo);
            const lower = floor ? floor.values : s.values.map(() => 0);
            const top = s.values.map((v, i) => `${x(i)},${y(v)}`);
            const bottom = lower.map((v, i) => `${x(i)},${y(v)}`).reverse();
            return (
              <polygon key={`${s.id}-area`} points={[...top, ...bottom].join(' ')} fill={s.color} fillOpacity={0.12} />
            );
          })}
          {[...series].reverse().map((s) => (
            <g key={s.id}>
              <polyline
                points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={4} fill={s.color} />
              ))}
              <text x={x(n - 1) + 10} y={y(s.values[n - 1]) + 5} className="chart-label">
                {narrow ? s.shortLabel : s.label} {s.values[n - 1]}
              </text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
