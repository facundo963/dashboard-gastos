import { useState, type FormEvent } from 'react';
import { formatARS, parseAmount } from '../lib/money';
import { Button, Card, ProgressBar } from '../ui';

interface BudgetCardProps {
  budget: number;
  spent: number;
  onChange: (budget: number) => void;
}

export function BudgetCard({ budget, spent, onChange }: BudgetCardProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const save = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseAmount(value);
    if (parsed === null) {
      setError('Ingresá un monto válido.');
      return;
    }
    onChange(parsed);
    setEditing(false);
  };

  const left = budget - spent;
  return (
    <Card
      title="Presupuesto del mes"
      action={
        !editing && (
          <Button size="sm" variant="ghost" onClick={() => { setValue(budget ? String(budget) : ''); setError(''); setEditing(true); }}>
            {budget ? 'Cambiar' : 'Definir'}
          </Button>
        )
      }
    >
      {editing ? (
        <form className="budget-form" onSubmit={save} noValidate>
          <label className="sr-only" htmlFor="budget">Presupuesto mensual</label>
          <input
            id="budget"
            className="input"
            inputMode="decimal"
            placeholder="$ 500.000"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            aria-invalid={error ? true : undefined}
            autoFocus
          />
          <Button type="submit" variant="primary" size="sm">Guardar</Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
          {error && <span className="field__error budget-form__error">{error}</span>}
        </form>
      ) : budget > 0 ? (
        <div className="budget">
          <div className="budget__nums">
            <span className="num">{formatARS(spent)}</span>
            <span className="budget__of num">de {formatARS(budget)}</span>
          </div>
          <ProgressBar value={spent} max={budget} label="Presupuesto usado" />
          <p className={`budget__left ${left < 0 ? 'is-over' : ''}`}>
            {left >= 0 ? `Te quedan ${formatARS(left)}` : `Te pasaste ${formatARS(-left)}`}
          </p>
        </div>
      ) : (
        <p className="empty">Definí un tope mensual y te aviso cuando te acerques.</p>
      )}
    </Card>
  );
}
