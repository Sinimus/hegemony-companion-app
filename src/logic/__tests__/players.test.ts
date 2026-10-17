import { describe, expect, it } from 'vitest';
import { getActiveClasses, isClassActive } from '@/logic/players';

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
