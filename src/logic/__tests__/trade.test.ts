import { describe, expect, it } from 'vitest';
import { calculateImportCost } from '@/logic/trade';

// Foreign Trade (Hegemony English Rulebook v1.2, p. 32): tariffs per Food / Luxury
// are 10 / 6 in section A, 5 / 3 in B and none in C. The base price goes to the supply,
// the tariff to the State.

describe('Import tariffs by Foreign Trade policy (p. 32)', () => {
  it('section A charges 10 per Food and 6 per Luxury', () => {
    expect(calculateImportCost(2, 'food', 'A').tariffCost).toBe(20);
    expect(calculateImportCost(2, 'luxury', 'A').tariffCost).toBe(12);
  });

  it('section B charges 5 per Food and 3 per Luxury', () => {
    expect(calculateImportCost(2, 'food', 'B').tariffCost).toBe(10);
    expect(calculateImportCost(2, 'luxury', 'B').tariffCost).toBe(6);
  });

  it('section C charges no tariff', () => {
    expect(calculateImportCost(3, 'luxury', 'C')).toMatchObject({ tariffCost: 0, totalCost: 18 });
  });

  it('a Luxury from the Foreign Market costs 6 before tariffs (Basic Actions, p. 15-16)', () => {
    expect(calculateImportCost(1, 'luxury', 'C').baseCost).toBe(6);
  });
});
