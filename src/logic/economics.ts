import type { PolicyLevel } from '@/types/game';
import {
  CORPORATE_TAX_TABLE,
  TAX_MULTIPLIER_CONSTANTS,
  WELFARE_TAX_MODIFIERS,
  WORKER_INCOME_TAX_RATES,
} from './taxData';

export type WageLevel = 'L1' | 'L2' | 'L3';

// Labor Market (Policy 2) only limits the wage level on each Company card (p. 30).
export const ALLOWED_WAGE_LEVELS: Record<PolicyLevel, readonly WageLevel[]> = {
  A: ['L3'],
  B: ['L2', 'L3'],
  C: ['L1', 'L2', 'L3'],
};

export function getAllowedWageLevels(laborPolicy: PolicyLevel): readonly WageLevel[] {
  return ALLOWED_WAGE_LEVELS[laborPolicy];
}

// Price of one Health/Education benefit per level of Policy 4 / Policy 5 (p. 31).
export const PUBLIC_SERVICE_PRICE: Record<PolicyLevel, number> = { A: 0, B: 5, C: 10 };

// Extra Workers per round from Immigration (Policy 7) on top of the base 2 (p. 32).
export const IMMIGRATION_EXTRA_WORKERS: Record<PolicyLevel, number> = { A: 0, B: 1, C: 2 };

/**
 * Central calculation of the Tax Multiplier from Policies 3, 4 and 5.
 * Used for the Employment Tax of the CC/MC.
 * Rules: P3 sets the base (3/2/1) and the modifier effect (Double/Normal/Ignore P4/P5).
 */
export const calculateTaxMultiplier = (
  p3: PolicyLevel,
  p4: PolicyLevel,
  p5: PolicyLevel
): number => {
  const p3Const = TAX_MULTIPLIER_CONSTANTS[p3];
  let multiplier = p3Const.base;
  let modifierSum = 0;

  // 1. Sum the modifiers from P4 and P5
  modifierSum += WELFARE_TAX_MODIFIERS.P4[p4];
  modifierSum += WELFARE_TAX_MODIFIERS.P5[p5];

  // 2. Apply the P3 effect to the modifier sum
  if (p3Const.multiplierEffect === 'double') {
    multiplier += modifierSum * 2;
  } else if (p3Const.multiplierEffect === 'normal') {
    multiplier += modifierSum;
  }
  // With 'ignore' (P3 = C) nothing is added

  // The Tax Multiplier is capped at 11.
  return Math.min(multiplier, 11);
};

/**
 * Exact Corporate Tax calculation from Revenue and P3.
 * Uses the lookup table from the rules. Does NOT use the Tax Multiplier.
 * @param revenue Money left in Revenue after the Employment Tax (p. 20)
 * @param taxPolicy Current Taxation Policy (P3)
 * @returns Tax due
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
    // Should not happen thanks to Infinity in the last row
    return 0;
  }

  return entry[taxPolicy];
};

/**
 * Calculates the Employment Tax for the Capitalist Class and the Middle Class.
 * Rule: Employment Tax = operational Companies x Tax Multiplier.
 * @param operationalCompanies Number of operational (incl. automated) Companies.
 * @param p3 Taxation Policy (P3) - determines the Tax Multiplier.
 * @param p4 Healthcare Policy (P4) - determines the Tax Multiplier.
 * @param p5 Education Policy (P5) - determines the Tax Multiplier.
 * @returns Tax due (¥).
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
 * Income Tax rate from the Income Tax table (P2 row, P3 column).
 */
export function getIncomeTaxRate(laborPolicy: PolicyLevel, taxPolicy: PolicyLevel): number {
  return WORKER_INCOME_TAX_RATES[laborPolicy][taxPolicy];
}

/**
 * Working Class Income Tax: rate per Population times Population (p. 17).
 */
export function calculateWorkingClassIncomeTax(
  population: number,
  laborPolicy: PolicyLevel,
  taxPolicy: PolicyLevel
): number {
  return getIncomeTaxRate(laborPolicy, taxPolicy) * Math.max(0, population);
}

/**
 * Middle Class Income Tax: rate times the number of other players' Companies
 * (Capitalist or Public) where Middle Class Workers work (p. 25).
 */
export function calculateMiddleClassIncomeTax(
  otherCompanies: number,
  laborPolicy: PolicyLevel,
  taxPolicy: PolicyLevel
): number {
  return getIncomeTaxRate(laborPolicy, taxPolicy) * Math.max(0, otherCompanies);
}

export interface CapitalistTaxInput {
  revenue: number;              // money in Revenue before wages
  wages: number;                // sum of the wages on your Companies at their current level
  operationalCompanies: number; // Companies with Workers plus automated ones
  taxPolicy: PolicyLevel;       // P3
  healthPolicy: PolicyLevel;    // P4
  educationPolicy: PolicyLevel; // P5
}

export interface CapitalistTaxResult {
  afterWages: number;
  employmentTax: number;
  taxableRevenue: number; // Revenue left after the Employment Tax, never below 0
  corporateTax: number;
  capitalChange: number;  // afterWages - employmentTax - corporateTax; negative means Capital pays the rest
}

/**
 * Capitalist Class taxes in paying order (p. 20): wages come out of Revenue
 * first, then the Employment Tax, then Corporate Tax on the Revenue that remains.
 * What Revenue cannot cover is taken from Capital (FAQ p. 38).
 */
export function calculateCapitalistTaxes(input: CapitalistTaxInput): CapitalistTaxResult {
  const afterWages = input.revenue - input.wages;
  const employmentTax = calculateEmploymentTax(
    input.operationalCompanies,
    input.taxPolicy,
    input.healthPolicy,
    input.educationPolicy
  );
  const taxableRevenue = Math.max(0, afterWages - employmentTax);
  const corporateTax = calculateCorporateTax(taxableRevenue, input.taxPolicy);

  return {
    afterWages,
    employmentTax,
    taxableRevenue,
    corporateTax,
    capitalChange: afterWages - employmentTax - corporateTax,
  };
}

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
