import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '../lib/storage';

const STORAGE_KEY = 'dashboard-gastos:budget';
const isBudget = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;

/** Presupuesto mensual; 0 significa "sin presupuesto" */
export function useBudget() {
  const [budget, setBudget] = useState<number>(() => loadJSON(STORAGE_KEY, 0, isBudget));
  useEffect(() => saveJSON(STORAGE_KEY, budget), [budget]);
  return [budget, setBudget] as const;
}
