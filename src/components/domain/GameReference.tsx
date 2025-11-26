import { ROUND_PHASES, CLASS_STRATEGIES } from '@/data/rules';
import { useViewStore } from '@/stores/useViewStore';
import { cn } from '@/lib/utils';
import type { PlayerClass } from '@/types/game';

export function GameReference() {
    const { currentView } = useViewStore();
    const isDashboard = currentView === 'dashboard';

    // Zvol strategii na základě aktuálního pohledu (pro snazší přepínání)
    const activeClass = isDashboard ? 'working' : (currentView as keyof typeof CLASS_STRATEGIES);
    const strategy = CLASS_STRATEGIES[activeClass as PlayerClass] || CLASS_STRATEGIES.working; // Fallback na WC

    // Funkce pro získání správné CSS třídy pro barvy
    const getClassColorClass = (className: PlayerClass) => {
        const colorMap = {
            working: 'text-class-working border-class-working/50',
            middle: 'text-class-middle border-class-middle/50',
            capitalist: 'text-class-capitalist border-class-capitalist/50',
            state: 'text-class-state border-class-state/50'
        };
        return colorMap[className] || 'text-neutral-400 border-neutral-400/50';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <h2 className="text-2xl font-bold text-white tracking-tight">Game Reference & Phases</h2>

            {/* Přehled Fází Kola */}
            <div className="bg-neutral-900/70 border border-neutral-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-neutral-200 mb-4">Turn Structure (5 Phases)</h3>
                <div className="space-y-4">
                    {ROUND_PHASES.map((phase) => (
                        <div key={phase.name} className="border-l-4 border-purple-400/50 pl-4">
                            <p className="font-bold text-white">{phase.order} {phase.name}</p>
                            <p className="text-sm text-neutral-400">{phase.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strategický Přehled Frakce */}
            <div className={cn("bg-neutral-900/70 border rounded-lg p-6", getClassColorClass(activeClass as PlayerClass))}>
                <h3 className={cn("text-xl font-bold", getClassColorClass(activeClass as PlayerClass))}>
                    {activeClass.toUpperCase()} Strategy Guide
                </h3>
                <div className="space-y-4 text-sm text-neutral-300">
                    <div>
                        <p className="font-bold text-white">Objective:</p>
                        <p>{strategy.objective}</p>
                    </div>
                    <div>
                        <p className="font-bold text-white">Main VP Source:</p>
                        <p>{strategy.vp_source}</p>
                    </div>
                    <div>
                        <p className="font-bold text-white">Key Mechanics/Actions:</p>
                        <p>{strategy.key_mechanics}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}