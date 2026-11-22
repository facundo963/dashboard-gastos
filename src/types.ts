export type CategoryId =
  | 'comida'
  | 'transporte'
  | 'hogar'
  | 'servicios'
  | 'salud'
  | 'ocio'
  | 'otros';

export interface Expense {
  id: string;
  /** Monto en pesos, siempre positivo */
  amount: number;
  category: CategoryId;
  description: string;
  /** Fecha local en formato YYYY-MM-DD */
  date: string;
}

/** Lo que carga el usuario en el formulario, antes de validar */
export interface ExpenseDraft {
  amount: string;
  category: CategoryId;
  description: string;
  date: string;
}

/** Mes en formato YYYY-MM */
export type MonthKey = string;
