import { useViewStore } from '@/stores/useViewStore';
import { useGameStore } from '@/stores/useGameStore';
import { WelcomeView } from '@/views/WelcomeView';
import { DashboardView } from '@/views/DashboardView';
import { ClassSelector } from '@/components/layout/ClassSelector';
import { CapitalistView } from '@/views/CapitalistView';
import { WorkingView } from '@/views/WorkingView';
import { StateView } from '@/views/StateView';
import { MiddleView } from '@/views/MiddleView';
import { Trash2 } from 'lucide-react';

function App() {
  const { currentView } = useViewStore();
  const { resetGame } = useGameStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pb-24 md:pb-0 md:pt-20">
      <ClassSelector />

      <header className="max-w-4xl mx-auto p-4 md:px-8 flex justify-between items-end border-b border-neutral-800/50 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">HEGEMONY <span className="text-neutral-600 font-normal text-sm">Companion</span></h1>
          </div>
          <button
            onClick={() => { if(confirm('Reset current game state?')) resetGame() }}
            className="p-2 text-neutral-600 hover:text-red-500 transition-colors hover:bg-neutral-900 rounded"
            title="Reset Game"
          >
            <Trash2 className="w-5 h-5" />
          </button>
      </header>

      <main className="p-4 md:px-8 max-w-4xl mx-auto animate-in fade-in duration-500">
        {currentView === 'welcome' && <WelcomeView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'capitalist' && <CapitalistView />}
        {currentView === 'working' && <WorkingView />}
        {currentView === 'state' && <StateView />}
        {currentView === 'middle' && <MiddleView />}
      </main>
    </div>
  );
}

export default App;
