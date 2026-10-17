import { WorkerBudget } from '@/components/calculators/WorkerBudget';
import { WorkingProsperityCalc } from '@/components/calculators/WorkingProsperityCalc';
import { FactionReference } from '@/components/domain/FactionReference';
import { AutomaReference } from '@/components/domain/AutomaReference';
import { TradeUnionVpCalc } from '@/components/calculators/MicroUtilityCalc';
import { isAutoma } from '@/logic/setup';
import { useGameStore } from '@/stores/useGameStore';

export function WorkingView() {
  const { setup } = useGameStore();

  return (
    <div className="space-y-6 animate-enter">
      <header>
        <h2 className="text-3xl font-black text-class-working mb-1">Working Class</h2>
        <p className="text-neutral-400">Solidarity & Prosperity</p>
      </header>
      {isAutoma('working', setup) && <AutomaReference automaClass="working" />}
      <div className="grid gap-6 md:grid-cols-2">
        <WorkerBudget />
        <WorkingProsperityCalc />
      </div>
      <div className="grid gap-6 md:grid-cols-2"> {/* NEW ROW FOR MICRO UTILITY */}
        <TradeUnionVpCalc />
      </div>
      <FactionReference playerClass="working" />
    </div>
  );
}
