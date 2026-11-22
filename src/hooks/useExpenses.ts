import { useEffect, useReducer } from 'react';
import { isExpense } from '../lib/expenses';
import { loadJSON, saveJSON } from '../lib/storage';
import type { Expense } from '../types';

const STORAGE_KEY = 'dashboard-gastos:expenses';

type Action =
  | { type: 'add'; expense: Expense }
  | { type: 'update'; expense: Expense }
  | { type: 'remove'; id: string }
  | { type: 'replaceAll'; expenses: Expense[] };

export function expensesReducer(state: Expense[], action: Action): Expense[] {
  switch (action.type) {
    case 'add':
      return [action.expense, ...state];
    case 'update':
      return state.map((e) => (e.id === action.expense.id ? action.expense : e));
    case 'remove':
      return state.filter((e) => e.id !== action.id);
    case 'replaceAll':
      return action.expenses;
  }
}

const isExpenseList = (value: unknown): value is Expense[] =>
  Array.isArray(value) && value.every(isExpense);

export function useExpenses() {
  const [expenses, dispatch] = useReducer(expensesReducer, undefined, () =>
    loadJSON<Expense[]>(STORAGE_KEY, [], isExpenseList),
  );

  useEffect(() => {
    saveJSON(STORAGE_KEY, expenses);
  }, [expenses]);

  return {
    expenses,
    add: (expense: Expense) => dispatch({ type: 'add', expense }),
    update: (expense: Expense) => dispatch({ type: 'update', expense }),
    remove: (id: string) => dispatch({ type: 'remove', id }),
    replaceAll: (list: Expense[]) => dispatch({ type: 'replaceAll', expenses: list }),
  };
}
