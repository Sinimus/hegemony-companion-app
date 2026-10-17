import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import {
  calculateEmploymentTax,
  calculateMiddleClassIncomeTax,
  calculateTaxMultiplier,
  getIncomeTaxRate,
} from '@/logic/economics';
import { isIncomeTaxRateVerified } from '@/logic/taxData';
import { formatDeduction } from '@/lib/format';

export function MiddleBalance() {
  const { policies } = useGameStore();
  const [otherCompanies, setOtherCompanies] = useState(0);
  const [ownCompanies, setOwnCompanies] = useState(2);
  const [wagesReceived, setWagesReceived] = useState(0);
  const [wagesPaid, setWagesPaid] = useState(0);

  // Income Tax: table rate x other players' Companies where MC Workers work (p. 25)
  const rate = getIncomeTaxRate(policies.labor, policies.tax);
  const incomeTax = calculateMiddleClassIncomeTax(otherCompanies, policies.labor, policies.tax);

  // Employment Tax: own operational Companies x Tax Multiplier (p. 25)
  const taxMultiplier = calculateTaxMultiplier(policies.tax, policies.health, policies.education);
  const employmentTax = calculateEmploymentTax(ownCompanies, policies.tax, policies.health, policies.education);

  const net = wagesReceived - wagesPaid - incomeTax - employmentTax;

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-class-middle flex items-center gap-2">
        ⚖️ Middle Class Taxes
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="mc-other-companies" className="text-xs uppercase text-neutral-500 font-bold">Other players' Companies with your Workers</label>
          <input
            id="mc-other-companies"
            type="number"
            min="0"
            value={otherCompanies}
            onChange={(e) => setOtherCompanies(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mc-own-companies" className="text-xs uppercase text-neutral-500 font-bold">Your operational Companies</label>
          <input
            id="mc-own-companies"
            type="number"
            min="0"
            value={ownCompanies}
            onChange={(e) => setOwnCompanies(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
          <p className="text-xs text-neutral-500">The Middle Class starts with 2 Companies (p. 8)</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="mc-wages-received" className="text-xs uppercase text-neutral-500 font-bold">Wages received</label>
          <input
            id="mc-wages-received"
            type="number"
            min="0"
            value={wagesReceived}
            onChange={(e) => setWagesReceived(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mc-wages-paid" className="text-xs uppercase text-neutral-500 font-bold">Wages paid to Working Class employees</label>
          <input
            id="mc-wages-paid"
            type="number"
            min="0"
            value={wagesPaid}
            onChange={(e) => setWagesPaid(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
          <p className="text-xs text-neutral-500">Companies with only Middle Class Workers pay no wage (p. 25)</p>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Income Tax ({rate} per Company, P2 {policies.labor} / P3 {policies.tax})</span>
            <span className="text-red-400 font-mono">{formatDeduction(incomeTax)}</span>
          </div>
          {!isIncomeTaxRateVerified(policies.labor, policies.tax) && (
            <p className="text-xs text-amber-400/80">Tax rate from the player aid table; not verified against the rules text.</p>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Employment Tax (TM {taxMultiplier})</span>
            <span className="text-red-400 font-mono">{formatDeduction(employmentTax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Corporate Tax: none for the Middle Class (p. 25)</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
            <span className="text-neutral-200">Net this round</span>
            <span className="text-class-middle">{net}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
