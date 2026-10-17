import { create } from 'zustand';
import type { PolicyType, PolicyLevel } from '@/types/game';
import { playerCountFromHash, playerCountToHash, type PlayerCount } from '@/logic/players';

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
  playerCount: PlayerCount;
  setPlayerCount: (count: PlayerCount) => void;
  resetGame: () => void;
}

const DEFAULT_PLAYER_COUNT: PlayerCount = 4;

function readPlayerCount(): PlayerCount {
  return playerCountFromHash(globalThis.location?.hash ?? '') ?? DEFAULT_PLAYER_COUNT;
}

function writePlayerCount(count: PlayerCount): void {
  globalThis.history?.replaceState(null, '', playerCountToHash(count));
}

export const useGameStore = create<GameState>((set) => ({
  policies: INITIAL_POLICIES,
  setPolicy: (policy, level) =>
    set((state) => ({ policies: { ...state.policies, [policy]: level } })),
  playerCount: readPlayerCount(),
  setPlayerCount: (count) => {
    writePlayerCount(count);
    set({ playerCount: count });
  },
  resetGame: () => set({ policies: INITIAL_POLICIES }),
}));

// Follow edits of the address (a pasted or edited link).
globalThis.addEventListener?.('hashchange', () => {
  useGameStore.setState({ playerCount: readPlayerCount() });
});
