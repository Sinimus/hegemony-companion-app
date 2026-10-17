import { isClassActive, PLAYER_COUNTS, type PlayerCount } from '@/logic/players';
import type { PlayerClass } from '@/types/game';

// The game configuration, the only thing the app keeps about a game: it lives in
// the setup segment of the page address (#<setup>/<screen>) and never changes
// during a game.

// The State has no Automa (C&C p. 3).
export type AutomaClass = 'working' | 'middle' | 'capitalist';
export type Module = 'crisisResponse' | 'alternativeEvents' | 'hiddenAgendas' | 'actionCards' | 'historicalEvents';

export interface GameSetup {
  // Classes in play, people and Automas together (C&C p. 3).
  classCount: PlayerCount;
  // Always in turn order: working, middle, capitalist.
  automas: readonly AutomaClass[];
  // Always in the order of MODULES.
  modules: readonly Module[];
}

export const DEFAULT_SETUP: GameSetup = { classCount: 4, automas: [], modules: [] };

export const AUTOMA_CLASSES: readonly AutomaClass[] = ['working', 'middle', 'capitalist'];

export const MODULES: readonly {
  id: Module;
  token: string;
  label: string;
  expansion: 'Crisis & Control' | 'Historical Events';
}[] = [
  { id: 'crisisResponse', token: 'cr', label: 'Crisis Response', expansion: 'Crisis & Control' },
  { id: 'alternativeEvents', token: 'ae', label: 'Alternative Events', expansion: 'Crisis & Control' },
  { id: 'hiddenAgendas', token: 'ha', label: 'Hidden Agendas', expansion: 'Crisis & Control' },
  { id: 'actionCards', token: 'ac', label: 'New Action cards', expansion: 'Crisis & Control' },
  { id: 'historicalEvents', token: 'he', label: 'Historical Events', expansion: 'Historical Events' },
];

export const AUTOMA_TOKENS: Record<AutomaClass, string> = { working: 'wca', middle: 'mca', capitalist: 'cca' };

/**
 * Puts a setup in its canonical form: Automas only on classes that play at the class
 * count, deduplicated, in turn order; at most classCount - 1 of them, so one class
 * stays human (with 4 classes all three fit, because the State has no Automa); modules
 * deduplicated in MODULES order, alternativeEvents only with 4 classes (C&C p. 15).
 */
export function normalizeSetup(setup: GameSetup): GameSetup {
  const automas = AUTOMA_CLASSES.filter(
    (automaClass) => isClassActive(automaClass, setup.classCount) && setup.automas.some((a) => a === automaClass)
  ).slice(0, setup.classCount - 1);
  const modules = MODULES.filter(
    (module) =>
      (module.id !== 'alternativeEvents' || setup.classCount === 4) && setup.modules.includes(module.id)
  ).map((module) => module.id);
  return { classCount: setup.classCount, automas, modules };
}

export function setupToSegment(setup: GameSetup): string {
  const normalized = normalizeSetup(setup);
  return [
    `${normalized.classCount}p`,
    ...normalized.automas.map((automaClass) => AUTOMA_TOKENS[automaClass]),
    ...MODULES.filter((module) => normalized.modules.includes(module.id)).map((module) => module.token),
  ].join('+');
}

// Unknown tokens are ignored; null when the first part is not 2p/3p/4p.
export function segmentToSetup(segment: string): GameSetup | null {
  const parts = segment.split('+');
  const match = /^([234])p$/.exec(parts[0] ?? '');
  if (!match) return null;
  const classCount = PLAYER_COUNTS.find((count) => String(count) === match[1]);
  if (classCount === undefined) return null;
  const tokens = parts.slice(1);
  const automas = AUTOMA_CLASSES.filter((automaClass) => tokens.includes(AUTOMA_TOKENS[automaClass]));
  const modules = MODULES.filter((module) => tokens.includes(module.token)).map((module) => module.id);
  return normalizeSetup({ classCount, automas, modules });
}

export function isAutoma(playerClass: PlayerClass, setup: GameSetup): boolean {
  return setup.automas.some((automaClass) => automaClass === playerClass);
}

export function isHuman(playerClass: PlayerClass, setup: GameSetup): boolean {
  return isClassActive(playerClass, setup.classCount) && !isAutoma(playerClass, setup);
}

export function hasModule(module: Module, setup: GameSetup): boolean {
  return setup.modules.includes(module);
}

export function stateHasPlayer(setup: GameSetup): boolean {
  return setup.classCount === 4;
}

export function toggleAutoma(setup: GameSetup, automaClass: AutomaClass): GameSetup {
  const automas = setup.automas.some((a) => a === automaClass)
    ? setup.automas.filter((a) => a !== automaClass)
    : [...setup.automas, automaClass];
  return normalizeSetup({ ...setup, automas });
}

export function toggleModule(setup: GameSetup, module: Module): GameSetup {
  const modules = setup.modules.includes(module)
    ? setup.modules.filter((m) => m !== module)
    : [...setup.modules, module];
  return normalizeSetup({ ...setup, modules });
}

export function withClassCount(setup: GameSetup, classCount: PlayerCount): GameSetup {
  return normalizeSetup({ ...setup, classCount });
}
