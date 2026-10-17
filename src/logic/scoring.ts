import {
  WEALTH_TRACK,
  PROSPERITY_LEVELS,
  getVpForNewProsperity,
  POLITICAL_AGENDA_POLICIES_1_5,
  POLITICAL_AGENDA_POLICIES_6_7,
  END_GAME_VP_ALIGNMENT,
  END_GAME_RESOURCES,
  END_GAME_MONEY,
  END_GAME_POLICY_SECTION,
  RESOURCE_PIECES_PER_VP,
} from './scoringData';
import type { EndGameResource } from './scoringData';
import type { PolicyLevel, PolicyType, PlayerClass } from '@/types/game';

/**
 * Returns the index of the Wealth space for a Capital amount (Capitalist Scoring Phase, p. 21).
 * Negative Capital counts as 0, the start space.
 */
export function getWealthSpace(capital: number): number {
  const clamped = Math.max(0, capital);
  const index = WEALTH_TRACK.findIndex(
    (bracket) => clamped >= bracket.minCapital && clamped <= bracket.maxCapital
  );
  return index >= 0 ? index : 0;
}

/**
 * Scores the Wealth table for one round of the Capitalist Scoring Phase (p. 21).
 * The marker remembers the furthest space reached: it moves right (3 VP per space moved)
 * and never moves left; a lower Capital still scores the table VP but no bonus.
 * @param capital The Capital amount to score this round.
 * @param wealthMarkerSpace The furthest Wealth space reached so far (0 at the start).
 */
export function calculateWealthScoring(
  capital: number,
  wealthMarkerSpace: number
): { space: number; baseVp: number; bonusVp: number; newMarkerSpace: number; totalVp: number } {
  const marker = Math.min(WEALTH_TRACK.length - 1, Math.max(0, wealthMarkerSpace));
  const space = getWealthSpace(capital);
  const baseVp = WEALTH_TRACK[space].baseVp;
  const bonusVp = 3 * Math.max(0, space - marker);
  const newMarkerSpace = Math.max(marker, space);
  return { space, baseVp, bonusVp, newMarkerSpace, totalVp: baseVp + bonusVp };
}

export type ProsperityAction = 'healthcare' | 'education' | 'luxury' | 'none';

/**
 * Calculates the VP gained from a single Prosperity action for the Working Class.
 * @param currentLevel Current Prosperity level before the action (0-9).
 * @param action The action leading to the Prosperity gain.
 * @returns Total VP gained for 1 Prosperity step.
 */
export const calculateWorkingClassProsperityVp = (
  currentLevel: number,
  action: ProsperityAction
): { gainedVp: number; newLevel: number; bonusVp: number } => {
  // At Level 10 the VP are still gained, but the level does not rise.
  if (currentLevel >= PROSPERITY_LEVELS.length - 1) {
    const currentVp = getVpForNewProsperity(currentLevel);
    // Returns the VP for the current level (VP = new value, which equals the old one), bonus is 0.
    return { gainedVp: currentVp, newLevel: currentLevel, bonusVp: 0 };
  }

  const newLevel = currentLevel + 1;
  const gainedVp = getVpForNewProsperity(newLevel);
  let bonusVp = 0;

  // Special bonus for Use Healthcare: +2 bonus VP.
  if (action === 'healthcare') {
    bonusVp = 2;
  }

  return {
    gainedVp: gainedVp + bonusVp,
    newLevel,
    bonusVp,
  };
};

// Reuses the WC logic, because MC has the same VP gains from actions.
export const calculateMiddleClassProsperityVp = (
  currentLevel: number,
  action: ProsperityAction
): { gainedVp: number; newLevel: number; bonusVp: number } => {
  // MC shares the same VP gains from actions (+2 for Healthcare) as WC.
  return calculateWorkingClassProsperityVp(currentLevel, action);
};

