import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateImportCost, BASE_IMPORT_PRICES } from '@/logic/trade';
import { Truck } from 'lucide-react';

export function ImportTariffCalc() {
  const { policies } = useGameStore();
  const [amount, setAmount] = useState(5);
  const [type, setType] = useState<'food' | 'luxury'>('food');

  const { baseCost, tariffCost, totalCost, tariffRate } = calculateImportCost(
    amount,
    type,
    policies.trade
  );

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
        <Truck className="w-5 h-5 text-neutral-500" /> Import Cost Calculator
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Resource Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'food' | 'luxury')}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          >
            <option value="food">Food (Base {BASE_IMPORT_PRICES.food}¥)</option>
            <option value="luxury">Luxury (Base {BASE_IMPORT_PRICES.luxury}¥)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Quantity to Import</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Base Cost (To Supply)</span>
          <span className="text-red-400 font-mono">-{baseCost}¥</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Tariff Cost (To State - P6: {policies.trade})</span>
          <span className="text-red-400 font-mono">-{tariffCost}¥</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">Total Cost to Player</span>
          <span className="text-red-500 font-mono">-{totalCost}¥</span>
        </div>
        <p className="text-xs text-neutral-500 pt-2">
          *Tariff rate based on Policy 6 (Foreign Trade) is {tariffRate}¥/unit.
        </p>
      </div>
    </div>
  );
}