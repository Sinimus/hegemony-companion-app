import { describe, expect, it } from 'vitest';
import { automaPricePositions } from '@/logic/automa';
import { INITIAL_POLICIES } from '@/stores/useGameStore';
import type { PolicyLevel, PolicyType } from '@/types/game';

// Automa prices, C&C p. 11-12: middle position, except Foreign Trade A (Food and
// Luxury at their highest), Health C and Education C (their resource at its highest).

describe('automaPricePositions', () => {
  it('the start policies: Education is C, so only Education sits at its highest', () => {
    expect(automaPricePositions(INITIAL_POLICIES)).toEqual({
      food: 'middle',
      luxury: 'middle',
      health: 'middle',
      education: 'highest',
    });
  });

  it('Foreign Trade A puts Food and Luxury at their highest', () => {
    const policies: Record<PolicyType, PolicyLevel> = { ...INITIAL_POLICIES, trade: 'A' };
    expect(automaPricePositions(policies)).toEqual({
      food: 'highest',
      luxury: 'highest',
      health: 'middle',
      education: 'highest',
    });
  });

  it('Health C puts Health at its highest', () => {
    const policies: Record<PolicyType, PolicyLevel> = { ...INITIAL_POLICIES, health: 'C' };
    expect(automaPricePositions(policies)).toEqual({
      food: 'middle',
      luxury: 'middle',
      health: 'highest',
      education: 'highest',
    });
  });

  it('Education B puts Education back in the middle', () => {
    const policies: Record<PolicyType, PolicyLevel> = { ...INITIAL_POLICIES, education: 'B' };
    expect(automaPricePositions(policies)).toEqual({
      food: 'middle',
      luxury: 'middle',
      health: 'middle',
      education: 'middle',
    });
  });

  it('all three exceptions at once', () => {
    const policies: Record<PolicyType, PolicyLevel> = {
      ...INITIAL_POLICIES,
      trade: 'A',
      health: 'C',
      education: 'C',
    };
    expect(automaPricePositions(policies)).toEqual({
      food: 'highest',
      luxury: 'highest',
      health: 'highest',
      education: 'highest',
    });
  });
});
