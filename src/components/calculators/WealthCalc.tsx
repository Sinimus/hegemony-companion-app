import { useState } from 'react';
import { calculateCapitalistVp } from '@/logic/scoring';
import { WEALTH_TRACK } from '@/logic/scoringData';

export function WealthCalc() {
  const [currentCapital, setCurrentCapital] = useState(120); // CC start with 120¥ Revenue
  const [previousCapital, setPreviousCapital] = useState(0); // Assuming start of Round 1/Game Start

  const { baseVp, bonusVp, totalVp, currentLevel } = calculateCapitalistVp(
    currentCapital,
    previousCapital
  );

  const currentBracket = WEALTH_TRACK[currentLevel];
  const currentMax = currentBracket?.maxCapital || Infinity;
  const progressPercent = currentLevel === WEALTH_TRACK.length - 1 ? 100 : (currentCapital / currentMax) * 100;

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
        🏦 Wealth Track Simulator
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Current Capital (¥)</label>
          <input
            type="number"
            min="0"
            value={currentCapital}
            onChange={(e) => setCurrentCapital(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Prev. Capital (for VP bonus)</label>
          <input
            type="number"
            min="0"
            value={previousCapital}
            onChange={(e) => setPreviousCapital(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Base VP (Level {currentLevel})</span>
          <span className="text-yellow-400 font-mono">+{baseVp}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Bonus VP (+3/step moved)</span>
          <span className="text-green-400 font-mono">+{bonusVp}</span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">Total VP this round</span>
          <span className="text-amber-400">{totalVp}</span>
        </div>

        {/* Progress bar to next level */}
        {currentLevel < WEALTH_TRACK.length - 1 && (
            <div className="mt-4 pt-2">
                <div className="text-xs text-neutral-500 mb-1">Progress to next level (Min {currentMax + 1}¥)</div>
                <div className="w-full bg-neutral-700 rounded-full h-2.5">
                    <div
                        className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        )}
      </div>
    </div>
  );
}