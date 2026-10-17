import { parseHash } from '@/logic/route';
import type { PlayerClass } from '@/types/game';

// Game Setup, Hegemony Rulebook v1.2, p. 8: 2 players play the Capitalist Class and the
// Working Class; 3 players add the Middle Class; 4 players add the State.
export type PlayerCount = 2 | 3 | 4;
export const PLAYER_COUNTS: readonly PlayerCount[] = [2, 3, 4];

// Always in turn order: Working, Middle, Capitalist, State.
export function getActiveClasses(count: PlayerCount): PlayerClass[] {
  const classes: PlayerClass[] = ['working', 'capitalist'];
  if (count >= 3) {
    classes.splice(1, 0, 'middle');
  }
  if (count >= 4) {
    classes.push('state');
  }
  return classes;
}

export function isClassActive(playerClass: PlayerClass, count: PlayerCount): boolean {
  return getActiveClasses(count).includes(playerClass);
}

// The player count is game setup, not game state: it lives in the setup segment
// of the page address (#2p, #3p, #4p) so a bookmark or a reload keeps it.
// Nothing else is stored.
export function playerCountToSetup(count: PlayerCount): string {
  return `${count}p`;
}

export function playerCountFromSetup(setup: string): PlayerCount | null {
  const match = /^([234])p$/.exec(setup);
  if (!match) return null;
  return PLAYER_COUNTS.find((count) => String(count) === match[1]) ?? null;
}

export function playerCountFromHash(hash: string): PlayerCount | null {
  return playerCountFromSetup(parseHash(hash).setup);
}
