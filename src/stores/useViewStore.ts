import { create } from 'zustand';
import type { PlayerClass } from '@/types/game';

type View = 'welcome' | 'dashboard' | PlayerClass;

interface ViewState {
  currentView: View;
  setView: (view: View) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'welcome',
  setView: (view) => set({ currentView: view }),
}));