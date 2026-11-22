import { describe, expect, it } from 'vitest';
import type { Expense } from '../types';
import { toCSV } from './csv';
import { shiftMonth } from './dates';
import {
  byCategory,
  compareWithPrevious,
  filterExpenses,
  lastMonths,
  totalOf,
  validateDraft,
} from './expenses';

const e = (id: string, amount: number, category: Expense['category'], date: string, description = id): Expense => ({
  id,
  amount,
  category,
  date,
  description,
});

const data: Expense[] = [
  e('a', 1000, 'comida', '2026-11-03', 'Supermercado'),
  e('b', 3000, 'hogar', '2026-11-10', 'Alquiler'),
  e('c', 500, 'comida', '2026-11-12', 'Café'),
  e('d', 2000, 'comida', '2026-10-05', 'Supermercado'),
];

describe('filterExpenses', () => {
  it('filtra por mes y ordena del más reciente al más viejo', () => {
    expect(filterExpenses(data, { month: '2026-11' }).map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('filtra por categoría y por texto sin importar mayúsculas', () => {
    expect(filterExpenses(data, { category: 'comida', query: 'SUPER' }).map((x) => x.id)).toEqual(['a', 'd']);
  });
});

describe('totales', () => {
  it('suma sin errores de coma flotante', () => {
    expect(totalOf([e('x', 0.1, 'otros', '2026-11-01'), e('y', 0.2, 'otros', '2026-11-01')])).toBe(0.3);
  });

  it('agrupa por categoría con su proporción', () => {
    const result = byCategory(filterExpenses(data, { month: '2026-11' }));
    expect(result).toEqual([
      { category: 'hogar', total: 3000, share: 3000 / 4500 },
      { category: 'comida', total: 1500, share: 1500 / 4500 },
    ]);
  });

  it('incluye meses sin gastos en el historial', () => {
    expect(lastMonths(data, '2026-11', 3)).toEqual([
      { month: '2026-09', total: 0 },
      { month: '2026-10', total: 2000 },
      { month: '2026-11', total: 4500 },
    ]);
  });

  it('compara contra el mes anterior', () => {
    expect(compareWithPrevious(data, '2026-11')).toEqual({ current: 4500, previous: 2000, change: 1.25 });
    expect(compareWithPrevious(data, '2026-10').change).toBeNull();
  });
});

describe('fechas', () => {
  it('cruza el cambio de año', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
  });
});

describe('validateDraft', () => {
  it('marca todos los campos inválidos', () => {
    const errors = validateDraft({ amount: '', category: 'comida', description: 'a', date: '2026-02-30' });
    expect(Object.keys(errors).sort()).toEqual(['amount', 'date', 'description']);
  });

  it('acepta un gasto correcto', () => {
    expect(validateDraft({ amount: '1.500', category: 'ocio', description: 'Cine', date: '2026-11-20' })).toEqual({});
  });
});

describe('toCSV', () => {
  it('escapa comas y comillas', () => {
    const csv = toCSV([e('z', 1500, 'ocio', '2026-11-20', 'Cine, pochoclo y "gaseosa"')]);
    expect(csv.split('\n')[1]).toBe('2026-11-20,Ocio,"Cine, pochoclo y ""gaseosa""",1500.00');
  });
});
