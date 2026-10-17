// The page address carries the game setup and the screen: #<setup>/<screen>
// (today #2p/#3p/#4p and a screen name). A bookmark or a reload keeps both,
// and browser Back moves between screens.
export const SCREENS = ['guide', 'policies', 'endgame', 'working', 'middle', 'capitalist', 'state'] as const;
export type Screen = (typeof SCREENS)[number];

export interface Route {
  // The raw setup segment; a later sprint adds more tokens to it, so nothing
  // is validated here beyond "no / and no #" (the split below).
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
