const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatARS(value: number): string {
  return formatter.format(value);
}

/**
 * Convierte lo que escribe el usuario en un número.
 * Acepta formato argentino ("1.234,56") y formato con punto decimal ("1234.56").
 * Devuelve null si no es un monto válido mayor a cero.
 */
export function parseAmount(input: string): number | null {
  let s = input.trim().replace(/\$/g, '').replace(/\s/g, '');
  if (s === '') return null;

  if (s.includes(',')) {
    // Formato argentino: los puntos son miles y la coma es el decimal
    s = s.replace(/\./g, '').replace(',', '.');
  } else {
    const dots = (s.match(/\./g) ?? []).length;
    if (dots > 1) {
      s = s.replace(/\./g, '');
    } else if (dots === 1 && /^\d{1,3}\.\d{3}$/.test(s)) {
      // "1.500" se interpreta como mil quinientos, no como 1,5
      s = s.replace('.', '');
    }
  }

  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

/** Formato corto para gráficos: $950, $48k, $1,2M */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1).replace('.', ',').replace(',0', '')}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${Math.round(value)}`;
}
