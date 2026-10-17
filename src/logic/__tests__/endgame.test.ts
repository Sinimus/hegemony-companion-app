import { describe, expect, it } from 'vitest';
import { bestAchievedAgendaVp, calculateEndGameVp, settleEndGameLoans } from '@/logic/scoring';
import type { PolicyLevel, PolicyType } from '@/types/game';

// Examples from Hegemony English Rulebook v1.2 (rules collection `boardgames`, game `hegemony`).

const allPolicies = (level: PolicyLevel): Record<PolicyType, PolicyLevel> => ({
  fiscal: level,
  labor: level,
  tax: level,
  health: level,
  education: level,
  trade: level,
  immigration: level,
});

describe('All classes: settle Loans (Game End, p. 13)', () => {
  it('Middle Class with 1 Loan and 38 money pays 35, leaves 20 unpaid for -4 VP, 3 money left', () => {
    expect(settleEndGameLoans('middle', 1, 38)).toEqual({
      paid: 35,
      unpaid: 20,
      vpPenalty: -4,
      moneyLeft: 3,
    });
  });

  it('Capitalist Class with 2 Loans and 100 money pays nothing and loses 10 VP', () => {
    expect(settleEndGameLoans('capitalist', 2, 100)).toEqual({
      paid: 0,
      unpaid: 0,
      vpPenalty: -10,
      moneyLeft: 100,
    });
  });

  it('pays nothing and loses nothing with no Loans', () => {
    expect(settleEndGameLoans('working', 0, 50)).toEqual({
      paid: 0,
      unpaid: 0,
      vpPenalty: 0,
      moneyLeft: 50,
    });
  });
});

describe('Working Class end-game scoring (p. 17-18)', () => {
  it('caps money VP at 15 with 200 money', () => {
    const result = calculateEndGameVp({
      playerClass: 'working',
      policies: allPolicies('A'),
      loans: 0,
      money: 200,
      resources: {},
    });
    expect(result.moneyVp).toBe(15);
  });

  it('gives no VP for resources', () => {
    const result = calculateEndGameVp({
      playerClass: 'working',
      policies: allPolicies('A'),
      loans: 0,
      money: 0,
      resources: { food: 20, luxury: 9, health: 6, education: 3 },
    });
    expect(result.resourceVp).toBe(0);
  });
});

describe('State end-game scoring (p. 29-30)', () => {
  it('has no policy table even when all policies are in B', () => {
    const result = calculateEndGameVp({
      playerClass: 'state',
      policies: allPolicies('B'),
      loans: 0,
      money: 0,
      resources: {},
    });
    expect(result.policyVp).toBe(0);
  });

  it('scores 1 VP per 30 money: 95 -> 3 VP', () => {
    const result = calculateEndGameVp({
      playerClass: 'state',
      policies: allPolicies('B'),
      loans: 0,
      money: 95,
      resources: {},
    });
    expect(result.moneyVp).toBe(3);
  });

  it('counts Media in pieces: 7 -> 2 VP', () => {
    const result = calculateEndGameVp({
      playerClass: 'state',
      policies: allPolicies('B'),
      loans: 0,
      money: 0,
      resources: { media: 7 },
    });
    expect(result.resourceVp).toBe(2);
  });
});

describe('Middle Class end-game scoring (p. 25-26)', () => {
  it('counts resources in pieces: food 5, luxury 3, health 2 -> 3 VP', () => {
    const result = calculateEndGameVp({
      playerClass: 'middle',
      policies: allPolicies('B'),
      loans: 0,
      money: 0,
      resources: { food: 5, luxury: 3, health: 2 },
    });
    expect(result.resourceVp).toBe(3);
  });

  it('settles 1 Loan with 38 money: -4 VP, 3 money left, 0 money VP', () => {
    const result = calculateEndGameVp({
      playerClass: 'middle',
      policies: allPolicies('B'),
      loans: 1,
      money: 38,
      resources: {},
    });
    expect(result.loanPenalty).toBe(-4);
    expect(result.moneyVp).toBe(0);
    expect(result.moneyLeft).toBe(3);
  });
});

describe('Capitalist Class end-game scoring (p. 21)', () => {
  it('gives no VP for money', () => {
    const result = calculateEndGameVp({
      playerClass: 'capitalist',
      policies: allPolicies('C'),
      loans: 0,
      money: 500,
      resources: {},
    });
    expect(result.moneyVp).toBe(0);
  });
});

describe('Hidden Agenda VP at game end (C&C p. 13, 16)', () => {
  const middleExample = {
    playerClass: 'middle' as const,
    policies: allPolicies('B'),
    loans: 1,
    money: 38,
    resources: {},
  };

  it('adds 4 Hidden Agenda VP to the old total', () => {
    const without = calculateEndGameVp(middleExample);
    const withAgenda = calculateEndGameVp({ ...middleExample, hiddenAgendaVp: 4 });
    expect(withAgenda.hiddenAgendaVp).toBe(4);
    expect(withAgenda.totalVp).toBe(without.totalVp + 4);
  });

  it('defaults to 0 and treats a negative value as 0', () => {
    expect(calculateEndGameVp(middleExample).hiddenAgendaVp).toBe(0);
    expect(calculateEndGameVp({ ...middleExample, hiddenAgendaVp: -3 }).hiddenAgendaVp).toBe(0);
    expect(calculateEndGameVp(middleExample).totalVp).toBe(
      calculateEndGameVp({ ...middleExample, hiddenAgendaVp: -3 }).totalVp
    );
  });

  it('bestAchievedAgendaVp returns the highest achieved value, 0 for none', () => {
    expect(bestAchievedAgendaVp([3, 5, 2])).toBe(5);
    expect(bestAchievedAgendaVp([])).toBe(0);
  });
});
