import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { getMinimumWage } from '@/logic/economics';
import { INCOME_TAX_RATES } from '@/logic/taxes'; // Reuse logic where possible

export function MiddleBalance() {
  const { policies } = useGameStore();
  const [employedWorkers, setEmployedWorkers] = useState(2);
  const [companiesRevenue, setCompaniesRevenue] = useState(40);

  // 1. Příjem ze mzdy (práce pro stát/kapitalistu)
  const wage = getMinimumWage(policies.labor);
  const wageIncome = employedWorkers * wage;
  const incomeTax = Math.floor(wageIncome * INCOME_TAX_RATES[policies.tax]);

  // 2. Příjem z vlastních firem (Middle Class companies)
  // Middle class firmy neplatí mzdy (pracují tam sami), ale platí Corporate Tax
  // Zjednodušený model daně (stejný jako pro Kapitalisty)
  const taxRateMult = policies.tax === 'A' ? 1.5 : policies.tax === 'B' ? 1.0 : 0.5;
  const corporateTax = Math.ceil((companiesRevenue / 10) * taxRateMult);

  const totalNet = (wageIncome - incomeTax) + (companiesRevenue - corporateTax);

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-class-middle flex items-center gap-2">
        ⚖️ Hybrid Economy
      </h3>

      <div className="space-y-4">
        {/* Employment Section */}
        <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">Employment</h4>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Workers Employed</label>
            <input type="number" min="0" value={employedWorkers} onChange={(e) => setEmployedWorkers(Number(e.target.value))} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1 text-right" />
          </div>
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Net Wage Income</span>
            <span className="text-green-400">+{wageIncome - incomeTax}</span>
          </div>
        </div>

        {/* Business Section */}
        <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">Small Business</h4>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Revenue</label>
            <input type="number" min="0" value={companiesRevenue} onChange={(e) => setCompaniesRevenue(Number(e.target.value))} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1 text-right" />
          </div>
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Corp. Tax (Pol: {policies.tax})</span>
            <span className="text-red-400">-{corporateTax}</span>
          </div>
        </div>

        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">Total Net Income</span>
          <span className="text-class-middle">{totalNet}</span>
        </div>
      </div>
    </div>
  );
}