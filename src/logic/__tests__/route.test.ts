import { describe, expect, it } from 'vitest';
import { buildHash, parseHash, SCREENS, type Route } from '@/logic/route';

describe('parseHash', () => {
  it('splits setup and screen', () => {
    expect(parseHash('#4p/policies')).toEqual({ setup: '4p', screen: 'policies' });
  });

  it('defaults the screen to guide when it is missing', () => {
    expect(parseHash('#3p')).toEqual({ setup: '3p', screen: 'guide' });
    expect(parseHash('')).toEqual({ setup: '', screen: 'guide' });
  });

  it('falls back to guide for an unknown screen', () => {
    expect(parseHash('#4p/nonsense')).toEqual({ setup: '4p', screen: 'guide' });
  });

  it('parses the setup and round screens', () => {
    expect(parseHash('#2p/setup')).toEqual({ setup: '2p', screen: 'setup' });
    expect(parseHash('#4p+wca/round')).toEqual({ setup: '4p+wca', screen: 'round' });
  });

  it('allows an empty setup', () => {
    expect(parseHash('#/endgame')).toEqual({ setup: '', screen: 'endgame' });
  });
});

describe('buildHash', () => {
  it('omits the guide screen', () => {
    expect(buildHash({ setup: '4p', screen: 'guide' })).toBe('#4p');
  });

  it('appends any other screen', () => {
    expect(buildHash({ setup: '4p', screen: 'policies' })).toBe('#4p/policies');
    expect(buildHash({ setup: '', screen: 'endgame' })).toBe('#/endgame');
  });
});

describe('round trip', () => {
  it('parseHash(buildHash(route)) returns the route for every screen', () => {
    for (const screen of SCREENS) {
      const route: Route = { setup: '3p', screen };
      expect(parseHash(buildHash(route))).toEqual(route);
    }
  });

  it('keeps an empty setup through the round trip', () => {
    const route: Route = { setup: '', screen: 'working' };
    expect(parseHash(buildHash(route))).toEqual(route);
  });
});
