// The page address carries the game setup and the screen: #<setup>/<screen>
// (e.g. #4p+wca+mca+cr/round). A bookmark or a reload keeps both, and browser
// Back moves between screens.
export const SCREENS = ['guide', 'setup', 'round', 'policies', 'endgame', 'working', 'middle', 'capitalist', 'state'] as const;
export type Screen = (typeof SCREENS)[number];

export interface Route {
  // The raw setup segment; segmentToSetup (logic/setup.ts) parses and validates
  // it, so nothing is checked here beyond "no / and no #" (the split below).
  setup: string;
  screen: Screen;
}

export function parseHash(hash: string): Route {
  const address = hash.startsWith('#') ? hash.slice(1) : hash;
  const slash = address.indexOf('/');
  const setup = slash === -1 ? address : address.slice(0, slash);
  const token = slash === -1 ? '' : address.slice(slash + 1);
  return { setup, screen: SCREENS.find((screen) => screen === token) ?? 'guide' };
}

export function buildHash(route: Route): string {
  return `#${route.setup}${route.screen === 'guide' ? '' : `/${route.screen}`}`;
}
