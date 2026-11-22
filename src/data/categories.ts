import type { CategoryId } from '../types';

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'comida', label: 'Comida', color: '#ff5b3a' },
  { id: 'transporte', label: 'Transporte', color: '#3d6bff' },
  { id: 'hogar', label: 'Hogar', color: '#ffb020' },
  { id: 'servicios', label: 'Servicios', color: '#7d9bff' },
  { id: 'salud', label: 'Salud', color: '#3ddc84' },
  { id: 'ocio', label: 'Ocio', color: '#ff9a6b' },
  { id: 'otros', label: 'Otros', color: '#a3a6b8' },
];

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return byId.get(id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && byId.has(value as CategoryId);
}
