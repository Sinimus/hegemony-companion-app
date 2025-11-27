import type { PolicyLevel, PlayerClass } from '@/types/game';

export interface WealthBracket {
  minCapital: number;
  maxCapital: number;
  baseVp: number;
}

// Tabulka pro přepočet hodnoty Capital na základní VP a Wealth Level.
// Základní VP (baseVp) je počet hvězdiček, které se získají každé kolo.
// Každá pozice na tracku (krok) znamená 25 Vardis (až do 200), poté 50 Vardis.
// Zdroje: Wealth table from Hegemony rulebook
export const WEALTH_TRACK: WealthBracket[] = [
  { minCapital: 0, maxCapital: 24, baseVp: 0 },
  { minCapital: 25, maxCapital: 49, baseVp: 1 }, // Level 1
  { minCapital: 50, maxCapital: 74, baseVp: 2 }, // Level 2
  { minCapital: 75, maxCapital: 99, baseVp: 3 }, // Level 3
  { minCapital: 100, maxCapital: 124, baseVp: 4 }, // Level 4
  { minCapital: 125, maxCapital: 149, baseVp: 5 }, // Level 5
  { minCapital: 150, maxCapital: 174, baseVp: 6 }, // Level 6
  { minCapital: 175, maxCapital: 199, baseVp: 7 }, // Level 7
  { minCapital: 200, maxCapital: 249, baseVp: 8 }, // Level 8
  { minCapital: 250, maxCapital: 299, baseVp: 9 }, // Level 9
  { minCapital: 300, maxCapital: 349, baseVp: 10 }, // Level 10
  { minCapital: 350, maxCapital: 399, baseVp: 11 }, // Level 11
  { minCapital: 400, maxCapital: 449, baseVp: 12 }, // Level 12
  { minCapital: 450, maxCapital: 499, baseVp: 13 }, // Level 13
  { minCapital: 500, maxCapital: Infinity, baseVp: 14 }, // Level 14+
];

// Working Class and Middle Class have 11 levels of Prosperity (0-10)
export const PROSPERITY_LEVELS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Vrátí základní VP získané za dosažení nového levelu Prosperity.
 * Pravidlo: Gain VP equal to the new Prosperity value.
 */
export const getVpForNewProsperity = (newLevel: number): number => {
  return newLevel >= 0 && newLevel < PROSPERITY_LEVELS.length ? newLevel : 0;
};

export const LEGITIMACY_LEVELS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Klíčové sady politik pro Political Agenda
export const POLITICAL_AGENDA_POLICIES_1_5 = ['fiscal', 'labor', 'tax', 'health', 'education'] as const;
export const POLITICAL_AGENDA_POLICIES_6_7 = ['trade', 'immigration'] as const;

// Typ pro pole Policy Type, který zahrnuje všech 7 politik
export type AllPolicyTypes = (typeof POLITICAL_AGENDA_POLICIES_1_5)[number] | (typeof POLITICAL_AGENDA_POLICIES_6_7)[number];

// --- END-GAME SCORING TABLES ---

export interface EndGameAlignmentVP {
  policies: number;
  vp: number;
}

// 1. Policy Alignment VP (Policies P1-P5)
// WC aligns with A, CC with C, MC with B.
export const END_GAME_VP_ALIGNMENT: Record<PolicyLevel, EndGameAlignmentVP[]> = {
  A: [ // WC aligns with A
    { policies: 1, vp: 1 },
    { policies: 2, vp: 4 },
    { policies: 3, vp: 8 },
    { policies: 4, vp: 12 },
    { policies: 5, vp: 18 },
  ],
  B: [ // MC aligns with B
    { policies: 1, vp: 1 },
    { policies: 2, vp: 3 },
    { policies: 3, vp: 6 },
    { policies: 4, vp: 10 },
    { policies: 5, vp: 15 },
  ],
  C: [ // CC aligns with C
    { policies: 1, vp: 1 },
    { policies: 2, vp: 4 },
    { policies: 3, vp: 8 },
    { policies: 4, vp: 12 },
    { policies: 5, vp: 18 },
  ],
};

// 2. Money and Resource VP Conversion
// Resource values are simplified here to 1 VP / 15¥ total resource value (approximates the 1/2 Food, 1/3 others rule)
export const END_GAME_VP_CONVERSION: Record<PlayerClass, { moneyRate: number; moneyMaxVp: number; resourceRate: number; resourceTypes: string[] }> = {
  // WC: 1 VP / 10¥ (Max 15 VP); 1 VP / 10¥ for Trade Union Influence
  working: {
    moneyRate: 10,
    moneyMaxVp: 15,
    resourceRate: 15,
    resourceTypes: ['Food', 'Luxury', 'Health', 'Education', 'Influence'], // WC Influence is also tracked
  },
  // MC: 1 VP / 15¥; Resources (Storage Only)
  middle: {
    moneyRate: 15,
    moneyMaxVp: Infinity,
    resourceRate: 15,
    resourceTypes: ['Food', 'Luxury', 'Health', 'Education'],
  },
  // CC: -5 VP per Loan; Resources (Storage & FTZ)
  capitalist: {
    moneyRate: Infinity, // No direct VP for money
    moneyMaxVp: 0,
    resourceRate: 15,
    resourceTypes: ['Food', 'Luxury', 'Health', 'Education', 'Media'], // Media is an option for CC storage
  },
  // State: 1 VP / 30¥ (Treasury); Resources (Media Influence is 1/3)
  state: {
    moneyRate: 30, // 1 VP per 30¥ in Treasury
    moneyMaxVp: Infinity,
    resourceRate: 15,
    resourceTypes: ['Food', 'Luxury', 'Health', 'Education', 'Media'],
  },
};