/**
 * Checks whether the Middle Class gains 1 free Prosperity in the Scoring Phase.
 * Rule: If your Prosperity value is lower than the number of fully operational Companies (2 workers), gain 1 Prosperity for free.
 * @param currentProsperityLevel Current Prosperity level (0-10)
 * @param fullyOperationalCompanies Number of fully operational Companies (2 Workers)
 */
export const canMiddleClassGainProsperity = (
  currentProsperityLevel: number,
  fullyOperationalCompanies: number
): boolean => {
  // The MC Prosperity track only goes to 10; it cannot move when already at 10.
  const maxLevel = PROSPERITY_LEVELS.length - 1;

  if (currentProsperityLevel >= maxLevel) return false;

  return currentProsperityLevel < fullyOperationalCompanies;
};

/**
 * Calculates VP from the State Legitimacy tracks.
 * Rule: Gain VP equal to the sum of the two lowest Legitimacy values.
 * @param workingClassLegitimacy WC Legitimacy level (0-10)
 * @param middleClassLegitimacy MC Legitimacy level (0-10)
 * @param capitalistClassLegitimacy CC Legitimacy level (0-10)
 * @returns VP gained in the Scoring Phase.
 */
export const calculateStateLegitimacyVp = (
  workingClassLegitimacy: number,
  middleClassLegitimacy: number,
  capitalistClassLegitimacy: number
): number => {
  const scores = [workingClassLegitimacy, middleClassLegitimacy, capitalistClassLegitimacy];

  // Clamp the values to the allowed range 0-10
  const clampedScores = scores.map(score => Math.max(0, Math.min(10, score)));

  // Sort ascending
  clampedScores.sort((a, b) => a - b);

  // Sum of the two lowest
  const lowestTwoSum = clampedScores[0] + clampedScores[1];

  return lowestTwoSum;
};

/**
 * Calculates VP from the Political Agenda card.
 * Rule: Gain 1 VP for each Policy that matches the card's target section.
 * @param policies Current state of all 7 policies (from useGameStore).
 * @param agendaCard Target sections on the Political Agenda card.
 * @returns VP gained from the Political Agenda (Max 7 VP).
 */
export const calculateStateAgendaVp = (
  policies: Record<PolicyType, PolicyLevel>,
  agendaCard: Record<PolicyType, PolicyLevel>
): number => {
  let matchingPolicies = 0;

  // Check all 7 policies
  const allPolicyTypes: PolicyType[] = [...POLITICAL_AGENDA_POLICIES_1_5, ...POLITICAL_AGENDA_POLICIES_6_7];

  for (const key of allPolicyTypes) {
    if (policies[key] === agendaCard[key]) {
      matchingPolicies++;
    }
  }

  return matchingPolicies; // Max 7
};

/**
 * Logic for lowering Legitimacy in the Scoring Phase.
 * Rule: All Legitimacy markers move to half of their current values (rounded up).
 * @param currentLevel Current Legitimacy level (0-10)
 * @returns New level after the drop.
 */
export const dropLegitimacy = (currentLevel: number): number => {
  // Rounded up
  return Math.ceil(currentLevel / 2);
};

// --- MICRO-UTILITY LOGIC ---

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
 * Scores one sale of Health or Education for the State (p. 26-27).
 * Section B (price 5): 1 VP per sale, whatever the amount sold.
 * Section A (free): +1 Legitimacy toward the buying Class per 3 resources sold.
 * Section C: nothing.
 * @param policyLevel Current level of P4 (Health) or P5 (Education).
 * @param amountSold Number of resources sold in this one sale.
 */
export function calculateWelfareSale(
    policyLevel: PolicyLevel,
    amountSold: number
): { vpGain: number; legitimacyGain: number } {
    if (policyLevel === 'B') {
        // One sale at price 5 gives the State 1 VP.
        return { vpGain: amountSold > 0 ? 1 : 0, legitimacyGain: 0 };
    }
    if (policyLevel === 'A') {
        // Free sale: +1 Legitimacy per 3 resources sold.
        return { vpGain: 0, legitimacyGain: Math.floor(amountSold / 3) };
    }
    // Section C: no gain for the State.
    return { vpGain: 0, legitimacyGain: 0 };
}

