import { describe, expect, it } from 'vitest';
import {
  calculateStateLegitimacyVp,
  calculateTradeUnionVp,
  canMiddleClassGainProsperity,
  dropLegitimacy,
} from '@/logic/scoring';

// Examples from Hegemony English Rulebook v1.2 (rules collection `boardgames`, game `hegemony`).

describe('State: Score Legitimacy and Adjust Tracks (Scoring Phase, p. 28-29)', () => {
  it('scores the sum of the two lowest Legitimacy values: 6/4/5 -> 9 VP', () => {
    expect(calculateStateLegitimacyVp(6, 4, 5)).toBe(9);
  });

  it('moves each marker to half its value, rounded up: 6/4/5 -> 3/2/3', () => {
    expect([6, 4, 5].map(dropLegitimacy)).toEqual([3, 2, 3]);
  });
});

describe('Middle Class Scoring Phase (p. 25)', () => {
  it('gains 1 Prosperity when Prosperity is lower than fully operational Companies', () => {
    expect(canMiddleClassGainProsperity(2, 3)).toBe(true);
  });

  it('gains nothing when Prosperity equals fully operational Companies', () => {
    expect(canMiddleClassGainProsperity(3, 3)).toBe(false);
  });
});

describe('Working Class Trade Unions (Scoring Phase, p. 17)', () => {
  it('gains 2 VP for each Trade Union', () => {
    expect(calculateTradeUnionVp(3)).toBe(6);
  });
});
