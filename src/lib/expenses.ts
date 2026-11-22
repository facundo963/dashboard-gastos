import { CATEGORIES, isCategoryId } from '../data/categories';
import type { CategoryId, Expense, ExpenseDraft, MonthKey } from '../types';
import { isValidISODate, monthOf, shiftMonth } from './dates';
import { parseAmount } from './money';

export interface ExpenseFilter {
  month?: MonthKey;
  category?: CategoryId | 'todas';
  query?: string;
}

export function filterExpenses(list: Expense[], filter: ExpenseFilter): Expense[] {
  const q = filter.query?.trim().toLowerCase() ?? '';
  return list
    .filter((e) => !filter.month || monthOf(e.date) === filter.month)
    .filter((e) => !filter.category || filter.category === 'todas' || e.category === filter.category)
    .filter((e) => q === '' || e.description.toLowerCase().includes(q))
    .sort((a, b) => (a.date === b.date ? b.amount - a.amount : b.date.localeCompare(a.date)));
}

export function totalOf(list: Expense[]): number {
  return Math.round(list.reduce((sum, e) => sum + e.amount, 0) * 100) / 100;
}

export interface CategoryTotal {
  category: CategoryId;
  total: number;
  /** Proporción del total, de 0 a 1 */
  share: number;
}

export function byCategory(list: Expense[]): CategoryTotal[] {
  const total = totalOf(list);
  const sums = new Map<CategoryId, number>();
  for (const e of list) sums.set(e.category, (sums.get(e.category) ?? 0) + e.amount);
  return CATEGORIES.filter((c) => sums.has(c.id))
    .map((c) => {
      const t = sums.get(c.id) ?? 0;
      return { category: c.id, total: t, share: total === 0 ? 0 : t / total };
    })
    .sort((a, b) => b.total - a.total);
}

export interface MonthTotal {
  month: MonthKey;
  total: number;
}

/** Totales de los últimos `count` meses terminando en `endMonth`, incluidos los meses sin gastos */
export function lastMonths(list: Expense[], endMonth: MonthKey, count: number): MonthTotal[] {
  const months = Array.from({ length: count }, (_, i) => shiftMonth(endMonth, i - count + 1));
  return months.map((month) => ({
    month,
    total: totalOf(list.filter((e) => monthOf(e.date) === month)),
  }));
}

export interface MonthComparison {
  current: number;
  previous: number;
  /** Variación porcentual contra el mes anterior; null si el mes anterior fue 0 */
  change: number | null;
}

export function compareWithPrevious(list: Expense[], month: MonthKey): MonthComparison {
  const current = totalOf(filterExpenses(list, { month }));
  const previous = totalOf(filterExpenses(list, { month: shiftMonth(month, -1) }));
  return {
    current,
    previous,
    change: previous === 0 ? null : (current - previous) / previous,
  };
}

export type DraftErrors = Partial<Record<keyof ExpenseDraft, string>>;

export function validateDraft(draft: ExpenseDraft): DraftErrors {
  const errors: DraftErrors = {};
  if (parseAmount(draft.amount) === null) errors.amount = 'Ingresá un monto mayor a cero.';
  if (!isCategoryId(draft.category)) errors.category = 'Elegí una categoría.';
  if (draft.description.trim().length < 2) errors.description = 'Escribí una descripción corta.';
  else if (draft.description.trim().length > 80) errors.description = 'Máximo 80 caracteres.';
  if (!isValidISODate(draft.date)) errors.date = 'Elegí una fecha válida.';
  return errors;
}

export function draftToExpense(draft: ExpenseDraft, id: string): Expense {
  const amount = parseAmount(draft.amount);
  if (amount === null) throw new Error('Monto inválido');
  return {
    id,
    amount,
    category: draft.category,
    description: draft.description.trim(),
    date: draft.date,
  };
}

export function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.amount === 'number' &&
    e.amount > 0 &&
    isCategoryId(e.category) &&
    typeof e.description === 'string' &&
    typeof e.date === 'string' &&
    isValidISODate(e.date)
  );
}