/**
 * Settles the Loans of one player at game end (Game End, p. 13).
 * The Capitalist Class pays nothing and loses 5 VP per Loan; every other player pays
 * 55 per Loan from money in steps of 5 as far as possible and loses 1 VP per 5 unpaid.
 * @param playerClass The player's class.
 * @param loans Number of Loans the player holds.
 * @param money Money available before the payment.
 */
export function settleEndGameLoans(playerClass: PlayerClass, loans: number, money: number): {
    paid: number;
    unpaid: number;
    vpPenalty: number;
    moneyLeft: number;
} {
    if (playerClass === 'capitalist') {
        return { paid: 0, unpaid: 0, vpPenalty: 0 - 5 * loans, moneyLeft: money };
    }

    const due = 55 * loans;
    const paid = Math.min(due, Math.floor(Math.max(0, money) / 5) * 5);
    const unpaid = due - paid; // Always a multiple of 5, because 55 is.

    // `0 - x` keeps a positive zero when nothing is unpaid (a plain `-x` gives -0).
    return { paid, unpaid, vpPenalty: 0 - unpaid / 5, moneyLeft: money - paid };
}

/**
 * Calculates the end-game VP of one class (p. 13, 17-18, 21, 25-26, 29-30).
 * Loans are settled first; money VP uses the money left after that payment.
 * @param input.policies Current state of all 7 policies (from useGameStore).
 * @param input.resources Resource pieces in Storages (the Free Trade Zone and Media count
 * for the classes whose lists include them); missing types count as 0.
 */
export function calculateEndGameVp(input: {
    playerClass: PlayerClass;
    policies: Record<PolicyType, PolicyLevel>;
    loans: number;
    money: number;
    resources: Partial<Record<EndGameResource, number>>;
}): { policyVp: number; moneyVp: number; resourceVp: number; loanPenalty: number; moneyLeft: number; totalVp: number } {
    const { playerClass, policies, loans, money, resources } = input;
    const settlement = settleEndGameLoans(playerClass, loans, money);

    // 1. Policy table VP: count P1-P5 in the class's section and look the count up.
    const section = END_GAME_POLICY_SECTION[playerClass];
    let policyVp = 0;
    if (section !== null) {
        let matchingCount = 0;
        for (const policyId of POLITICAL_AGENDA_POLICIES_1_5) {
            if (policies[policyId] === section) {
                matchingCount++;
            }
        }
        const row = END_GAME_VP_ALIGNMENT[section].find(entry => entry.policies === matchingCount);
        policyVp = row ? row.vp : 0;
    }

    // 2. Money VP from the money left after the Loan settlement.
    const moneyRule = END_GAME_MONEY[playerClass];
    let moneyVp = 0;
    if (moneyRule !== null && settlement.moneyLeft >= 0) {
        moneyVp = Math.min(moneyRule.maxVp, Math.floor(settlement.moneyLeft / moneyRule.per));
    }

    // 3. Resource VP, counted in pieces; resources not listed for the class are ignored.
    let resourceVp = 0;
    for (const resource of END_GAME_RESOURCES[playerClass]) {
        const pieces = resources[resource] ?? 0;
        if (pieces > 0) {
            resourceVp += Math.floor(pieces / RESOURCE_PIECES_PER_VP[resource]);
        }
    }

    const loanPenalty = settlement.vpPenalty;

    return {
        policyVp,
        moneyVp,
        resourceVp,
        loanPenalty,
        moneyLeft: settlement.moneyLeft,
        totalVp: policyVp + moneyVp + resourceVp + loanPenalty,
    };
}
