import { StateTreasury } from '@/components/calculators/StateTreasury';

export function StateView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-class-state mb-1">The State</h2>
        <p className="text-neutral-400">Legitimacy & Fiscal Responsibility</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <StateTreasury />
      </div>
    </div>
  );
}