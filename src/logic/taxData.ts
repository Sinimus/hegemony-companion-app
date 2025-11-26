import type { PolicyLevel } from '@/types/game';

// 1. Konstanty pro výpočet Tax Multiplieru (P3, P4, P5)
// Založeno na pravidlech: P3 určuje Base (3/2/1) a Modifikační Efekt (Double/Normal/Ignore P4/P5)
export const TAX_MULTIPLIER_CONSTANTS: Record<PolicyLevel, { base: number; multiplierEffect: 'double' | 'normal' | 'ignore' }> = {
  A: { base: 3, multiplierEffect: 'double' },
  B: { base: 2, multiplierEffect: 'normal' },
  C: { base: 1, multiplierEffect: 'ignore' },
};

export const WELFARE_TAX_MODIFIERS: Record<'P4' | 'P5', Record<PolicyLevel, number>> = {
  P4: { A: 2, B: 1, C: 0 }, // P4: A=+2, B=+1, C=0
  P5: { A: 2, B: 1, C: 0 }, // P5: A=+2, B=+1, C=0
};

// 2. Tabulka pro Corporate Tax (založeno na Revenue a P3 Taxation Policy)
// Tabulka ukazuje, kolik Vardis (¥) se platí, na základě příjmů (Revenue)
// Zdroj dat: Hegemony rulebook corporate tax tables
export const CORPORATE_TAX_TABLE: { maxRevenue: number; A: number; B: number; C: number }[] = [
  { maxRevenue: 9, A: 1, B: 2, C: 2 },
  { maxRevenue: 24, A: 5, B: 5, C: 4 },
  { maxRevenue: 49, A: 12, B: 7, C: 7 },
  { maxRevenue: 99, A: 24, B: 10, C: 10 },
  { maxRevenue: 199, A: 40, B: 20, C: 20 },
  { maxRevenue: 299, A: 100, B: 40, C: 40 },
  { maxRevenue: Infinity, A: 160, B: 70, C: 60 },
];

// 3. Tabulka pro Income Tax (Working Class) - používá se v WorkerBudget
// Tato tabulka definuje fixní daň (Vardis) na Population/Worker
// Zdroj dat: Hegemony rulebook income tax tables
export const WORKER_INCOME_TAX_RATES: Record<PolicyLevel, Record<PolicyLevel, number>> = {
  A: { A: 7, B: 6, C: 5 }, // Labor Market 2A
  B: { A: 4, B: 4, C: 4 }, // Labor Market 2B
  C: { A: 1, B: 2, C: 3 }, // Labor Market 2C
};