import { getCategory } from '../data/categories';
import type { Expense } from '../types';

const escape = (value: string) => (/[",\n;]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

export function toCSV(list: Expense[]): string {
  const header = 'fecha,categoria,descripcion,monto';
  const rows = list.map((e) =>
    [e.date, getCategory(e.category).label, escape(e.description), e.amount.toFixed(2)].join(','),
  );
  return [header, ...rows].join('\n');
}

export function downloadCSV(list: Expense[], filename: string): void {
  // El BOM hace que Excel abra bien los acentos
  const blob = new Blob(['﻿' + toCSV(list)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
