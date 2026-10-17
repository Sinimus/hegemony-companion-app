import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import {
  calculateWorkingClassIncomeTax,
  getAllowedWageLevels,
  getIncomeTaxRate,
} from '@/logic/economics';
import { isIncomeTaxRateVerified } from '@/logic/taxData';
import { formatDeduction } from '@/lib/format';

export function WorkerBudget() {
  const { policies } = useGameStore();
  const [population, setPopulation] = useState(10);
  const [wages, setWages] = useState(0);

  const rate = getIncomeTaxRate(policies.labor, policies.tax);
  const incomeTax = calculateWorkingClassIncomeTax(population, policies.labor, policies.tax);
  const net = wages - incomeTax;
  const allowedLevels = getAllowedWageLevels(policies.labor).join(', ');

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-class-working flex items-center gap-2">
        <span aria-hidden="true">☭</span> Working Class Taxes
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="wc-population" className="text-xs uppercase text-neutral-500 font-bold">Population</label>
          <input
            id="wc-population"
            type="number"
            min="0"
            value={population}
            onChange={(e) => setPopulation(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
          <p className="text-xs text-neutral-500">The Working Class starts with 10 Workers (p. 10)</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="wc-wages" className="text-xs uppercase text-neutral-500 font-bold">Wages received this round</label>
          <input
            id="wc-wages"
            type="number"
            min="0"
            value={wages}
            onChange={(e) => setWages(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
          <p className="text-xs text-neutral-500">Sum of the wages on the Companies where your Workers work (p. 11-12)</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Income Tax ({rate} per Population, P2 {policies.labor} / P3 {policies.tax})</span>
            <span className="text-red-400 font-mono">{formatDeduction(incomeTax)}</span>
          </div>
          {!isIncomeTaxRateVerified(policies.labor, policies.tax) && (
            <p className="text-xs text-amber-400/80">Tax rate from the player aid table; not verified against the rules text.</p>
          )}
          <p className="text-xs text-neutral-500">After an IMF intervention that moved Labor Market, pay by its previous section (p. 33).</p>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
            <span className="text-neutral-200">Wages after tax</span>
            <span className="text-white">{net}</span>
          </div>
          <p className="text-xs text-neutral-500">Allowed wage levels (P2 {policies.labor}): {allowedLevels}</p>
        </div>
      </div>
    </div>
  );
}
