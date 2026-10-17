import { create } from 'zustand';
import type { PolicyType, PolicyLevel } from '@/types/game';
import type { PlayerCount } from '@/logic/players';
import { buildHash, parseHash, type Route, type Screen } from '@/logic/route';
import {
  DEFAULT_SETUP,
  normalizeSetup,
  segmentToSetup,
  setupToSegment,
  withClassCount,
  type GameSetup,
} from '@/logic/setup';

// Policies used to be persisted; drop the stale copy so it cannot confuse anyone.
try {
  globalThis.localStorage?.removeItem('hegemony-storage');
} catch {
  // Storage can be unavailable (private mode); nothing to clean then.
}

// Start of the game, Hegemony Rulebook v1.2. Verified: fiscal C (Fiscal Policy, p. 30),
// tax A, health B, education C (Taxation, Example 1, p. 30-31; Tax Multiplier 5, Main Board Setup, p. 8).
// Not verifiable from the rules text (the setup diagram is an image): labor, trade, immigration.
export const INITIAL_POLICIES: Record<PolicyType, PolicyLevel> = {
  fiscal: 'C',
  labor: 'B', // unverified
  tax: 'A',
  health: 'B',
  education: 'C',
  trade: 'B', // unverified; setup draws 1 Business Deal and puts the Import marker on the middle space (p. 8)
  immigration: 'B', // unverified
};
export const UNVERIFIED_START_POLICIES: readonly PolicyType[] = ['labor', 'trade', 'immigration'];

interface GameState {
  policies: Record<PolicyType, PolicyLevel>;
  setPolicy: (policy: PolicyType, level: PolicyLevel) => void;
  setup: GameSetup;
  // The segment links are built from: the address's own (empty when it had no setup
  // segment), or the normalized one once the user changes the setup.
  setupSegment: string;
  screen: Screen;
  // Derived from setup.classCount, updated together with setup.
  playerCount: PlayerCount;
  setScreen: (screen: Screen) => void;
  setSetup: (next: GameSetup) => void;
  setPlayerCount: (count: PlayerCount) => void;
  resetGame: () => void;
}

function readRoute(): Route {
  return parseHash(globalThis.location?.hash ?? '');
}

// An address without a setup segment keeps the default setup and is not
// rewritten until the user changes something.
const initialRoute = readRoute();
const initialSetup = segmentToSetup(initialRoute.setup) ?? DEFAULT_SETUP;

export const useGameStore = create<GameState>((set, get) => ({
  policies: INITIAL_POLICIES,
  setPolicy: (policy, level) =>
    set((state) => ({ policies: { ...state.policies, [policy]: level } })),
  setup: initialSetup,
  setupSegment: initialRoute.setup,
  screen: initialRoute.screen,
  playerCount: initialSetup.classCount,
  setScreen: (screen) => {
    // A screen change is navigation: it goes through the address and creates a
    // history entry, so browser Back returns to the previous screen.
    if (globalThis.location) {
      globalThis.location.hash = buildHash({ setup: get().setupSegment, screen });
    }
    set({ screen });
  },
  setSetup: (next) => {
    // Changing the setup is not navigation: replace the address, no history entry.
    const setup = normalizeSetup(next);
    const segment = setupToSegment(setup);
    globalThis.history?.replaceState(null, '', buildHash({ setup: segment, screen: get().screen }));
    set({ setup, setupSegment: segment, playerCount: setup.classCount });
  },
  setPlayerCount: (count) => {
    get().setSetup(withClassCount(get().setup, count));
  },
  resetGame: () => set({ policies: INITIAL_POLICIES }),
}));

// Follow edits of the address (navigation, a pasted or edited link).
globalThis.addEventListener?.('hashchange', () => {
  const route = readRoute();
  const setup = segmentToSetup(route.setup) ?? DEFAULT_SETUP;
  useGameStore.setState({
    setup,
    setupSegment: route.setup,
    screen: route.screen,
    playerCount: setup.classCount,
  });
});
