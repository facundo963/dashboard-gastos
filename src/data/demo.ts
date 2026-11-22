import { createId } from '../lib/id';
import { shiftMonth, todayISO, monthOf } from '../lib/dates';
import type { CategoryId, Expense } from '../types';

const SAMPLES: [CategoryId, string, number][] = [
  ['comida', 'Supermercado', 48500],
  ['comida', 'Almuerzo con el equipo', 15200],
  ['comida', 'Verdulería', 9800],
  ['transporte', 'Carga SUBE', 12000],
  ['transporte', 'Nafta', 38000],
  ['hogar', 'Alquiler', 380000],
  ['servicios', 'Internet', 27900],
  ['servicios', 'Luz', 21400],
  ['servicios', 'Streaming', 8990],
  ['salud', 'Farmacia', 14600],
  ['salud', 'Gimnasio', 32000],
  ['ocio', 'Cine', 11000],
  ['ocio', 'Salida con amigos', 26500],
  ['otros', 'Regalo de cumpleaños', 35000],
];

/** Genera 6 meses de gastos de ejemplo terminando en el mes actual */
export function buildDemoExpenses(now: Date = new Date()): Expense[] {
  const today = todayISO(now);
  const current = monthOf(today);
  const list: Expense[] = [];
  for (let m = 5; m >= 0; m--) {
    const month = shiftMonth(current, -m);
    const variation = 0.85 + ((m * 37) % 30) / 100;
    SAMPLES.forEach(([category, description, base], i) => {
      if ((i + m) % 5 === 4) return; // no todos los meses tienen los mismos gastos
      const day = String(((i * 7 + m * 3) % 27) + 1).padStart(2, '0');
      const date = `${month}-${day}`;
      if (date > today) return;
      list.push({
        id: createId(),
        amount: Math.round(base * variation),
        category,
        description,
        date,
      });
    });
  }
  return list;
}
