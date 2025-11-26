import { MiddleBalance } from '@/components/calculators/MiddleBalance';
import { TradeCalc } from '@/components/calculators/TradeCalc';
import { MiddleProsperityCalc } from '@/components/calculators/MiddleProsperityCalc';
import { ImportTariffCalc } from '@/components/calculators/ImportTariffCalc';
import { FactionReference } from '@/components/domain/FactionReference';

export function MiddleView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-class-middle mb-1">Middle Class</h2>
        <p className="text-neutral-400">Balance & Sustainability</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <MiddleBalance />
        <TradeCalc />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <MiddleProsperityCalc />
        <ImportTariffCalc />
      </div>
      <FactionReference playerClass="middle" />
    </div>
  );
}