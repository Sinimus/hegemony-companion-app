import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateNetWage, INCOME_TAX_RATES } from '@/logic/taxes';
import { getMinimumWage } from '@/logic/economics';

export function WorkerBudget() {
  const { policies } = useGameStore();
  const [workers, setWorkers] = useState(3);

  const wage = getMinimumWage(policies.labor);
  const { gross, tax, net } = calculateNetWage(workers, wage, policies.tax);

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-class-working flex items-center gap-2">
        ☭ Family Budget
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Employed Workers</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setWorkers(n)}
                className={`w-10 h-10 rounded font-bold transition-all ${workers === n ? 'bg-class-working text-white' : 'bg-neutral-800 text-neutral-400'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Gross Income ({wage}/worker)</span>
            <span className="text-green-400 font-mono">+{gross}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Income Tax ({(INCOME_TAX_RATES[policies.tax] * 100).toFixed(0)}%)</span>
            <span className="text-red-400 font-mono">-{tax}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
            <span className="text-neutral-200">Net Income</span>
            <span className="text-white">{net}</span>
          </div>
        </div>
      </div>
    </div>
  );
}