import type { PolicyLevel } from '@/types/game';

// Konfigurace daňových sazeb pro Dělníky a Stát
export const INCOME_TAX_RATES = {
  A: 0.20, // Progressive (Vysoká)
  B: 0.10, // Flat
  C: 0.00  // Tax Haven (Žádná)
};

export const STATE_WAGE_COSTS = {
  A: 20, // Social State (Vysoké platy ve veřejném sektoru)
  B: 15,
  C: 10
};

export const calculateNetWage = (
  workers: number,
  wageLevel: number, // Hodnota mzdy (např. 20)
  taxPolicy: PolicyLevel
) => {
  const grossIncome = workers * wageLevel;
  const taxRate = INCOME_TAX_RATES[taxPolicy];
  const tax = Math.floor(grossIncome * taxRate);
  return {
    gross: grossIncome,
    tax: tax,
    net: grossIncome - tax
  };
};

export const calculateStateBalance = (
  stateEmployees: number,
  privateCompanies: number,
  fiscalPolicy: PolicyLevel,
  taxPolicy: PolicyLevel
) => {
  const wageCost = stateEmployees * STATE_WAGE_COSTS[fiscalPolicy];
  // Odhad příjmu z korporátní daně (průměr 20 revenue na firmu)
  const estimatedCorpTax = privateCompanies * (taxPolicy === 'A' ? 5 : taxPolicy === 'B' ? 3 : 1);

  return {
    expenses: wageCost,
    revenue: estimatedCorpTax,
    balance: estimatedCorpTax - wageCost
  };
};

/**
 * Calculates the maximum safe loan limit for The State based on Fiscal Policy (P1).
 * IMF Intervention is triggered if the State has more loans than this limit (AND cannot pay 55¥/loan).
 * P1 A/B: Max 5 Loans
 * P1 C: Max 3 Loans
 * @param fiscalPolicy Current Fiscal Policy (P1).
 * @returns Maximum safe loan count.
 */
export const getIMFLoanLimit = (fiscalPolicy: PolicyLevel): number => {
    if (fiscalPolicy === 'C') {
        return 3;
    }
    // A and B allow more liberal borrowing, typically up to 5 loans.
    return 5;
};