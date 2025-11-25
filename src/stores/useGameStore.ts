import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PolicyType, PolicyLevel } from '@/types/game';

interface GameState {
  policies: Record<PolicyType, PolicyLevel>;
  setPolicy: (policy: PolicyType, level: PolicyLevel) => void;
  round: number;
  nextRound: () => void;
  resetGame: () => void;
}

const INITIAL_POLICIES: Record<PolicyType, PolicyLevel> = {
  fiscal: 'B',
  labor: 'B',
  tax: 'B',
  health: 'B',
  education: 'B',
  trade: 'B',
  immigration: 'B',
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      policies: INITIAL_POLICIES,
      round: 1,
      setPolicy: (policy, level) =>
        set((state) => ({ policies: { ...state.policies, [policy]: level } })),
      nextRound: () => set((state) => ({ round: state.round + 1 })),
      resetGame: () => set({ policies: INITIAL_POLICIES, round: 1 }),
    }),
    {
      name: 'hegemony-storage',
    }
  )
);