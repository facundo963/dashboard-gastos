import { useEffect, useState, type FormEvent } from 'react';
import { CATEGORIES } from '../data/categories';
import { todayISO } from '../lib/dates';
import { draftToExpense, validateDraft, type DraftErrors } from '../lib/expenses';
import { createId } from '../lib/id';
import type { CategoryId, Expense, ExpenseDraft } from '../types';
import { Button, Card, Field } from '../ui';

interface ExpenseFormProps {
  /** Si viene un gasto, el formulario pasa a modo edición */
  editing?: Expense | null;
  onSubmit: (expense: Expense) => void;
  onCancelEdit?: () => void;
}

const emptyDraft = (): ExpenseDraft => ({
  amount: '',
  category: 'comida',
  description: '',
  date: todayISO(),
});

const toDraft = (e: Expense): ExpenseDraft => ({
  amount: String(e.amount).replace('.', ','),
  category: e.category,
  description: e.description,
  date: e.date,
});

export function ExpenseForm({ editing, onSubmit, onCancelEdit }: ExpenseFormProps) {
  const [draft, setDraft] = useState<ExpenseDraft>(emptyDraft);
  const [errors, setErrors] = useState<DraftErrors>({});

  useEffect(() => {
    setDraft(editing ? toDraft(editing) : emptyDraft());
    setErrors({});
  }, [editing]);

  const set = <K extends keyof ExpenseDraft>(key: K, value: ExpenseDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateDraft(draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit(draftToExpense(draft, editing?.id ?? createId()));
    if (!editing) setDraft((d) => ({ ...emptyDraft(), category: d.category, date: d.date }));
  };

  return (
    <Card title={editing ? 'Editar gasto' : 'Nuevo gasto'} className="form-card">
      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        <Field id="amount" label="Monto" error={errors.amount}>
          <input
            className="input input--amount"
            inputMode="decimal"
            placeholder="$ 0"
            autoComplete="off"
            value={draft.amount}
            onChange={(e) => set('amount', e.target.value)}
          />
        </Field>
        <Field id="description" label="Descripción" error={errors.description}>
          <input
            className="input"
            placeholder="Ej: supermercado"
            maxLength={80}
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>
        <div className="expense-form__row">
          <Field id="category" label="Categoría" error={errors.category}>
            <select
              className="input"
              value={draft.category}
              onChange={(e) => set('category', e.target.value as CategoryId)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="date" label="Fecha" error={errors.date}>
            <input className="input" type="date" value={draft.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
        </div>
        <div className="expense-form__actions">
          <Button type="submit" variant="primary">
            {editing ? 'Guardar cambios' : 'Agregar gasto'}
          </Button>
          {editing && (
            <Button variant="ghost" onClick={onCancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
