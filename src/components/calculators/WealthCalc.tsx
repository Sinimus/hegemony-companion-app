import { useState } from 'react';
import { calculateWealthScoring } from '@/logic/scoring';

export function WealthCalc() {
  const [capital, setCapital] = useState(0); // Capital after taxes, scored each round
  const [markerSpace, setMarkerSpace] = useState(0); // Furthest space reached so far

  const { space, baseVp, bonusVp, totalVp, newMarkerSpace } = calculateWealthScoring(
    capital,
    markerSpace
  );

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
        🏦 Wealth Track
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="wealth-capital" className="text-xs uppercase text-neutral-500 font-bold">Capital after taxes (¥)</label>
          <input
            id="wealth-capital"
            type="number"
            min="0"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="wealth-marker" className="text-xs uppercase text-neutral-500 font-bold">Wealth marker space</label>
          <input
            id="wealth-marker"
            type="number"
            min="0"
            value={markerSpace}
            onChange={(e) => setMarkerSpace(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
          <p className="text-xs text-neutral-500">The furthest space reached so far; 0 at the start (p. 21).</p>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Table VP (space {space})</span>
          <span className="text-yellow-400 font-mono">+{baseVp}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Marker bonus (3 VP per space moved)</span>
          <span className="text-green-400 font-mono">+{bonusVp}</span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">Total this round</span>
          <span className="text-amber-400">{totalVp}</span>
        </div>

        <div className="text-sm text-neutral-400">
          Marker moves to space <span className="text-white font-mono">{newMarkerSpace}</span>
        </div>

        <p className="text-xs text-amber-400/80">
          Band limits are an approximation of the board table; the rulebook example values are reproduced (p. 21).
        </p>
      </div>
    </div>
  );
}
