import { useState } from 'react';
import { EXPORT_PRICES, calculateExportRevenue } from '@/logic/trade';
import { BarChart2 } from 'lucide-react';

export function TradeCalc() {
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState<keyof typeof EXPORT_PRICES>('food');

  const revenue = calculateExportRevenue(amount, type);

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-green-400" /> Export Revenue
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Resource Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          >
            <option value="food">Food ({EXPORT_PRICES.food}¥/unit)</option>
            <option value="luxury">Luxury ({EXPORT_PRICES.luxury}¥/unit)</option>
            <option value="health">Health ({EXPORT_PRICES.health}¥/unit)</option>
            <option value="education">Education ({EXPORT_PRICES.education}¥/unit)</option>
            <option value="media">Media ({EXPORT_PRICES.media}¥/unit)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Quantity</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>
      </div>

      <div className="flex justify-between text-lg font-bold pt-4 border-t border-neutral-800">
        <span className="text-neutral-200">Export Revenue</span>
        <span className="text-yellow-400">+{revenue}</span>
      </div>
    </div>
  );
}