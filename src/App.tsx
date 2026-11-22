import { useCallback, useMemo, useState } from 'react';
import { BudgetCard } from './components/BudgetCard';
import { CategoryDonut } from './components/CategoryDonut';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { MonthlyBars } from './components/MonthlyBars';
import { SummaryCards } from './components/SummaryCards';
import { Toast } from './components/Toast';
import { buildDemoExpenses } from './data/demo';
import { useBudget } from './hooks/useBudget';
import { useExpenses } from './hooks/useExpenses';
import { downloadCSV } from './lib/csv';
import { monthLabel, monthOf, shiftMonth, todayISO } from './lib/dates';
import { byCategory, compareWithPrevious, filterExpenses, lastMonths, totalOf } from './lib/expenses';
import type { Expense, MonthKey } from './types';
import { Button } from './ui';
import './App.css';

interface ToastState {
  message: string;
  undo?: () => void;
}

export default function App() {
  const { expenses, add, update, remove, replaceAll } = useExpenses();
  const [budget, setBudget] = useBudget();
  const currentMonth = monthOf(todayISO());
  const [month, setMonth] = useState<MonthKey>(currentMonth);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const monthExpenses = useMemo(() => filterExpenses(expenses, { month }), [expenses, month]);
  const categories = useMemo(() => byCategory(monthExpenses), [monthExpenses]);
  const comparison = useMemo(() => compareWithPrevious(expenses, month), [expenses, month]);
  const history = useMemo(() => lastMonths(expenses, month, 6), [expenses, month]);
  const total = totalOf(monthExpenses);

  const closeToast = useCallback(() => setToast(null), []);

  const handleSubmit = (expense: Expense) => {
    if (editing) {
      update(expense);
      setEditing(null);
      setToast({ message: 'Gasto actualizado.' });
    } else {
      add(expense);
      setToast({ message: 'Gasto agregado.', undo: () => remove(expense.id) });
    }
    if (monthOf(expense.date) !== month) setMonth(monthOf(expense.date));
  };

  const handleRemove = (expense: Expense) => {
    remove(expense.id);
    if (editing?.id === expense.id) setEditing(null);
    setToast({ message: `Eliminaste "${expense.description}".`, undo: () => add(expense) });
  };

  const loadDemo = () => {
    const previous = expenses;
    replaceAll(buildDemoExpenses());
    setMonth(currentMonth);
    setToast({ message: 'Cargué 6 meses de datos de ejemplo.', undo: () => replaceAll(previous) });
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true" />
          <h1>Gastos</h1>
        </div>
        <div className="month-switch" role="group" aria-label="Elegir mes">
          <Button size="icon" variant="ghost" aria-label="Mes anterior" onClick={() => setMonth((m) => shiftMonth(m, -1))}>‹</Button>
          <span className="month-switch__label" aria-live="polite">{monthLabel(month)}</span>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Mes siguiente"
            disabled={month >= currentMonth}
            onClick={() => setMonth((m) => shiftMonth(m, 1))}
          >›</Button>
        </div>
        <div className="topbar__actions">
          <Button size="sm" variant="ghost" onClick={loadDemo}>Cargar ejemplo</Button>
          <Button
            size="sm"
            disabled={monthExpenses.length === 0}
            onClick={() => downloadCSV(monthExpenses, `gastos-${month}.csv`)}
          >
            Exportar CSV
          </Button>
        </div>
      </header>

      <main className="layout">
        <div className="col col--side">
          <ExpenseForm editing={editing} onSubmit={handleSubmit} onCancelEdit={() => setEditing(null)} />
          <BudgetCard budget={budget} spent={total} onChange={setBudget} />
        </div>
        <div className="col col--main">
          <SummaryCards comparison={comparison} top={categories[0]} count={monthExpenses.length} />
          <div className="charts">
            <CategoryDonut data={categories} total={total} />
            <MonthlyBars data={history} selected={month} onSelect={setMonth} />
          </div>
          <ExpenseList
            expenses={monthExpenses}
            editingId={editing?.id}
            onEdit={setEditing}
            onRemove={handleRemove}
          />
        </div>
      </main>

      <footer className="foot">
        Hecho por <a href="https://facundo963.github.io">Facundo Lopez</a> · Los datos se guardan solo en tu navegador.
      </footer>

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.undo ? 'Deshacer' : undefined}
          onAction={toast.undo && (() => { toast.undo?.(); setToast(null); })}
          onClose={closeToast}
        />
      )}
    </div>
  );
}
