import { useMemo, useState } from 'react';
import { CATEGORIES, getCategory } from '../data/categories';
import { dayLabel } from '../lib/dates';
import { filterExpenses } from '../lib/expenses';
import { formatARS } from '../lib/money';
import type { CategoryId, Expense } from '../types';
import { Badge, Button, Card } from '../ui';

interface ExpenseListProps {
  expenses: Expense[];
  editingId?: string;
  onEdit: (expense: Expense) => void;
  onRemove: (expense: Expense) => void;
}

export function ExpenseList({ expenses, editingId, onEdit, onRemove }: ExpenseListProps) {
  const [category, setCategory] = useState<CategoryId | 'todas'>('todas');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => filterExpenses(expenses, { category, query }), [expenses, category, query]);

  return (
    <Card
      title="Movimientos"
      className="list-card"
      action={
        <div className="filters">
          <label className="sr-only" htmlFor="search">Buscar</label>
          <input
            id="search"
            className="input input--sm"
            type="search"
            placeholder="Buscar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="sr-only" htmlFor="filter-category">Filtrar por categoría</label>
          <select
            id="filter-category"
            className="input input--sm"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryId | 'todas')}
          >
            <option value="todas">Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      }
    >
      {visible.length === 0 ? (
        <p className="empty">
          {expenses.length === 0 ? 'No hay gastos en este mes. Cargá el primero.' : 'Ningún gasto coincide con el filtro.'}
        </p>
      ) : (
        <ul className="rows">
          {visible.map((e) => {
            const cat = getCategory(e.category);
            return (
              <li key={e.id} className={`row ${e.id === editingId ? 'is-editing' : ''}`}>
                <span className="row__date">{dayLabel(e.date)}</span>
                <span className="row__desc">{e.description}</span>
                <span className="row__cat"><Badge color={cat.color}>{cat.label}</Badge></span>
                <span className="row__amount num">{formatARS(e.amount)}</span>
                <span className="row__actions">
                  <Button size="icon" variant="ghost" aria-label={`Editar ${e.description}`} onClick={() => onEdit(e)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M11 2.5 13.5 5 6 12.5H3.5V10z" /></svg>
                  </Button>
                  <Button size="icon" variant="danger" aria-label={`Eliminar ${e.description}`} onClick={() => onRemove(e)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.7 8.5h5.6l.7-8.5" /></svg>
                  </Button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
