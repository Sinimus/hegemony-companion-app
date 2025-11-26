import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateProductionCost, calculateCorporateTax, calculateEmploymentTax } from '@/logic/economics';

export function ProductionCalc() {
  const { policies } = useGameStore();
  const [companies, setCompanies] = useState(1);
  const [revenue, setRevenue] = useState(0);

  const costs = calculateProductionCost(companies, policies.labor);
  const corporateTax = calculateCorporateTax(revenue, policies.tax);
  const employmentTax = calculateEmploymentTax(companies, policies.tax, policies.health, policies.education);

  const profitBeforeTax = revenue - costs.totalCost;
  const netProfit = profitBeforeTax - corporateTax - employmentTax;

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

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Wages ({costs.wagePerWorker}/worker)</span>
          <span className="text-red-400 font-mono">-{costs.totalWages}</span>
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