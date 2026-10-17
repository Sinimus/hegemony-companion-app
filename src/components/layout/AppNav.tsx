import { useGameStore } from '@/stores/useGameStore';
import { getActiveClasses } from '@/logic/players';
import { buildHash, type Screen } from '@/logic/route';
import { cn } from '@/lib/utils';
import { Briefcase, Users, Home, Landmark, LayoutDashboard, BookOpen, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PlayerClass } from '@/types/game';

const SCREEN_ITEMS: { screen: Screen; label: string; icon: LucideIcon }[] = [
  { screen: 'guide', label: 'Guide', icon: BookOpen },
  { screen: 'policies', label: 'Policies', icon: LayoutDashboard },
  { screen: 'endgame', label: 'End Game', icon: Trophy },
];

const CLASS_ITEMS: Record<PlayerClass, { label: string; icon: LucideIcon }> = {
  working: { label: 'Working', icon: Users },
  middle: { label: 'Middle', icon: Home },
  capitalist: { label: 'Capitalist', icon: Briefcase },
  state: { label: 'State', icon: Landmark },
};

// Static class-name lookup: Tailwind never generates classes built from variables
const CLASS_TEXT: Record<PlayerClass, string> = {
  working: 'text-class-working',
  middle: 'text-class-middle',
  capitalist: 'text-class-capitalist',
  state: 'text-class-state',
};

const CLASS_BORDER: Record<PlayerClass, string> = {
  working: 'border-class-working',
  middle: 'border-class-middle',
  capitalist: 'border-class-capitalist',
  state: 'border-class-state',
};

// The three screens: bottom bar on mobile, top bar from md up. Links carry the
// hash address, so open-in-new-tab works and the hashchange listener navigates.
export function ScreensNav() {
  const { setupSegment, screen } = useGameStore();

  return (
    <nav
      aria-label="Screens"
      className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 p-2 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:bg-neutral-950"
    >
      <div className="flex max-w-4xl mx-auto">
        {SCREEN_ITEMS.map((item) => {
          const active = screen === item.screen;
          return (
            <a
              key={item.screen}
              href={buildHash({ setup: setupSegment, screen: item.screen })}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] rounded-lg transition-colors',
                active
                  ? 'bg-neutral-800 text-white ring-1 ring-white/10'
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              )}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[11px] font-bold">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

// One tab per class that plays at the current player count, in turn order.
export function ClassTabs() {
  const { setupSegment, screen, playerCount } = useGameStore();

  return (
    <nav aria-label="Classes" className="max-w-4xl mx-auto px-4 md:px-8 mb-6">
      <div className="flex">
        {getActiveClasses(playerCount).map((playerClass) => {
          const { label, icon: Icon } = CLASS_ITEMS[playerClass];
          const active = screen === playerClass;
          return (
            <a
              key={playerClass}
              href={buildHash({ setup: setupSegment, screen: playerClass })}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex-1 flex items-center justify-center gap-1 min-h-[44px] text-[11px] font-bold border-b-2 transition-colors',
                active
                  ? cn(CLASS_TEXT[playerClass], CLASS_BORDER[playerClass])
                  : 'border-transparent text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              )}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
