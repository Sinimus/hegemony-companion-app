/**
 * Formats a deducted value for a result row: 0 renders as '0' (never '-0'),
 * a positive value as '−5' (U+2212 minus sign), a negative input (a gain,
 * which should not happen) as its absolute value with no sign.
 */
export function formatDeduction(value: number): string {
  if (value === 0) return '0';
  return value > 0 ? `−${value}` : `${Math.abs(value)}`;
}
