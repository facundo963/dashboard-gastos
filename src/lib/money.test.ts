import { describe, expect, it } from 'vitest';
import { formatCompact, parseAmount } from './money';

describe('parseAmount', () => {
  it.each([
    ['1500', 1500],
    ['1.500', 1500],
    ['1.234,56', 1234.56],
    ['1234.56', 1234.56],
    ['$ 2.000.000', 2000000],
    ['99,9', 99.9],
  ])('convierte "%s" en %d', (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each(['', '0', '-50', 'abc', '12,34,56', '1.2.3,4,5'])('rechaza "%s"', (input) => {
    expect(parseAmount(input)).toBeNull();
  });
});

describe('formatCompact', () => {
  it('abrevia miles y millones', () => {
    expect(formatCompact(950)).toBe('$950');
    expect(formatCompact(48_400)).toBe('$48k');
    expect(formatCompact(1_250_000)).toBe('$1,3M');
    expect(formatCompact(2_000_000)).toBe('$2M');
  });
});
