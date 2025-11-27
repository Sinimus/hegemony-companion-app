import type { PolicyLevel } from '@/types/game';
import {
  CORPORATE_TAX_TABLE,
  TAX_MULTIPLIER_CONSTANTS,
  WELFARE_TAX_MODIFIERS,
} from './taxData';

// Konfigurace hodnot podle pravidel Hegemony
export const WAGE_LEVELS = {
  A: 20, // Pro-Labor (Vysoká mzda)
  B: 15, // Balanced
  C: 10  // Free Market (Nízká mzda)
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

/**
 * Centrální výpočet hodnoty Tax Multiplieru na základě Policy 3, 4 a 5.
 * Používá se pro výpočet Employment Tax a Wage Tax (CC/MC).
 * Pravidla: P3 určuje Base (3/2/1) a Modifikační Efekt (Double/Normal/Ignore P4/P5).
 */
export const calculateTaxMultiplier = (
  p3: PolicyLevel,
  p4: PolicyLevel,
  p5: PolicyLevel
): number => {
  const p3Const = TAX_MULTIPLIER_CONSTANTS[p3];
  let multiplier = p3Const.base;
  let modifierSum = 0;

  // 1. Sečtení modifikátorů z P4 a P5
  modifierSum += WELFARE_TAX_MODIFIERS.P4[p4];
  modifierSum += WELFARE_TAX_MODIFIERS.P5[p5];

  // 2. Aplikace efektu P3 na součet modifikátorů
  if (p3Const.multiplierEffect === 'double') {
    multiplier += modifierSum * 2;
  } else if (p3Const.multiplierEffect === 'normal') {
    multiplier += modifierSum;
  }
  // Pokud je 'ignore' (P3 = C), nepřičítá se nic

  // Max hodnota Tax Multiplieru je 11.
  return Math.min(multiplier, 11);
};

/**
 * Přesný výpočet Corporate Tax na základě Revenue a P3.
 * Využívá lookup tabulku z pravidel. NEPOUŽÍVÁ Tax Multiplier.
 * @param revenue Aktuální Revenue (příjem po zaplacení provozních nákladů)
 * @param taxPolicy Aktuální Taxation Policy (P3)
 * @returns Daňová povinnost
 */
export const calculateCorporateTax = (
  revenue: number,
  taxPolicy: PolicyLevel
): number => {
  if (revenue <= 0) return 0;

  const entry = CORPORATE_TAX_TABLE.find(
    (row) => revenue <= row.maxRevenue
  );

  if (!entry) {
    // Teoreticky by se to nemělo stát kvůli Infinity v poslední řádce
    return 0;
  }

  return entry[taxPolicy];
};

/**
 * Vypočítá Employment Tax pro Capitalist Class a Middle Class.
 * Pravidlo: Employment Tax = Operational Companies x Tax Multiplier.
 * @param operationalCompanies Počet funkčních/automatizovaných společností.
 * @param p3 Taxation Policy (P3) - pro určení Tax Multiplieru.
 * @param p4 Healthcare Policy (P4) - pro určení Tax Multiplieru.
 * @param p5 Education Policy (P5) - pro určení Tax Multiplieru.
 * @returns Daňová povinnost (¥).
 */
export const calculateEmploymentTax = (
  operationalCompanies: number,
  p3: PolicyLevel,
  p4: PolicyLevel,
  p5: PolicyLevel
): number => {
  const taxMultiplier = calculateTaxMultiplier(p3, p4, p5);
  return operationalCompanies * taxMultiplier;
};

/**
 * Calculates mandatory loan costs and penalties for planning purposes.
 * @param loanCount Current number of Loans (0-N).
 */
export const calculateLoanCosts = (loanCount: number) => {
    if (loanCount <= 0) {
        return { interestCost: 0, payoffCost: 0, maxWcMcPenalty: 0, maxCcPenalty: 0 };
    }

    const interestPerLoan = 5; // Paid in Preparation Phase
    const payoffPerLoan = 50;  // Paid with Free Action

    // Max penalty for WC/MC/State if they cannot pay 55¥ per loan at end-game. (-1 VP per 5¥ unpaid)
    const maxWcMcPenaltyPerLoan = 11; // 55 / 5 = 11

    // CC penalty is fixed -5 VP per loan.
    const ccPenaltyPerLoan = 5;

    return {
        interestCost: loanCount * interestPerLoan,
        payoffCost: loanCount * payoffPerLoan,
        maxWcMcPenalty: loanCount * maxWcMcPenaltyPerLoan,
        maxCcPenalty: loanCount * ccPenaltyPerLoan,
    };
};