import { useViewStore } from '@/stores/useViewStore';
import { cn } from '@/lib/utils';
import { Briefcase, Users, Home, Landmark, LayoutDashboard } from 'lucide-react';

export function ClassSelector() {
  const { currentView, setView } = useViewStore();

  const navItems = [
    { id: 'dashboard', label: 'Policies', icon: LayoutDashboard, color: 'text-neutral-400' },
    { id: 'working', label: 'Working', icon: Users, color: 'text-class-working' },
    { id: 'middle', label: 'Middle', icon: Home, color: 'text-class-middle' },
    { id: 'capitalist', label: 'Capitalist', icon: Briefcase, color: 'text-class-capitalist' },
    { id: 'state', label: 'State', icon: Landmark, color: 'text-class-state' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 p-2 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:bg-neutral-950">
      <div className="flex justify-around md:justify-center md:gap-8 max-w-4xl mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={cn(
              'flex flex-col items-center p-2 rounded-lg transition-all min-w-[60px]',
              currentView === item.id
                ? 'bg-neutral-800 ring-1 ring-white/10 scale-105 shadow-lg'
                : 'hover:bg-neutral-800/50 opacity-60 hover:opacity-100'
            )}
          >
            <item.icon className={cn('w-5 h-5 mb-1 md:w-6 md:h-6', item.color)} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 md:text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}