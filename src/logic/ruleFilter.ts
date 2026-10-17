import type { RuleItem, RuleSection, RuleSource, When } from '@/data/rules/types';
import { isAutoma, isHuman, type GameSetup } from '@/logic/setup';

/**
 * Whether a rule item or section applies to a game setup. Every listed condition
 * must hold; an absent field does not restrict.
 */
export function applies(when: When | undefined, setup: GameSetup): boolean {
  if (!when) return true;
  if (when.classCounts !== undefined && !when.classCounts.includes(setup.classCount)) return false;
  if (when.modules !== undefined && !when.modules.every((module) => setup.modules.includes(module))) return false;
  if (when.modulesOff !== undefined && when.modulesOff.some((module) => setup.modules.includes(module))) return false;
  if (when.anyAutoma !== undefined && when.anyAutoma !== (setup.automas.length > 0)) return false;
  if (when.automa !== undefined && !isAutoma(when.automa, setup)) return false;
  if (when.human !== undefined && !isHuman(when.human, setup)) return false;
  return true;
}

export function filterItems<T extends RuleItem>(items: readonly T[], setup: GameSetup): T[] {
  return items.filter((item) => applies(item.when, setup));
}

// Drops a section whose own when fails or which has no item left.
export function filterSections(sections: readonly RuleSection[], setup: GameSetup): RuleSection[] {
  const filtered: RuleSection[] = [];
  for (const section of sections) {
    if (!applies(section.when, setup)) continue;
    const items = filterItems(section.items, setup);
    if (items.length === 0) continue;
    filtered.push({ ...section, items });
  }
  return filtered;
}

export function formatSource(source: RuleSource): string {
  const book = source.book === 'base' ? 'p. ' : source.book === 'cc' ? 'C&C p. ' : 'HE p. ';
  return `${book}${source.pages}`;
}
