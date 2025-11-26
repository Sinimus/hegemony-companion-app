import { WorkerBudget } from '@/components/calculators/WorkerBudget';
import { WorkingProsperityCalc } from '@/components/calculators/WorkingProsperityCalc';
import { FactionReference } from '@/components/domain/FactionReference';

export function WorkingView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-class-working mb-1">Working Class</h2>
        <p className="text-neutral-400">Solidarity & Prosperity</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <WorkerBudget />
        <WorkingProsperityCalc />
      </div>
      <FactionReference playerClass="working" />
    </div>
  );
}