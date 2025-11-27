import { WEALTH_TRACK, PROSPERITY_LEVELS, getVpForNewProsperity, POLITICAL_AGENDA_POLICIES_1_5, POLITICAL_AGENDA_POLICIES_6_7, END_GAME_VP_ALIGNMENT, END_GAME_VP_CONVERSION } from './scoringData';
import { WORKER_INCOME_TAX_RATES } from './taxData';
import type { PolicyLevel, PolicyType, PlayerClass } from '@/types/game';

/**
 * Funkce pro výpočet VP Capitalist Class na základě aktuálního Capital.
 * Výpočet probíhá ve dvou částech: Základní VP + Bonusové VP (za posun markery).
 * @param currentCapital Aktuální hodnota v Capital Area (po Pay Taxes).
 * @param previousCapital Předchozí hodnota Capital, pro určení bonusu.
 */
export const calculateCapitalistVp = (
  currentCapital: number,
  previousCapital: number
): { baseVp: number; bonusVp: number; totalVp: number; currentLevel: number; previousLevel: number } => {
  if (currentCapital < 0) currentCapital = 0;
  if (previousCapital < 0) previousCapital = 0;

  // 1. Najdi aktuální VP bracket
  const currentBracket = WEALTH_TRACK.find(
    (bracket) => currentCapital >= bracket.minCapital && currentCapital <= bracket.maxCapital
  ) || WEALTH_TRACK[0]; // Mělo by vždy najít platnou, ale fallback na 0.

  // 2. Najdi předchozí VP bracket pro srovnání
  const previousBracket = WEALTH_TRACK.find(
    (bracket) => previousCapital >= bracket.minCapital && previousCapital <= bracket.maxCapital
  ) || WEALTH_TRACK[0];

  const baseVp = currentBracket.baseVp;
  const currentLevelIndex = WEALTH_TRACK.indexOf(currentBracket);
  const previousLevelIndex = WEALTH_TRACK.indexOf(previousBracket);

  let bonusVp = 0;

  // Pravidlo pro bonusové VP: Získává 3 VP za každý PŘESUN doprava.
  // Pohyb doleva/žádný pohyb bonus VP negeneruje.
  if (currentLevelIndex > previousLevelIndex) {
    const stepsMoved = currentLevelIndex - previousLevelIndex;
    bonusVp = stepsMoved * 3;
  }

  return {
    baseVp,
    bonusVp,
    totalVp: baseVp + bonusVp,
    currentLevel: currentLevelIndex,
    previousLevel: previousLevelIndex,
  };
};

/**
 * Implementace Income Tax pro Working Class
 * Používá tabulku WORKER_INCOME_TAX_RATES (z taxData.ts)
 */
export const calculateWorkerIncomeTax = (
  workers: number,
  laborPolicy: PolicyLevel, // P2
  taxPolicy: PolicyLevel    // P3
): number => {
  const taxPerWorker = WORKER_INCOME_TAX_RATES[laborPolicy][taxPolicy];
  return workers * taxPerWorker;
};

export type ProsperityAction = 'healthcare' | 'education' | 'luxury' | 'none';

/**
 * Vypočítá VP získané z jedné Prosperity akce pro Working Class.
 * @param currentLevel Aktuální level Prosperity před provedením akce (0-9).
 * @param action Akce vedoucí k zisku Prosperity.
 * @returns Celkové VP získané za 1 krok Prosperity.
 */
export const calculateWorkingClassProsperityVp = (
  currentLevel: number,
  action: ProsperityAction
): { gainedVp: number; newLevel: number; bonusVp: number } => {
  // Pokud je již na Levelu 10, VP se získají, ale level se nezvyšuje.
  if (currentLevel >= PROSPERITY_LEVELS.length - 1) {
    const currentVp = getVpForNewProsperity(currentLevel);
    // Vrací se VP za aktuální level (VP = nová hodnota, která je stejná jako stará), bonus je 0.
    return { gainedVp: currentVp, newLevel: currentLevel, bonusVp: 0 };
  }

  const newLevel = currentLevel + 1;
  let gainedVp = getVpForNewProsperity(newLevel);
  let bonusVp = 0;

  // Speciální bonus pro Use Healthcare: +2 bonus VP.
  if (action === 'healthcare') {
    bonusVp = 2;
  }

  return {
    gainedVp: gainedVp + bonusVp,
    newLevel,
    bonusVp,
  };
};

// Znovu použijeme logiku WC, protože MC má stejné VP zisky z akcí.
export const calculateMiddleClassProsperityVp = (
  currentLevel: number,
  action: ProsperityAction
): { gainedVp: number; newLevel: number; bonusVp: number } => {
  // MC sdílí stejné VP zisky z akcí (+2 pro Healthcare) jako WC.
  return calculateWorkingClassProsperityVp(currentLevel, action);
};

/**
 * Kontrola, zda Middle Class získá 1 Prosperity zdarma v Scoring Phase.
 * Pravidlo: If your Prosperity value is lower than the number of fully operational Companies (2 workers), gain 1 Prosperity for free.
 * @param currentProsperityLevel Aktuální level Prosperity (0-10)
 * @param fullyOperationalCompanies Počet plně operativních společností (2 Workers)
 */
