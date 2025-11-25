import { ProductionCalc } from '@/components/calculators/ProductionCalc';
import { ExportCalc } from '@/components/calculators/ExportCalc';

export function CapitalistView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-class-capitalist mb-1">Capitalist Class</h2>
        <p className="text-neutral-400">Profit maximization & Market dominance</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <ProductionCalc />
        <ExportCalc />
      </div>
    </div>
  );
}