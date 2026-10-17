import { describe, expect, it } from 'vitest';
import { isImfInterventionDue } from '@/logic/taxes';
import { calculateWelfareSale } from '@/logic/scoring';

// Examples from Hegemony English Rulebook v1.2 (rules collection `boardgames`, game `hegemony`).

describe('State: Check IMF (Fiscal Policy, p. 30; Production Phase, p. 12)', () => {
  it('intervenes with 1 Loan under Fiscal Policy C, not with 0', () => {
    expect(isImfInterventionDue(1, 'C')).toBe(true);
    expect(isImfInterventionDue(0, 'C')).toBe(false);
  });

  it('does not intervene with 1 Loan under Fiscal Policy B, but does with 2', () => {
    expect(isImfInterventionDue(1, 'B')).toBe(false);
    expect(isImfInterventionDue(2, 'B')).toBe(true);
  });

  it('intervenes with 2 Loans under Fiscal Policy A', () => {
    expect(isImfInterventionDue(2, 'A')).toBe(true);
  });
});

describe('State: Welfare sales (p. 26-27)', () => {
  it('section B gives 1 VP per sale, whatever the amount sold', () => {
    expect(calculateWelfareSale('B', 6)).toEqual({ vpGain: 1, legitimacyGain: 0 });
  });

  it('section B gives nothing when nothing is sold', () => {
    expect(calculateWelfareSale('B', 0)).toEqual({ vpGain: 0, legitimacyGain: 0 });
  });

  it('section A gives 1 Legitimacy per 3 resources sold: 6 -> 2, 5 -> 1', () => {
    expect(calculateWelfareSale('A', 6)).toEqual({ vpGain: 0, legitimacyGain: 2 });
    expect(calculateWelfareSale('A', 5)).toEqual({ vpGain: 0, legitimacyGain: 1 });
  });

  it('section C gives nothing', () => {
    expect(calculateWelfareSale('C', 9)).toEqual({ vpGain: 0, legitimacyGain: 0 });
  });
});