export const canMiddleClassGainProsperity = (
  currentProsperityLevel: number,
  fullyOperationalCompanies: number
): boolean => {
  // MC Prosperity track jde jen do 10. Nemůže se posunout, pokud je již na 10.
  const maxLevel = PROSPERITY_LEVELS.length - 1;

  if (currentProsperityLevel >= maxLevel) return false;

  return currentProsperityLevel < fullyOperationalCompanies;
};

/**
 * Vypočítá VP ze State Legitimacy Tracks.
 * Pravidlo: Gain VP equal to the sum of the two lowest Legitimacy values.
 * @param workingClassLegitimacy Level WC Legitimacy (0-10)
 * @param middleClassLegitimacy Level MC Legitimacy (0-10)
 * @param capitalistClassLegitimacy Level CC Legitimacy (0-10)
 * @returns VP získané ze Scoring Phase.
 */
export const calculateStateLegitimacyVp = (
  workingClassLegitimacy: number,
  middleClassLegitimacy: number,
  capitalistClassLegitimacy: number
): number => {
  const scores = [workingClassLegitimacy, middleClassLegitimacy, capitalistClassLegitimacy];

  // Omezení hodnot na povolený rozsah 0-10
  const clampedScores = scores.map(score => Math.max(0, Math.min(10, score)));

  // Seřazení od nejmenšího po největší
  clampedScores.sort((a, b) => a - b);

  // Součet dvou nejnižších
  const lowestTwoSum = clampedScores[0] + clampedScores[1];

  return lowestTwoSum;
};

/**
 * Vypočítá VP z Political Agenda karty.
 * Pravidlo: Gain 1 VP for each Policy that matches the card's target section.
 * @param policies Aktuální stav všech 7 politik (z useGameStore).
 * @param agendaCard Cílové sekce na Political Agenda kartě.
 * @returns VP získané z Political Agenda (Max 7 VP).
 */
export const calculateStateAgendaVp = (
  policies: Record<PolicyType, PolicyLevel>,
  agendaCard: Record<PolicyType, PolicyLevel>
): number => {
  let matchingPolicies = 0;

  // Zkontroluj všech 7 politik
  const allPolicyTypes: PolicyType[] = [...POLITICAL_AGENDA_POLICIES_1_5, ...POLITICAL_AGENDA_POLICIES_6_7];

  for (const key of allPolicyTypes) {
    if (policies[key] === agendaCard[key]) {
      matchingPolicies++;
    }
  }

  return matchingPolicies; // Max 7
};

/**
 * Logika pro snížení Legitimacy v Scoring Phase.
 * Pravidlo: All Legitimacy markers move to half of their current values (rounded up).
 * @param currentLevel Aktuální level Legitimacy (0-10)
 * @returns Nový level po snížení.
 */
export const dropLegitimacy = (currentLevel: number): number => {
  // Zaokrouhlení nahoru (rounded up)
  return Math.ceil(currentLevel / 2);
};

// --- NEW MICRO-UTILITY LOGIC ---

/**
 * Calculates VP gained by Working Class from Trade Unions during Scoring Phase.
 * Rule: WC gains 2 VP per Trade Union marker on the board.
 * @param tradeUnionCount Number of Trade Union markers the WC player controls.
 * @returns VP gained this round.
 */
export const calculateTradeUnionVp = (tradeUnionCount: number): number => {
    return tradeUnionCount * 2;
};

/**
 * Calculates recurring VP/Legitimacy gains for The State based on P4/P5 sales.
 * Rules depend on P4/P5 level, calculated per 3 benefit tokens sold.
 * P4/P5 in A: +1 Legitimacy per 3 sold.
 * P4/P5 in B: +1 VP per 3 sold.
 * P4/P5 in C: No benefit for the State.
 * @param policyLevel Current level of P4 or P5.
 * @param benefitsSold Number of Health or Education tokens sold this round.
 */
export const calculateWelfareBenefits = (
    policyLevel: PolicyLevel,
    benefitsSold: number
): { vpGain: number; legitimacyGain: number } => {
    const setsOfThree = Math.floor(benefitsSold / 3);

    if (policyLevel === 'A') {
        // P4/P5 in A (Free Public): +1 Legitimacy per 3 sold.
        return { vpGain: 0, legitimacyGain: setsOfThree };
    }
    if (policyLevel === 'B') {
        // P4/P5 in B (Subsidized): +1 VP per 3 sold.
        return { vpGain: setsOfThree, legitimacyGain: 0 };
    }
    // P4/P5 in C (Private): No gain for the State.
    return { vpGain: 0, legitimacyGain: 0 };
};

// --- NEW AUTOMA ASSISTANT LOGIC (Simplified Priority Check) ---

