import { monthLabel } from '../lib/dates';
import type { MonthTotal } from '../lib/expenses';
import { formatARS, formatCompact } from '../lib/money';
import type { MonthKey } from '../types';
import { Card } from '../ui';

interface MonthlyBarsProps {
  data: MonthTotal[];
  selected: MonthKey;
  onSelect: (month: MonthKey) => void;
}

export function MonthlyBars({ data, selected, onSelect }: MonthlyBarsProps) {
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <Card title="Últimos 6 meses">
      <div className="bars" role="list">
        {data.map((d) => (
          <button
            key={d.month}
            type="button"
            role="listitem"
            className={`bars__col ${d.month === selected ? 'is-selected' : ''}`}
            onClick={() => onSelect(d.month)}
            aria-label={`${monthLabel(d.month)}: ${formatARS(d.total)}`}
            aria-pressed={d.month === selected}
          >
            <span className="bars__value num">{d.total > 0 ? formatCompact(d.total) : ''}</span>
            <span className="bars__track">
              <span className="bars__fill" style={{ height: `${(d.total / max) * 100}%` }} />
            </span>
            <span className="bars__label">{monthLabel(d.month, 'short')}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
