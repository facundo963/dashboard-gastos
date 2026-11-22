import { getCategory } from '../data/categories';
import type { CategoryTotal } from '../lib/expenses';
import { formatARS } from '../lib/money';
import { Card } from '../ui';

const R = 70;
const C = 2 * Math.PI * R;
const GAP = 3;

export function CategoryDonut({ data, total }: { data: CategoryTotal[]; total: number }) {
  let offset = 0;
  return (
    <Card title="Por categoría">
      {data.length === 0 ? (
        <p className="empty">Todavía no hay gastos este mes.</p>
      ) : (
        <div className="donut">
          <svg viewBox="0 0 180 180" className="donut__svg" role="img" aria-label="Distribución de gastos por categoría">
            <circle cx="90" cy="90" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="18" />
            {data.map((d) => {
              const len = Math.max(d.share * C - (data.length > 1 ? GAP : 0), 0.5);
              const el = (
                <circle
                  key={d.category}
                  cx="90"
                  cy="90"
                  r={R}
                  fill="none"
                  stroke={getCategory(d.category).color}
                  strokeWidth="18"
                  strokeLinecap="butt"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 90 90)"
                >
                  <title>
                    {getCategory(d.category).label}: {formatARS(d.total)}
                  </title>
                </circle>
              );
              offset += d.share * C;
              return el;
            })}
            <text x="90" y="84" textAnchor="middle" className="donut__caption">
              Total
            </text>
            <text x="90" y="106" textAnchor="middle" className="donut__value">
              {formatARS(total)}
            </text>
          </svg>
          <ul className="legend">
            {data.map((d) => {
              const cat = getCategory(d.category);
              return (
                <li key={d.category}>
                  <span className="legend__dot" style={{ background: cat.color }} />
                  <span className="legend__name">{cat.label}</span>
                  <span className="legend__pct num">{Math.round(d.share * 100)}%</span>
                  <span className="legend__val num">{formatARS(d.total)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}