/**
 * Simulates a simplified priority check for a Capitalist Automa/Bot.
 * This should eliminate the need to manually check the Automa flowchart for common scenarios.
 * Note: This is an illustrative simplification of Automa complexity.
 * @param currentCapital Current Capital value (used for Lobby check).
 * @param currentTaxMultiplier Current Tax Multiplier value (P3/P4/P5).
 */
export const getCapitalistAutomaPriority = (
    currentCapital: number,
    currentTaxMultiplier: number
): { action: string; tool: string } => {

    // Priority 1: Pay off loans (always critical)
    // We assume the user tracks loans manually, but the Automa priority check is vital.
    if (currentCapital >= 50 && currentTaxMultiplier > 7) {
        return { action: 'Pay Off Loan (50¥)', tool: 'LoanCostCalc' };
    }

    // Priority 2: Maintain Influence (Lobby check)
    // Assume influence below 5 is risky. Lobby costs 30¥ for 3 Influence.
    if (currentCapital >= 30 && currentTaxMultiplier < 5) {
        return { action: 'Lobby for Influence (30¥)', tool: 'WealthCalc' };
    }

    // Priority 3: Build/Optimize Companies (Core action)
    if (currentTaxMultiplier > 5) {
        return { action: 'Build / Automate Company', tool: 'ProductionCalc' };
    }

    // Priority 4: Score VP (Generic)
    return { action: 'Secure Market / Adjust Prices', tool: 'TradeCalc' };
};

/**
 * Calculates VP from Policy Alignment (Policies P1-P5).
 * @param policies The full current policy state.
 * @param alignmentClass The class determining the target section (A, B, or C).
 * @returns VP from alignment table lookup.
 */
const getPolicyAlignmentVp = (
  policies: Record<PolicyType, PolicyLevel>,
  alignmentClass: PolicyLevel // A for WC, B for MC, C for CC
): number => {
  const alignmentTarget = alignmentClass;
  let matchingCount = 0;

  // Check P1 through P5
  const policiesToScan: PolicyType[] = ['fiscal', 'labor', 'tax', 'health', 'education'];
  policiesToScan.forEach(policyId => {
    if (policies[policyId] === alignmentTarget) {
      matchingCount++;
    }
  });

  const alignmentTable = END_GAME_VP_ALIGNMENT[alignmentTarget];
  const entry = alignmentTable.find(row => row.policies === matchingCount);

  return entry ? entry.vp : 0;
};

/**
 * Calculates the total End-Game VP for a single class.
 */
export const calculateEndGameVp = (
  playerClass: PlayerClass,
  policies: Record<PolicyType, PolicyLevel>,
  loanCount: number,
  remainingMoney: number,
  resourceValues: Record<string, number>, // { Food: 20, Luxury: 15, ... } - ASSUMED ¥ VALUE
): {
  policyVp: number;
  moneyVp: number;
  resourceVp: number;
  loanPenalty: number;
  totalVp: number;
} => {
  const conversion = END_GAME_VP_CONVERSION[playerClass];
  let policyVp = 0;
  let moneyVp = 0;
  let resourceVp = 0;
  let loanPenalty = 0;

  // 1. Policy Alignment VP
  const alignmentTarget = playerClass === 'working' ? 'A' : playerClass === 'middle' ? 'B' : 'C';
  // State aligns with the highest matching policies to their agenda card in a tie-breaker, but for the table bonus, we use their default class ideology (B).
  const policyAlignmentTarget = playerClass === 'state' ? 'B' : alignmentTarget;
  policyVp = getPolicyAlignmentVp(policies, policyAlignmentTarget as PolicyLevel);

  // 2. Money Conversion VP
  if (playerClass !== 'capitalist') {
    // WC, MC, State gain VP from remaining money
    moneyVp = Math.floor(remainingMoney / conversion.moneyRate);
    moneyVp = Math.min(moneyVp, conversion.moneyMaxVp);
  }

  // 3. Resource Conversion VP
  let totalResourceValue = 0;

  // Use simplified conversion rate based on average 1 VP / 15¥ value
  for (const resourceType in resourceValues) {
      if (conversion.resourceTypes.includes(resourceType)) {
          totalResourceValue += resourceValues[resourceType];
      }
  }

  // Simplified rule: 1 VP for every 15¥ value in resources (approximates 1/2 food + 1/3 others)
  // State's Media Influence is treated as a resource here.
  resourceVp = Math.floor(totalResourceValue / conversion.resourceRate);

  // 4. Loan Penalty
  if (loanCount > 0) {
    if (playerClass === 'capitalist') {
      // CC: -5 VP per Loan (no chance to pay off)
      loanPenalty = loanCount * -5;
    } else {
      // WC, MC, State: -1 VP for every 5¥ they were unable to pay off (55¥/loan)
      // Assuming they are unable to pay the full 55¥, the max penalty is 11 VP per loan.
      const penaltyPerLoan = Math.ceil(55 / 5) * -1;
      loanPenalty = loanCount * penaltyPerLoan;
    }
  }

  const totalVp = policyVp + moneyVp + resourceVp + loanPenalty;

  return {
    policyVp,
    moneyVp,
    resourceVp,
    loanPenalty,
    totalVp
  };
};