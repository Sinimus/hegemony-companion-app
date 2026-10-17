import { describe, it, expect } from 'vitest';
import { formatDeduction } from '@/lib/format';

describe('formatDeduction', () => {
  it('renders 0 as "0", never "-0"', () => {
    expect(formatDeduction(0)).toBe('0');
  });

  it('renders a positive deduction with the U+2212 minus sign', () => {
    expect(formatDeduction(5)).toBe('−5');
  });

  it('renders a negative input (a gain) as its absolute value with no sign', () => {
    expect(formatDeduction(-3)).toBe('3');
  });
});
