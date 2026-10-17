import { describe, expect, it } from 'vitest';
import { applies, filterItems, filterSections, formatSource } from '@/logic/ruleFilter';
import { DEFAULT_SETUP, segmentToSetup, type GameSetup } from '@/logic/setup';
import type { RuleItem, RuleSection } from '@/data/rules/types';
import { SETUP_SECTIONS } from '@/data/rules/setupSteps';
import { ROUND_SECTIONS } from '@/data/rules/roundFlow';
import {
  IMF_SECTIONS,
  OFF_ELECTION_SHIFTS,
  POLICY_CHANGES,
} from '@/data/rules/policyChanges';
import { AUTOMA_CLASS_RULES, AUTOMA_GENERAL, AUTOMA_MODULE_RULES } from '@/data/rules/automaSimple';
import { POLICIES } from '@/data/policies';

describe('applies', () => {
  const threeClasses: GameSetup = { classCount: 3, automas: [], modules: [] };
  const middleAutoma: GameSetup = { classCount: 3, automas: ['middle'], modules: [] };
  const withHa: GameSetup = { classCount: 4, automas: [], modules: ['hiddenAgendas'] };
  const withCr: GameSetup = { classCount: 4, automas: [], modules: ['crisisResponse'] };

  it('an absent when applies always', () => {
    expect(applies(undefined, threeClasses)).toBe(true);
  });

  it('classCounts', () => {
    expect(applies({ classCounts: [3, 4] }, threeClasses)).toBe(true);
    expect(applies({ classCounts: [2, 4] }, threeClasses)).toBe(false);
  });

  it('modules: every entry must be on', () => {
    expect(applies({ modules: ['hiddenAgendas'] }, withHa)).toBe(true);
    expect(applies({ modules: ['hiddenAgendas'] }, DEFAULT_SETUP)).toBe(false);
    expect(applies({ modules: ['hiddenAgendas', 'crisisResponse'] }, withHa)).toBe(false);
  });

  it('modulesOff', () => {
    expect(applies({ modulesOff: ['crisisResponse'] }, DEFAULT_SETUP)).toBe(true);
    expect(applies({ modulesOff: ['crisisResponse'] }, withCr)).toBe(false);
  });

  it('anyAutoma', () => {
    expect(applies({ anyAutoma: true }, middleAutoma)).toBe(true);
    expect(applies({ anyAutoma: true }, threeClasses)).toBe(false);
    expect(applies({ anyAutoma: false }, middleAutoma)).toBe(false);
    expect(applies({ anyAutoma: false }, threeClasses)).toBe(true);
  });

  it('automa', () => {
    expect(applies({ automa: 'middle' }, middleAutoma)).toBe(true);
    expect(applies({ automa: 'working' }, middleAutoma)).toBe(false);
  });

  it('human', () => {
    expect(applies({ human: 'working' }, middleAutoma)).toBe(true);
    expect(applies({ human: 'middle' }, middleAutoma)).toBe(false);
    expect(applies({ human: 'state' }, middleAutoma)).toBe(false);
    expect(applies({ human: 'state' }, DEFAULT_SETUP)).toBe(true);
  });
});

describe('formatSource', () => {
  it('names the book and keeps the pages as given', () => {
    expect(formatSource({ book: 'base', pages: '8' })).toBe('p. 8');
    expect(formatSource({ book: 'base', pages: '12-13' })).toBe('p. 12-13');
    expect(formatSource({ book: 'cc', pages: '14' })).toBe('C&C p. 14');
    expect(formatSource({ book: 'he', pages: '1' })).toBe('HE p. 1');
  });
});

describe('filterItems and filterSections', () => {
  it('keeps the items that apply', () => {
    expect(filterItems(OFF_ELECTION_SHIFTS, DEFAULT_SETUP)).toEqual([]);
    const withHe = segmentToSetup('4p+he') ?? DEFAULT_SETUP;
    expect(filterItems(OFF_ELECTION_SHIFTS, withHe).map((item) => item.id)).toEqual(['he-arrow']);
  });

  it('drops a section whose when fails and one with no item left', () => {
    const withCr = segmentToSetup('4p+cr') ?? DEFAULT_SETUP;
    expect(filterSections(IMF_SECTIONS, withCr).map((section) => section.id)).toEqual(['imf-cr']);
    expect(filterSections(IMF_SECTIONS, DEFAULT_SETUP).map((section) => section.id)).toEqual(['imf-base']);
  });
});

