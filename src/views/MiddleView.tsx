import { MiddleBalance } from '@/components/calculators/MiddleBalance';
import { MiddleProsperityCalc } from '@/components/calculators/MiddleProsperityCalc';
import { ImportTariffCalc } from '@/components/calculators/ImportTariffCalc';
import { FactionReference } from '@/components/domain/FactionReference';
import { AutomaReference } from '@/components/domain/AutomaReference';
import { isAutoma } from '@/logic/setup';
import { useGameStore } from '@/stores/useGameStore';

export function MiddleView() {
  const { setup } = useGameStore();

  return (
    <div className="space-y-6 animate-enter">
      <header>
        <h2 className="text-3xl font-black text-class-middle mb-1">Middle Class</h2>
        <p className="text-neutral-400">Balance & Sustainability</p>
      </header>
      {isAutoma('middle', setup) && <AutomaReference automaClass="middle" />}
      <div className="grid gap-6 md:grid-cols-2">
        <MiddleBalance />
        <MiddleProsperityCalc />
        <ImportTariffCalc />
      </div>
      <FactionReference playerClass="middle" />
    </div>
  );
}
