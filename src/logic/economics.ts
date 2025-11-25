import type { PolicyLevel } from '@/types/game';

// Konfigurace hodnot podle pravidel Hegemony
export const WAGE_LEVELS = {
  A: 20, // Pro-Labor (Vysoká mzda)
  B: 15, // Balanced
  C: 10  // Free Market (Nízká mzda)
};

export const TAX_MULTIPLIERS = {
  A: 1.5, // Progressive
  B: 1.0, // Flat
  C: 0.5  // Tax Haven
};

export const getMinimumWage = (laborPolicy: PolicyLevel) => WAGE_LEVELS[laborPolicy];

export const calculateProductionCost = (
  companies: number,
  laborPolicy: PolicyLevel,
  operationalCostPerCompany: number = 10
) => {
  const wage = getMinimumWage(laborPolicy);
  const wagesTotal = companies * wage;
  const opsTotal = companies * operationalCostPerCompany;
  return {
    wagePerWorker: wage,
    totalWages: wagesTotal,
    totalOps: opsTotal,
    totalCost: wagesTotal + opsTotal
  };
};

export const calculateCorporateTax = (
  revenue: number,
  taxPolicy: PolicyLevel
) => {
  // Zjednodušený model daně pro MVP (v plné hře je to složitější tabulka)
  const baseTax = Math.floor(revenue / 10);
  const multiplier = TAX_MULTIPLIERS[taxPolicy];
  return Math.ceil(baseTax * multiplier);
};