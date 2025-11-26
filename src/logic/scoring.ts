import { WEALTH_TRACK, PROSPERITY_LEVELS, getVpForNewProsperity, POLITICAL_AGENDA_POLICIES_1_5, POLITICAL_AGENDA_POLICIES_6_7 } from './scoringData';
import { WORKER_INCOME_TAX_RATES } from './taxData';
import type { PolicyLevel, PolicyType } from '@/types/game';

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