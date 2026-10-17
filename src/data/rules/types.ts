import type { PlayerClass } from '@/types/game';
import type { AutomaClass, GameSetup, Module } from '@/logic/setup';
import type { PlayerCount } from '@/logic/players';

// Rule texts are paraphrases with a page reference, never quotes (ruling r160).
// base = Hegemony Rulebook v1.2, cc = Crisis & Control Rulebook v1.1, he = Historical Events.
export type RuleBook = 'base' | 'cc' | 'he';

export interface RuleSource {
  book: RuleBook;
  pages: string;
}

// When an item applies. Every listed condition must hold; an absent field does not restrict.
export interface When {
  classCounts?: readonly PlayerCount[];
  modules?: readonly Module[];
  modulesOff?: readonly Module[];
  anyAutoma?: boolean;
  automa?: AutomaClass;
  human?: PlayerClass;
}

export interface RuleItem {
  id: string;
  text: string;
  source: RuleSource;
  when?: When;
}

export interface RuleSection {
  id: string;
  title: string;
  items: readonly RuleItem[];
  when?: When;
}

export type { GameSetup };
