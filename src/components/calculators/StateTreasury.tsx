import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateStateBalance } from '@/logic/taxes';

export function StateTreasury() {
  const { policies } = useGameStore();
  const [employees, setEmployees] = useState(2);
  const [companies, setCompanies] = useState(4);

  const { expenses, revenue, balance } = calculateStateBalance(employees, companies, policies.fiscal, policies.tax);

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-class-state flex items-center gap-2">
        🏛️ Fiscal Estimator
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Public Employees</label>
          <input type="number" min="0" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Private Companies</label>
          <input type="number" min="0" value={companies} onChange={(e) => setCompanies(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white" />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Est. Tax Revenue</span>
          <span className="text-green-400 font-mono">+{revenue}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Wage Expenses</span>
          <span className="text-red-400 font-mono">-{expenses}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">Fiscal Balance</span>
          <span className={balance >= 0 ? 'text-blue-400' : 'text-red-500'}>{balance}</span>
        </div>
      </div>
    </div>
  );
}