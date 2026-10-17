import { describe, expect, it } from 'vitest';
import { calculateEmploymentTax, calculateLoanCosts, calculateTaxMultiplier } from '@/logic/economics';

// Examples from Hegemony English Rulebook v1.2 (rules collection `boardgames`, game `hegemony`).

describe('Tax Multiplier (Taxation, p. 30-31)', () => {
  it('starts at 5 with Policies 3/4/5 in A/B/C (Example 1)', () => {
    expect(calculateTaxMultiplier('A', 'B', 'C')).toBe(5);
  });

  it('is 6 with Policies 3/4/5 in B/A/A (Example 2)', () => {
    expect(calculateTaxMultiplier('B', 'A', 'A')).toBe(6);
  });

  it('ignores the welfare modifiers when Taxation is in C', () => {
    expect(calculateTaxMultiplier('C', 'A', 'A')).toBe(1);
  });

  it('reaches at most 11 (base 3 plus doubled +2 and +2)', () => {
    expect(calculateTaxMultiplier('A', 'A', 'A')).toBe(11);
  });
});

describe('Employment Tax = operational Companies x Tax Multiplier', () => {
  it('Capitalist Class: 7 operational Companies at TM 6 pay 42 (Production Phase, p. 20)', () => {
    // TM 6 = Policies 3/4/5 in B/A/A
    expect(calculateEmploymentTax(7, 'B', 'A', 'A')).toBe(42);
  });

  it('Middle Class: 6 operational Companies at TM 5 pay 30 (Middle Class Production Phase, p. 25)', () => {
    // TM 5 = Policies 3/4/5 in A/B/C
    expect(calculateEmploymentTax(6, 'A', 'B', 'C')).toBe(30);
  });
});

describe('Loans (Loans, p. 33; Game End, p. 13)', () => {
  it('costs 5 interest and 50 to pay off per Loan', () => {
    expect(calculateLoanCosts(2)).toMatchObject({ interestCost: 10, payoffCost: 100 });
  });

  it('caps the end-game penalty at 11 VP per Loan (55 unpaid) and 5 VP for the Capitalist Class', () => {
    expect(calculateLoanCosts(1)).toMatchObject({ maxWcMcPenalty: 11, maxCcPenalty: 5 });
  });

  it('costs nothing without Loans', () => {
    expect(calculateLoanCosts(0)).toEqual({ interestCost: 0, payoffCost: 0, maxWcMcPenalty: 0, maxCcPenalty: 0 });
  });
});
