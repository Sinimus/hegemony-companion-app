import { create } from 'zustand';
import type { PlayerClass } from '@/types/game';

type View = 'dashboard' | PlayerClass;

interface ViewState {
  currentView: View;
  setView: (view: View) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'dashboard',
  setView: (view) => set({ currentView: view }),
}));