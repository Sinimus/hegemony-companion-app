import { create } from 'zustand';
import type { PolicyType, PolicyLevel } from '@/types/game';
import { playerCountFromSetup, playerCountToSetup, type PlayerCount } from '@/logic/players';
import { buildHash, parseHash, type Route, type Screen } from '@/logic/route';

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
  setup: string;
  screen: Screen;
  playerCount: PlayerCount;
  setScreen: (screen: Screen) => void;
  setPlayerCount: (count: PlayerCount) => void;
  resetGame: () => void;
}

const DEFAULT_PLAYER_COUNT: PlayerCount = 4;

function readRoute(): Route {
  return parseHash(globalThis.location?.hash ?? '');
}

// An address without a setup segment keeps the default player count and is not
// rewritten until the user changes something.
const initialRoute = readRoute();

export const useGameStore = create<GameState>((set, get) => ({
  policies: INITIAL_POLICIES,
  setPolicy: (policy, level) =>
    set((state) => ({ policies: { ...state.policies, [policy]: level } })),
  setup: initialRoute.setup,
  screen: initialRoute.screen,
  playerCount: playerCountFromSetup(initialRoute.setup) ?? DEFAULT_PLAYER_COUNT,
  setScreen: (screen) => {
    // A screen change is navigation: it goes through the address and creates a
    // history entry, so browser Back returns to the previous screen.
    if (globalThis.location) {
      globalThis.location.hash = buildHash({ setup: get().setup, screen });
    }
    set({ screen });
  },
  setPlayerCount: (count) => {
    // Changing the setup is not navigation: replace the address, no history entry.
    globalThis.history?.replaceState(null, '', buildHash({ setup: playerCountToSetup(count), screen: get().screen }));
    set({ setup: playerCountToSetup(count), playerCount: count });
  },
  resetGame: () => set({ policies: INITIAL_POLICIES }),
}));

// Follow edits of the address (navigation, a pasted or edited link).
globalThis.addEventListener?.('hashchange', () => {
  const route = readRoute();
  useGameStore.setState({
    setup: route.setup,
    screen: route.screen,
    playerCount: playerCountFromSetup(route.setup) ?? DEFAULT_PLAYER_COUNT,
  });
});
