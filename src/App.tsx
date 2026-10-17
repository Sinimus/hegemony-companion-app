import { useViewStore, type View } from '@/stores/useViewStore';
import { useGameStore } from '@/stores/useGameStore';
import { PLAYER_COUNTS, isClassActive } from '@/logic/players';
import { WelcomeView } from '@/views/WelcomeView';
import { DashboardView } from '@/views/DashboardView';
import { EndGameView } from '@/views/EndGameView';
import { ClassSelector } from '@/components/layout/ClassSelector';
import { AppFooter } from '@/components/layout/AppFooter';
import { CapitalistView } from '@/views/CapitalistView';
import { WorkingView } from '@/views/WorkingView';
import { StateView } from '@/views/StateView';
import { MiddleView } from '@/views/MiddleView';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlayerClass } from '@/types/game';

function isPlayerClass(v: View): v is PlayerClass {
  return v === 'working' || v === 'middle' || v === 'capitalist' || v === 'state';
}

function App() {
  const { currentView } = useViewStore();
  const { playerCount, setPlayerCount, resetGame } = useGameStore();

  // A class that does not play at this player count falls back to the dashboard.
  const view = isPlayerClass(currentView) && !isClassActive(currentView, playerCount)
    ? 'dashboard'
    : currentView;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pb-24 md:pb-0 md:pt-20">
      <ClassSelector />

      <header className="max-w-4xl mx-auto p-4 md:px-8 flex justify-between items-end border-b border-neutral-800/50 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">HEGEMONY <span className="text-neutral-600 font-normal text-sm">Companion</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <div role="group" aria-label="Number of players" className="flex items-center gap-2">
              <span className="text-xs uppercase text-neutral-500 font-bold">Players</span>
              {PLAYER_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  aria-pressed={playerCount === count}
                  className={cn(
                    'w-8 h-8 rounded text-sm font-bold',
                    playerCount === count ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-800'
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
            <button
              onClick={() => { if(confirm('Reset all policies to the start of the game?')) resetGame() }}
              className="p-2 text-neutral-600 hover:text-red-500 transition-colors hover:bg-neutral-900 rounded"
              title="Reset policies"
              aria-label="Reset policies"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
      </header>

      <main className="p-4 md:px-8 max-w-4xl mx-auto animate-in fade-in duration-500">
        {view === 'welcome' && <WelcomeView />}
        {view === 'dashboard' && <DashboardView />}
        {view === 'endgame' && <EndGameView />}
        {view === 'capitalist' && <CapitalistView />}
        {view === 'working' && <WorkingView />}
        {view === 'state' && <StateView />}
        {view === 'middle' && <MiddleView />}
      </main>
      <AppFooter />
    </div>
  );
}

export default App;
