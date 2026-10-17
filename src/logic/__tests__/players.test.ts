import { describe, expect, it } from 'vitest';
import { getActiveClasses, isClassActive, playerCountFromHash, playerCountToSetup } from '@/logic/players';

// Game Setup, Hegemony Rulebook v1.2, p. 8: 2 players play the Capitalist Class and the
// Working Class; 3 players add the Middle Class; 4 players add the State.

describe('active classes by player count (Game Setup, p. 8)', () => {
  it('2 players play the Working and Capitalist Class', () => {
    expect(getActiveClasses(2)).toEqual(['working', 'capitalist']);
  });

  it('3 players add the Middle Class', () => {
    expect(getActiveClasses(3)).toEqual(['working', 'middle', 'capitalist']);
  });

  it('4 players add the State', () => {
    expect(getActiveClasses(4)).toEqual(['working', 'middle', 'capitalist', 'state']);
  });

  it('hides classes that do not play', () => {
    expect(isClassActive('state', 3)).toBe(false);
    expect(isClassActive('middle', 2)).toBe(false);
    expect(isClassActive('middle', 3)).toBe(true);
  });
});

describe('player count in the page address', () => {
  it('writes the setup segment 2p, 3p and 4p', () => {
    expect(playerCountToSetup(2)).toBe('2p');
    expect(playerCountToSetup(4)).toBe('4p');
  });

  it('reads back what it writes', () => {
    expect(playerCountFromHash('#3p')).toBe(3);
  });

  it('reads only the setup segment', () => {
    expect(playerCountFromHash('#4p/policies')).toBe(4);
    expect(playerCountFromHash('#/endgame')).toBeNull();
  });

  it('ignores anything else', () => {
    expect(playerCountFromHash('')).toBeNull();
    expect(playerCountFromHash('#5p')).toBeNull();
    expect(playerCountFromHash('#3')).toBeNull();
    expect(playerCountFromHash('#3p-extra')).toBeNull();
  });
});
