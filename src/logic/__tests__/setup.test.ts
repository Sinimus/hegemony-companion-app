import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETUP,
  hasModule,
  isAutoma,
  isHuman,
  normalizeSetup,
  segmentToSetup,
  setupToSegment,
  stateHasPlayer,
  toggleAutoma,
  toggleModule,
  withClassCount,
  type GameSetup,
} from '@/logic/setup';

describe('normalizeSetup', () => {
  it('keeps only Automas whose class plays, deduplicated, in turn order', () => {
    expect(
      normalizeSetup({ classCount: 2, automas: ['capitalist', 'working', 'working'], modules: [] })
    ).toEqual({ classCount: 2, automas: ['working'], modules: [] });
  });

  it('allows at most one Automa with 2 classes and two with 3, the first in turn order', () => {
    expect(
      normalizeSetup({ classCount: 2, automas: ['working', 'capitalist'], modules: [] })
    ).toEqual({ classCount: 2, automas: ['working'], modules: [] });
    expect(
      normalizeSetup({ classCount: 3, automas: ['middle', 'capitalist', 'working'], modules: [] })
    ).toEqual({ classCount: 3, automas: ['working', 'middle'], modules: [] });
  });

  it('allows all three Automas with 4 classes, because the State is always human', () => {
    expect(
      normalizeSetup({ classCount: 4, automas: ['capitalist', 'middle', 'working'], modules: [] })
    ).toEqual({ classCount: 4, automas: ['working', 'middle', 'capitalist'], modules: [] });
  });

  it('drops alternativeEvents below 4 classes (C&C p. 15)', () => {
    expect(
      normalizeSetup({ classCount: 3, automas: [], modules: ['alternativeEvents', 'hiddenAgendas'] })
    ).toEqual({ classCount: 3, automas: [], modules: ['hiddenAgendas'] });
  });

  it('deduplicates modules and puts them in MODULES order', () => {
    expect(
      normalizeSetup({
        classCount: 4,
        automas: [],
        modules: ['historicalEvents', 'hiddenAgendas', 'historicalEvents'],
      })
    ).toEqual({ classCount: 4, automas: [], modules: ['hiddenAgendas', 'historicalEvents'] });
  });
});

describe('setupToSegment', () => {
  it('writes the default setup as 4p', () => {
    expect(setupToSegment(DEFAULT_SETUP)).toBe('4p');
  });

  it('writes Automas then modules as +token', () => {
    expect(
      setupToSegment({
        classCount: 4,
        automas: ['working', 'middle'],
        modules: ['crisisResponse', 'hiddenAgendas', 'historicalEvents'],
      })
    ).toBe('4p+wca+mca+cr+ha+he');
  });

  it('normalizes before it writes', () => {
    expect(setupToSegment({ classCount: 2, automas: ['middle', 'working'], modules: ['alternativeEvents'] })).toBe(
      '2p+wca'
    );
  });
});

describe('segmentToSetup', () => {
  it('reads plain class counts', () => {
    expect(segmentToSetup('2p')).toEqual({ classCount: 2, automas: [], modules: [] });
    expect(segmentToSetup('3p')).toEqual({ classCount: 3, automas: [], modules: [] });
    expect(segmentToSetup('4p')).toEqual({ classCount: 4, automas: [], modules: [] });
  });

  it('reads Automas and modules', () => {
    expect(segmentToSetup('4p+wca+mca+cr+ha+he')).toEqual({
      classCount: 4,
      automas: ['working', 'middle'],
      modules: ['crisisResponse', 'hiddenAgendas', 'historicalEvents'],
    });
  });

  it('ignores unknown tokens', () => {
    expect(segmentToSetup('4p+nonsense+cr')).toEqual({
      classCount: 4,
      automas: [],
      modules: ['crisisResponse'],
    });
  });

  it('drops ae below 4 classes and extra Automas', () => {
    expect(segmentToSetup('3p+cca+ae')).toEqual({ classCount: 3, automas: ['capitalist'], modules: [] });
    expect(segmentToSetup('2p+wca+cca')).toEqual({ classCount: 2, automas: ['working'], modules: [] });
  });

  it('returns null for anything that does not start with 2p, 3p or 4p', () => {
    expect(segmentToSetup('')).toBeNull();
    expect(segmentToSetup('5p')).toBeNull();
    expect(segmentToSetup('3')).toBeNull();
    expect(segmentToSetup('3p-extra')).toBeNull();
    expect(segmentToSetup('policies')).toBeNull();
  });
});

