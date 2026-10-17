import { describe, expect, it } from 'vitest';
import {
  calculateCapitalistTaxes,
  calculateMiddleClassIncomeTax,
  calculateWorkingClassIncomeTax,
  getAllowedWageLevels,
  getIncomeTaxRate,
  IMMIGRATION_EXTRA_WORKERS,
  PUBLIC_SERVICE_PRICE,
} from '@/logic/economics';
import { isIncomeTaxRateVerified } from '@/logic/taxData';

// Examples from Hegemony English Rulebook v1.2 (rules collection `boardgames`, game `hegemony`).

describe('Labor Market (Policy 2, p. 30)', () => {
  it('allows only L3 in A', () => {
    expect(getAllowedWageLevels('A')).toEqual(['L3']);
  });

  it('allows L2 and L3 in B', () => {
    expect(getAllowedWageLevels('B')).toEqual(['L2', 'L3']);
  });

  it('allows L1, L2 and L3 in C', () => {
    expect(getAllowedWageLevels('C')).toEqual(['L1', 'L2', 'L3']);
  });
});

describe('Working Class Income Tax (p. 17)', () => {
  it('P2 C / P3 B with Population 5 pays 2 per Population, 10 in total', () => {
    expect(getIncomeTaxRate('C', 'B')).toBe(2);
    expect(calculateWorkingClassIncomeTax(5, 'C', 'B')).toBe(10);
  });
});

describe('Middle Class Income Tax (p. 25)', () => {
  it('Workers in 3 other Companies, P2 A / P3 C pay 5 each, 15 in total', () => {
    expect(calculateMiddleClassIncomeTax(3, 'A', 'C')).toBe(15);
  });
});

describe('Capitalist Class taxes (Production Phase, p. 20)', () => {
  it('pays the Employment Tax 7 x TM 6 = 42 first, leaving Revenue 81', () => {
    // TM 6 = Policies 3/4/5 in B/A/A
    const result = calculateCapitalistTaxes({
      revenue: 123,
      wages: 0,
      operationalCompanies: 7,
      taxPolicy: 'B',
      healthPolicy: 'A',
      educationPolicy: 'A',
    });
    expect(result.employmentTax).toBe(42);
    expect(result.taxableRevenue).toBe(81);
  });

  it('Revenue 126 with wages 20 and 5 Companies at TM 5 pays Corporate Tax 24 and moves 57 to Capital', () => {
    // TM 5 = Policies 3/4/5 in A/B/C; 126 - 20 - 25 = 81 left in Revenue
    const result = calculateCapitalistTaxes({
      revenue: 126,
      wages: 20,
      operationalCompanies: 5,
      taxPolicy: 'A',
      healthPolicy: 'B',
      educationPolicy: 'C',
    });
    expect(result.corporateTax).toBe(24);
    expect(result.capitalChange).toBe(57);
  });

  it('pays wages before taxes; what Revenue cannot cover comes from Capital (FAQ p. 38)', () => {
    // TM 5 = Policies 3/4/5 in A/B/C
    const result = calculateCapitalistTaxes({
      revenue: 30,
      wages: 40,
      operationalCompanies: 1,
      taxPolicy: 'A',
      healthPolicy: 'B',
      educationPolicy: 'C',
    });
    expect(result.afterWages).toBe(-10);
    expect(result.taxableRevenue).toBe(0);
    expect(result.corporateTax).toBe(0);
    expect(result.capitalChange).toBe(-15);
  });
});

describe('Income Tax table verification (p. 17, p. 25)', () => {
  it('marks P2 C / P3 B as verified', () => {
    expect(isIncomeTaxRateVerified('C', 'B')).toBe(true);
  });

  it('marks P2 B / P3 B as unverified', () => {
    expect(isIncomeTaxRateVerified('B', 'B')).toBe(false);
  });
});

describe('Public Health and Education (p. 31)', () => {
  it('prices a benefit at A free, B 5 and C 10', () => {
    expect(PUBLIC_SERVICE_PRICE.A).toBe(0);
    expect(PUBLIC_SERVICE_PRICE.B).toBe(5);
    expect(PUBLIC_SERVICE_PRICE.C).toBe(10);
  });
});

describe('Immigration (Policy 7, p. 32)', () => {
  it('adds 0, 1 or 2 extra Workers on top of the base 2', () => {
    expect(IMMIGRATION_EXTRA_WORKERS.A).toBe(0);
    expect(IMMIGRATION_EXTRA_WORKERS.B).toBe(1);
    expect(IMMIGRATION_EXTRA_WORKERS.C).toBe(2);
  });
});
