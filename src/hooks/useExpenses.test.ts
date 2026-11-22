import { describe, expect, it } from 'vitest';
import type { Expense } from '../types';
import { expensesReducer } from './useExpenses';

const base: Expense = { id: '1', amount: 100, category: 'comida', description: 'Pan', date: '2026-11-01' };

describe('expensesReducer', () => {
  it('agrega, actualiza y elimina', () => {
    let state = expensesReducer([], { type: 'add', expense: base });
    expect(state).toHaveLength(1);
    state = expensesReducer(state, { type: 'update', expense: { ...base, amount: 250 } });
    expect(state[0].amount).toBe(250);
    state = expensesReducer(state, { type: 'remove', id: '1' });
    expect(state).toEqual([]);
  });
});
