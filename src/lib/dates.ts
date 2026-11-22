import type { MonthKey } from '../types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha de hoy en hora local, formato YYYY-MM-DD */
export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function monthOf(date: string): MonthKey {
  return date.slice(0, 7);
}

export function shiftMonth(month: MonthKey, delta: number): MonthKey {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function monthLabel(month: MonthKey, style: 'long' | 'short' = 'long'): string {
  const [y, m] = month.split('-').map(Number);
  const text = new Intl.DateTimeFormat('es-AR', {
    month: style,
    year: style === 'long' ? 'numeric' : undefined,
  }).format(new Date(y, m - 1, 1));
  return text.charAt(0).toUpperCase() + text.slice(1).replace('.', '');
}

export function dayLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const month = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(new Date(y, m - 1, d)).replace('.', '');
  return `${pad(d)} ${month}`;
}

export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}
