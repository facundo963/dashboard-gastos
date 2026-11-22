import { getCategory } from '../data/categories';
import type { CategoryTotal, MonthComparison } from '../lib/expenses';
import { formatARS } from '../lib/money';

interface SummaryCardsProps {
  comparison: MonthComparison;
  top: CategoryTotal | undefined;
  count: number;
}

export function SummaryCards({ comparison, top, count }: SummaryCardsProps) {
  const { current, change } = comparison;
  const up = change !== null && change > 0;
  return (
    <div className="summary">
      <div className="summary__main">
        <span className="summary__label">Gastaste este mes</span>
        <strong className="summary__total num" data-testid="month-total">
          {formatARS(current)}
        </strong>
        {change === null ? (
          <span className="delta delta--flat">Sin datos del mes anterior</span>
        ) : (
          <span className={`delta ${up ? 'delta--up' : 'delta--down'}`}>
            {up ? '▲' : '▼'} {Math.abs(change * 100).toFixed(0)}% vs. mes anterior
          </span>
        )}
      </div>
      <div className="summary__side">
        <div>
          <span className="summary__label">Movimientos</span>
          <strong className="num">{count}</strong>
        </div>
        <div>
          <span className="summary__label">Categoría principal</span>
          <strong style={{ color: top ? getCategory(top.category).color : undefined }}>
            {top ? getCategory(top.category).label : '—'}
          </strong>
        </div>
      </div>
    </div>
  );
}
