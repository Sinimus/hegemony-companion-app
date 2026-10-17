import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { PLAYER_COUNTS, isClassActive } from '@/logic/players';
import type { Screen } from '@/logic/route';
import { WelcomeView } from '@/views/WelcomeView';
import { DashboardView } from '@/views/DashboardView';
import { EndGameView } from '@/views/EndGameView';
import { ScreensNav, ClassTabs } from '@/components/layout/AppNav';
import { AppFooter } from '@/components/layout/AppFooter';
import { CapitalistView } from '@/views/CapitalistView';
import { WorkingView } from '@/views/WorkingView';
import { StateView } from '@/views/StateView';
import { MiddleView } from '@/views/MiddleView';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlayerClass } from '@/types/game';

const CLASS_SCREENS: readonly Screen[] = ['working', 'middle', 'capitalist', 'state'];

function isPlayerClass(screen: Screen): screen is PlayerClass {
  return CLASS_SCREENS.includes(screen);
}

function App() {
  const { playerCount, setPlayerCount, resetGame, screen } = useGameStore();

  // A class that does not play at this player count falls back to the policies screen.
  const active = isPlayerClass(screen) && !isClassActive(screen, playerCount)
    ? 'policies'
    : screen;

  const mainRef = useRef<HTMLElement>(null);
  const previousScreen = useRef<Screen>(screen);
  useEffect(() => {
    if (previousScreen.current === screen) return;
    previousScreen.current = screen;
    // Announce the new screen: start at the top and focus the main content.
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [screen]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pb-24 md:pb-0 md:pt-20">
      <ScreensNav />

      <header className="max-w-4xl mx-auto p-4 md:px-8 flex flex-wrap justify-between items-end gap-x-3 gap-y-2 border-b border-neutral-800/50">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">HEGEMONY <span className="text-neutral-600 font-normal text-sm">Companion</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <div role="group" aria-label="Number of players" className="flex items-center gap-2">
              <span className="text-xs uppercase text-neutral-500 font-bold" aria-hidden="true">Players</span>
              {PLAYER_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  aria-pressed={playerCount === count}
                  aria-label={`${count} players`}
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
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
      </header>

      <ClassTabs />

      <main ref={mainRef} tabIndex={-1} className="p-4 md:px-8 max-w-4xl mx-auto animate-enter focus:outline-none">
        {active === 'guide' && <WelcomeView />}
        {active === 'policies' && <DashboardView />}
        {active === 'endgame' && <EndGameView />}
        {active === 'capitalist' && <CapitalistView />}
        {active === 'working' && <WorkingView />}
        {active === 'state' && <StateView />}
        {active === 'middle' && <MiddleView />}
      </main>
      <AppFooter />
    </div>
  );
}

export default App;
