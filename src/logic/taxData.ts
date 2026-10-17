import type { PolicyLevel } from '@/types/game';

// 1. Constants for the Tax Multiplier calculation (P3, P4, P5)
// Based on the rules: P3 sets the base (3/2/1) and the modifier effect (Double/Normal/Ignore P4/P5)
export const TAX_MULTIPLIER_CONSTANTS: Record<PolicyLevel, { base: number; multiplierEffect: 'double' | 'normal' | 'ignore' }> = {
  A: { base: 3, multiplierEffect: 'double' },
  B: { base: 2, multiplierEffect: 'normal' },
  C: { base: 1, multiplierEffect: 'ignore' },
};

export const WELFARE_TAX_MODIFIERS: Record<'P4' | 'P5', Record<PolicyLevel, number>> = {
  P4: { A: 2, B: 1, C: 0 }, // P4: A=+2, B=+1, C=0
  P5: { A: 2, B: 1, C: 0 }, // P5: A=+2, B=+1, C=0
};

// 2. Corporate Tax table (based on Revenue and the P3 Taxation Policy)
// The table shows how many Vardis (¥) are paid for a given Revenue
// Data source: Hegemony rulebook corporate tax tables
export const CORPORATE_TAX_TABLE: { maxRevenue: number; A: number; B: number; C: number }[] = [
  { maxRevenue: 9, A: 1, B: 2, C: 2 },
  { maxRevenue: 24, A: 5, B: 5, C: 4 },
  { maxRevenue: 49, A: 12, B: 7, C: 7 },
  { maxRevenue: 99, A: 24, B: 10, C: 10 },
  { maxRevenue: 199, A: 40, B: 20, C: 20 },
  { maxRevenue: 299, A: 100, B: 40, C: 40 },
  { maxRevenue: Infinity, A: 160, B: 70, C: 60 },
];

// Only Revenue 81 at P3 A = 24 is confirmed by a rulebook example (p. 20); the other cells are unverified.

// 3. Income Tax table (Working Class) - used in WorkerBudget
// This table defines a fixed tax (Vardis) per Population/Worker
// Data source: Hegemony rulebook income tax tables
export const WORKER_INCOME_TAX_RATES: Record<PolicyLevel, Record<PolicyLevel, number>> = {
  A: { A: 7, B: 6, C: 5 }, // Labor Market 2A
  B: { A: 4, B: 4, C: 4 }, // Labor Market 2B
  C: { A: 1, B: 2, C: 3 }, // Labor Market 2C
};

// Confirmed by rulebook examples: P2 C / P3 B = 2 (p. 17) and P2 A / P3 C = 5 (p. 25); the other cells are unverified.
export const VERIFIED_INCOME_TAX_CELLS: readonly (readonly [PolicyLevel, PolicyLevel])[] = [['C', 'B'], ['A', 'C']];

export function isIncomeTaxRateVerified(laborPolicy: PolicyLevel, taxPolicy: PolicyLevel): boolean {
  return VERIFIED_INCOME_TAX_CELLS.some(([labor, tax]) => labor === laborPolicy && tax === taxPolicy);
}