describe('segment round trip', () => {
  const setups: readonly GameSetup[] = [
    DEFAULT_SETUP,
    { classCount: 2, automas: ['working'], modules: [] },
    { classCount: 3, automas: ['capitalist'], modules: ['crisisResponse'] },
    { classCount: 4, automas: ['working', 'middle', 'capitalist'], modules: ['alternativeEvents'] },
    { classCount: 4, automas: [], modules: ['crisisResponse', 'hiddenAgendas', 'historicalEvents'] },
    { classCount: 3, automas: ['middle'], modules: ['actionCards', 'actionCards'] },
  ];

  it('segmentToSetup(setupToSegment(s)) equals normalizeSetup(s)', () => {
    for (const setup of setups) {
      expect(segmentToSetup(setupToSegment(setup)), setupToSegment(setup)).toEqual(normalizeSetup(setup));
    }
  });
});

describe('setup predicates', () => {
  const twoHumansTwoAutomas = segmentToSetup('4p+wca+mca');

  it('2 humans and 2 Automas: capitalist and state are human, working is an Automa', () => {
    expect(twoHumansTwoAutomas).toEqual({ classCount: 4, automas: ['working', 'middle'], modules: [] });
    expect(isHuman('capitalist', twoHumansTwoAutomas ?? DEFAULT_SETUP)).toBe(true);
    expect(isHuman('state', twoHumansTwoAutomas ?? DEFAULT_SETUP)).toBe(true);
    expect(isAutoma('working', twoHumansTwoAutomas ?? DEFAULT_SETUP)).toBe(true);
    expect(isAutoma('middle', twoHumansTwoAutomas ?? DEFAULT_SETUP)).toBe(true);
    expect(isAutoma('state', twoHumansTwoAutomas ?? DEFAULT_SETUP)).toBe(false);
    expect(isHuman('working', twoHumansTwoAutomas ?? DEFAULT_SETUP)).toBe(false);
  });

  it('a class that does not play is neither human nor Automa', () => {
    const twoClasses = segmentToSetup('2p+wca') ?? DEFAULT_SETUP;
    expect(isHuman('middle', twoClasses)).toBe(false);
    expect(isAutoma('middle', twoClasses)).toBe(false);
    expect(isHuman('state', twoClasses)).toBe(false);
  });

  it('the State plays only with 4 classes', () => {
    expect(stateHasPlayer(DEFAULT_SETUP)).toBe(true);
    expect(stateHasPlayer({ classCount: 2, automas: [], modules: [] })).toBe(false);
    expect(stateHasPlayer({ classCount: 3, automas: [], modules: [] })).toBe(false);
  });

  it('hasModule answers for modules on and off', () => {
    const setup = segmentToSetup('4p+cr+ha') ?? DEFAULT_SETUP;
    expect(hasModule('crisisResponse', setup)).toBe(true);
    expect(hasModule('hiddenAgendas', setup)).toBe(true);
    expect(hasModule('historicalEvents', setup)).toBe(false);
  });
});

describe('setup toggles', () => {
  it('with 2 classes the second Automa is refused: normalization keeps one', () => {
    const none = segmentToSetup('2p') ?? DEFAULT_SETUP;
    const one = toggleAutoma(none, 'working');
    expect(one.automas).toEqual(['working']);
    const two = toggleAutoma(one, 'capitalist');
    expect(two.automas).toEqual(['working']);
    expect(two.classCount).toBe(2);
  });

  it('toggleAutoma turns an Automa back into a human', () => {
    const setup = segmentToSetup('4p+wca+mca') ?? DEFAULT_SETUP;
    const toggled = toggleAutoma(setup, 'middle');
    expect(toggled.automas).toEqual(['working']);
    expect(isHuman('middle', toggled)).toBe(true);
  });

  it('toggleModule adds and removes a module', () => {
    const setup = segmentToSetup('4p+cr') ?? DEFAULT_SETUP;
    const withHa = toggleModule(setup, 'hiddenAgendas');
    expect(withHa.modules).toEqual(['crisisResponse', 'hiddenAgendas']);
    expect(toggleModule(withHa, 'crisisResponse').modules).toEqual(['hiddenAgendas']);
  });

  it('going from 4 to 3 classes drops alternativeEvents', () => {
    const four = segmentToSetup('4p+ae+ha') ?? DEFAULT_SETUP;
    expect(four.modules).toEqual(['alternativeEvents', 'hiddenAgendas']);
    const three = withClassCount(four, 3);
    expect(three.classCount).toBe(3);
    expect(three.modules).toEqual(['hiddenAgendas']);
  });

  it('going from 4 to 2 classes drops the Automas that no longer play', () => {
    const four = segmentToSetup('4p+wca+mca+cca') ?? DEFAULT_SETUP;
    const two = withClassCount(four, 2);
    expect(two.classCount).toBe(2);
    expect(two.automas).toEqual(['working']);
  });
});
