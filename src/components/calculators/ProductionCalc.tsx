import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import {
  calculateCapitalistTaxes,
  calculateTaxMultiplier,
  getAllowedWageLevels,
} from '@/logic/economics';
import { formatDeduction } from '@/lib/format';

export function ProductionCalc() {
  const { policies } = useGameStore();
  const [revenue, setRevenue] = useState(0);
  const [wages, setWages] = useState(0);
  const [companies, setCompanies] = useState(4);

  // Wages first, then Employment Tax, then Corporate Tax on the Revenue that remains (p. 20)
  const taxMultiplier = calculateTaxMultiplier(policies.tax, policies.health, policies.education);
  const result = calculateCapitalistTaxes({
    revenue,
    wages,
    operationalCompanies: companies,
    taxPolicy: policies.tax,
    healthPolicy: policies.health,
    educationPolicy: policies.education,
  });
  const allowedLevels = getAllowedWageLevels(policies.labor).join(', ');

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
        🏭 Capitalist Wages & Taxes
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="cc-revenue" className="text-xs uppercase text-neutral-500 font-bold">Revenue before wages</label>
          <input
            id="cc-revenue"
            type="number"
            min="0"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cc-wages" className="text-xs uppercase text-neutral-500 font-bold">Wages of your Companies</label>
          <input
            id="cc-wages"
            type="number"
            min="0"
            value={wages}
            onChange={(e) => setWages(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
          <p className="text-xs text-neutral-500">Sum of each Company's wage at its current level; automated Companies pay none (p. 20)</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="cc-companies" className="text-xs uppercase text-neutral-500 font-bold">Operational Companies</label>
          <input
            id="cc-companies"
            type="number"
            min="0"
            value={companies}
            onChange={(e) => setCompanies(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
          <p className="text-xs text-neutral-500">Count automated Companies too; the Capitalist Class starts with 4 Companies (p. 8)</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Wages</span>
            <span className="text-red-400 font-mono">{formatDeduction(wages)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Employment Tax (TM {taxMultiplier} x {companies})</span>
            <span className="text-red-400 font-mono">{formatDeduction(result.employmentTax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Corporate Tax (P3 {policies.tax})</span>
            <span className="text-red-400 font-mono">{formatDeduction(result.corporateTax)}</span>
          </div>
          <p className="text-xs text-amber-400/80">Corporate Tax table not verified except Revenue 81 at P3 A (p. 20).</p>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
            <span className="text-neutral-200">To Capital</span>
            <span className={result.capitalChange >= 0 ? 'text-green-400' : 'text-red-500'}>{result.capitalChange}</span>
          </div>
          {result.capitalChange < 0 && (
            <p className="text-xs text-neutral-500">Negative: the rest is paid from Capital (p. 38)</p>
          )}
          <p className="text-xs text-neutral-500">Allowed wage levels (P2 {policies.labor}): {allowedLevels}</p>
        </div>
      </div>
    </div>
  );
}
