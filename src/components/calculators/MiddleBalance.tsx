import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { getMinimumWage, calculateCorporateTax, calculateEmploymentTax } from '@/logic/economics';
import { calculateWorkerIncomeTax } from '@/logic/scoring';

export function MiddleBalance() {
  const { policies } = useGameStore();
  const [employedWorkers, setEmployedWorkers] = useState(2);
  const [companiesRevenue, setCompaniesRevenue] = useState(40);
  const [mcCompanies, setMcCompanies] = useState(2);

  // 1. Příjem ze mzdy (práce pro stát/kapitalistu)
  const wage = getMinimumWage(policies.labor);
  const wageIncome = employedWorkers * wage;

  // NOVÝ VÝPOČET: Income Tax (přesná tabulka pro MC: Pop. x (P2/P3 rate))
  const incomeTax = calculateWorkerIncomeTax(employedWorkers, policies.labor, policies.tax);

  // 2. Příjem z vlastních firem (Small Business)
  const corporateTax = calculateCorporateTax(companiesRevenue, policies.tax);

  // NOVÝ VÝPOČET: Employment Tax (MC Companies x Tax Multiplier)
  const employmentTax = calculateEmploymentTax(mcCompanies, policies.tax, policies.health, policies.education);

  const totalNet = (wageIncome - incomeTax) + (companiesRevenue - corporateTax - employmentTax);

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-class-middle flex items-center gap-2">
        ⚖️ Hybrid Economy
      </h3>

      <div className="space-y-4">
        {/* Employment Section */}
        <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">Employment (Other Classes)</h4>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Workers Employed</label>
            <input type="number" min="0" value={employedWorkers} onChange={(e) => setEmployedWorkers(Number(e.target.value))} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1 text-right" />
          </div>
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Income Tax (Pol: L{policies.labor} T{policies.tax})</span>
            <span className="text-red-400">-{incomeTax}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Net Wage Income</span>
            <span className="text-green-400">+{wageIncome - incomeTax}</span>
          </div>
        </div>

        {/* Business Section */}
        <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">Small Business (Own Companies)</h4>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Operational Companies</label>
            <input type="number" min="0" value={mcCompanies} onChange={(e) => setMcCompanies(Number(e.target.value))} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1 text-right" />
          </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Revenue</label>
            <input type="number" min="0" value={companiesRevenue} onChange={(e) => setCompaniesRevenue(Number(e.target.value))} className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1 text-right" />
          </div>
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Employment Tax</span>
            <span className="text-red-400">-{employmentTax}</span>
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