import { ProductionCalc } from '@/components/calculators/ProductionCalc';
import { ImportTariffCalc } from '@/components/calculators/ImportTariffCalc';
import { WealthCalc } from '@/components/calculators/WealthCalc';
import { TradeCalc } from '@/components/calculators/TradeCalc';
import { FactionReference } from '@/components/domain/FactionReference';

export function CapitalistView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-class-capitalist mb-1">Capitalist Class</h2>
        <p className="text-neutral-400">Profit maximization & Market dominance</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <ProductionCalc />
        <TradeCalc />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <WealthCalc />
        <ImportTariffCalc />
      </div>
      <FactionReference playerClass="capitalist" />
    </div>
  );
}