describe('rule data quality', () => {
  const itemsOf = (sections: readonly RuleSection[]): readonly RuleItem[] =>
    sections.flatMap((section) => section.items);

  const collections: readonly { label: string; items: readonly RuleItem[] }[] = [
    { label: 'SETUP_SECTIONS', items: itemsOf(SETUP_SECTIONS) },
    { label: 'ROUND_SECTIONS', items: itemsOf(ROUND_SECTIONS) },
    { label: 'IMF_SECTIONS', items: itemsOf(IMF_SECTIONS) },
    { label: 'OFF_ELECTION_SHIFTS', items: OFF_ELECTION_SHIFTS },
    { label: 'AUTOMA_GENERAL', items: AUTOMA_GENERAL },
    { label: 'AUTOMA_MODULE_RULES', items: AUTOMA_MODULE_RULES },
    { label: 'AUTOMA_CLASS_RULES.working', items: AUTOMA_CLASS_RULES.working },
    { label: 'AUTOMA_CLASS_RULES.middle', items: AUTOMA_CLASS_RULES.middle },
    { label: 'AUTOMA_CLASS_RULES.capitalist', items: AUTOMA_CLASS_RULES.capitalist },
    ...POLICIES.map((policy) => ({ label: `POLICY_CHANGES.${policy.id}`, items: POLICY_CHANGES[policy.id] })),
  ];

  it('every item has a non-empty text and source.pages', () => {
    for (const { label, items } of collections) {
      for (const item of items) {
        expect(item.text.length, `${label} ${item.id}: text`).toBeGreaterThan(0);
        expect(item.source.pages.length, `${label} ${item.id}: pages`).toBeGreaterThan(0);
      }
    }
  });

  it('item ids are unique within each collection', () => {
    for (const { label, items } of collections) {
      const ids = items.map((item) => item.id);
      expect(new Set(ids).size, `${label}: unique ids`).toBe(ids.length);
    }
  });
});

describe('the real rule data filtered by setup', () => {
  const twoClasses: GameSetup = { classCount: 2, automas: [], modules: [] };
  const full = segmentToSetup('4p+wca+mca+cr+ha+he') ?? DEFAULT_SETUP;

  it('2 classes, no modules: only the classes that play, no expansions', () => {
    const sections = filterSections(SETUP_SECTIONS, twoClasses);
    const sectionIds = sections.map((section) => section.id);
    expect(sectionIds).not.toContain('middle');
    expect(sectionIds).not.toContain('state');
    expect(sectionIds).not.toContain('automas');
    for (const id of sections.flatMap((section) => section.items.map((item) => item.id))) {
      expect(
        id.startsWith('ha-') || id.startsWith('cr-') || id.startsWith('he-') || id.startsWith('ac-'),
        id
      ).toBe(false);
    }
  });

  it('2 classes: the Preparation phase still tells the State what to do without a player', () => {
    const preparation = filterSections(ROUND_SECTIONS, twoClasses).find((section) => section.id === 'preparation');
    expect(preparation?.items.map((item) => item.id)).toContain('prep-state-loan');
  });

  it('4p+wca+mca+cr+ha+he: automas section, expansion decks, IMF through Crisis Response', () => {
    const sections = filterSections(SETUP_SECTIONS, full);
    expect(sections.map((section) => section.id)).toContain('automas');
    const ids = sections.flatMap((section) => section.items.map((item) => item.id));
    expect(ids).toContain('ha-automa');
    expect(ids).toContain('cr-deck');
    expect(ids).toContain('he-deck');
    expect(filterSections(IMF_SECTIONS, full).map((section) => section.id)).toEqual(['imf-cr']);
  });

  it('without crisis response the IMF follows the base rules', () => {
    const setup = segmentToSetup('4p+wca+mca+ha+he') ?? DEFAULT_SETUP;
    expect(filterSections(IMF_SECTIONS, setup).map((section) => section.id)).toEqual(['imf-base']);
  });

  it('alternative events never appear with 3 classes: the setup cannot hold the module', () => {
    const setup = segmentToSetup('3p+ae') ?? DEFAULT_SETUP;
    expect(setup.modules).toEqual([]);
    expect(applies({ modules: ['alternativeEvents'] }, setup)).toBe(false);
    const ids = filterSections(ROUND_SECTIONS, setup).flatMap((section) =>
      section.items.map((item) => item.id)
    );
    expect(ids).not.toContain('prep-alt-benefit');
  });
});
