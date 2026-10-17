import type { PolicyLevel, PlayerClass } from '@/types/game';

export interface WealthBracket {
  minCapital: number;
  maxCapital: number;
  baseVp: number;
}

// The Wealth table is an image on the player board. These bands reproduce the rulebook example (34 -> 2 VP, 57 -> 3 VP, 166 -> 7 VP, p. 21); the exact limits are unverified.
export const WEALTH_TRACK: WealthBracket[] = [
  { minCapital: 0, maxCapital: 0, baseVp: 0 },
  { minCapital: 1, maxCapital: 24, baseVp: 1 },
  { minCapital: 25, maxCapital: 49, baseVp: 2 },
  { minCapital: 50, maxCapital: 74, baseVp: 3 },
  { minCapital: 75, maxCapital: 99, baseVp: 4 },
  { minCapital: 100, maxCapital: 124, baseVp: 5 },
  { minCapital: 125, maxCapital: 149, baseVp: 6 },
  { minCapital: 150, maxCapital: 174, baseVp: 7 },
  { minCapital: 175, maxCapital: 199, baseVp: 8 },
  { minCapital: 200, maxCapital: 249, baseVp: 9 },
  { minCapital: 250, maxCapital: 299, baseVp: 10 },
  { minCapital: 300, maxCapital: 349, baseVp: 11 },
  { minCapital: 350, maxCapital: 399, baseVp: 12 },
  { minCapital: 400, maxCapital: 449, baseVp: 13 },
  { minCapital: 450, maxCapital: 499, baseVp: 14 },
  { minCapital: 500, maxCapital: Infinity, baseVp: 15 },
];

// Working Class and Middle Class have 11 levels of Prosperity (0-10)
export const PROSPERITY_LEVELS: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Returns the base VP gained for reaching a new Prosperity level.
 * Rule: Gain VP equal to the new Prosperity value.
 */
export const getVpForNewProsperity = (newLevel: number): number => {
  return newLevel >= 0 && newLevel < PROSPERITY_LEVELS.length ? newLevel : 0;
};

// Key policy sets for the Political Agenda
export const POLITICAL_AGENDA_POLICIES_1_5 = ['fiscal', 'labor', 'tax', 'health', 'education'] as const;
export const POLITICAL_AGENDA_POLICIES_6_7 = ['trade', 'immigration'] as const;

// Policy type union covering all 7 policies
export type AllPolicyTypes = (typeof POLITICAL_AGENDA_POLICIES_1_5)[number] | (typeof POLITICAL_AGENDA_POLICIES_6_7)[number];

// --- END-GAME SCORING TABLES ---

export type EndGameResource = 'food' | 'luxury' | 'health' | 'education' | 'media';

// Pieces per 1 VP. The rulebook text lost the resource icons ("2 / 3 / 3 / 3"); the order
// Food, Luxury, Health, Education (, Media) is assumed and unverified (p. 21, 25-26, 29-30).
export const RESOURCE_PIECES_PER_VP: Record<EndGameResource, number> = { food: 2, luxury: 3, health: 3, education: 3, media: 3 };

// Resources scored at game end, in Storages only (plus the Free Trade Zone for the
// Capitalist, plus Media for the State); the Working Class scores none (p. 17-18, 21, 25-26, 29-30).
export const END_GAME_RESOURCES: Record<PlayerClass, readonly EndGameResource[]> = {
  working: [],
  middle: ['food', 'luxury', 'health', 'education'],
  capitalist: ['food', 'luxury', 'health', 'education'],
  state: ['food', 'luxury', 'health', 'education', 'media'],
};

// Money VP at game end; the Capitalist Class gains no VP for money (p. 17-18, 21, 25-26, 29-30).
export const END_GAME_MONEY: Record<PlayerClass, { per: number; maxVp: number } | null> = {
  working: { per: 10, maxVp: 15 },
  middle: { per: 15, maxVp: Infinity },
  capitalist: null,
  state: { per: 30, maxVp: Infinity },
};

// Section whose policies 1-5 score at game end; the State has no such table (p. 29-30).
export const END_GAME_POLICY_SECTION: Record<PlayerClass, PolicyLevel | null> = {
  working: 'A',
  middle: 'B',
  capitalist: 'C',
  state: null,
};

export interface EndGameAlignmentVP {
  policies: number;
  vp: number;
}

// The VP values are an image in the rulebook (p. 17, 21, 25); unverified.
// Policy Alignment VP (Policies P1-P5): WC aligns with A, MC with B, CC with C.
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
