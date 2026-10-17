import { describe, expect, it } from 'vitest';
import { calculateWealthScoring, getWealthSpace } from '@/logic/scoring';

// Example from Hegemony English Rulebook v1.2 (rules collection `boardgames`, game `hegemony`).

describe('Capitalist Class: Wealth (Scoring Phase, p. 21)', () => {
  it('round 1: Capital 57 scores 3 VP and moves the marker 3 spaces (+9), total 12', () => {
    expect(calculateWealthScoring(57, 0)).toEqual({
      space: 3,
      baseVp: 3,
      bonusVp: 9,
      newMarkerSpace: 3,
      totalVp: 12,
    });
  });

  it('round 2: Capital 34 scores 2 VP, the marker stays at 3, no bonus', () => {
    expect(calculateWealthScoring(34, 3)).toEqual({
      space: 2,
      baseVp: 2,
      bonusVp: 0,
      newMarkerSpace: 3,
      totalVp: 2,
    });
  });

  it('round 3: Capital 166 scores 7 VP and moves the marker 4 spaces (+12), total 19', () => {
    expect(calculateWealthScoring(166, 3)).toEqual({
      space: 7,
      baseVp: 7,
      bonusVp: 12,
      newMarkerSpace: 7,
      totalVp: 19,
    });
  });

  it('maps 0 and negative Capital to the start space 0', () => {
    expect(getWealthSpace(0)).toBe(0);
    expect(getWealthSpace(-10)).toBe(0);
  });
});
