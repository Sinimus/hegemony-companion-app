import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateProductionCost, calculateCorporateTax, calculateEmploymentTax } from '@/logic/economics';
import { cn } from '@/lib/utils';

export function ProductionCalc() {
  const { policies } = useGameStore();
  const [companies, setCompanies] = useState(1);
  const [revenue, setRevenue] = useState(50);
  const [isAutomated, setIsAutomated] = useState(false); // NEW STATE for automation/machinery

  // Recalculate costs based on automation
  let costs = calculateProductionCost(companies, policies.labor);
  let employmentTax = calculateEmploymentTax(companies, policies.tax, policies.health, policies.education);

  if (isAutomated) {
    // Automated Company / Company with Machinery Token:
    // Pays ZERO wages (Automated/Machinery Company rule).
    costs = { ...costs, totalWages: 0, totalCost: costs.totalOps };
    // Employment Tax already includes operational companies x TM, so no change there.
  }

  const corporateTax = calculateCorporateTax(revenue, policies.tax);

  const profitBeforeTax = revenue - costs.totalCost;
  const netProfit = profitBeforeTax - corporateTax - employmentTax; // Total costs applied

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
        🏭 Production Calculator
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Companies</label>
          <input
            type="number"
            min="1"
            value={companies}
            onChange={(e) => setCompanies(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Exp. Revenue</label>
          <input
            type="number"
            min="0"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>
      </div>

      {/* NEW UI: Automation Toggle */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-neutral-400">Simulate Automation (No Wages)</span>
        <button
          onClick={() => setIsAutomated(!isAutomated)}
          className={cn(
            'px-3 py-1 text-xs font-bold rounded-full transition-colors',
            isAutomated ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          )}
        >
          {isAutomated ? 'AUTOMATED' : 'WORKERS'}
        </button>
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        {/* Wage line is now conditionally styled/valued */}
        <div className="flex justify-between text-sm">
          <span className={cn("text-neutral-400", isAutomated && "line-through opacity-50")}>
            Wages ({costs.wagePerWorker}/worker)
          </span>
          <span className={cn("font-mono", isAutomated ? "text-neutral-600" : "text-red-400")}>
            -{costs.totalWages}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Operational Costs</span>
          <span className="text-red-400 font-mono">-{costs.totalOps}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Employment Tax (TM: {companies > 0 ? employmentTax / companies : 0}/unit)</span>
          <span className="text-red-400 font-mono">-{employmentTax}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Corporate Tax (Pol: {policies.tax})</span>
          <span className="text-red-400 font-mono">-{corporateTax}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">Net Profit</span>
          <span className={netProfit >= 0 ? 'text-green-400' : 'text-red-500'}>{netProfit}</span>
        </div>
      </div>
    </div>
  );
}