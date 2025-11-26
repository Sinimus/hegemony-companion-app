import { useState } from 'react';
import { calculateWorkingClassProsperityVp } from '@/logic/scoring';
import { PROSPERITY_LEVELS, getVpForNewProsperity } from '@/logic/scoringData';
import type { ProsperityAction } from '@/logic/scoring';

const PROSPERITY_ACTIONS: { id: ProsperityAction; label: string; effect: string }[] = [
  { id: 'healthcare', label: 'Use Healthcare', effect: '+1 Pros. +2 Bonus VP' },
  { id: 'education', label: 'Use Education', effect: '+1 Pros. + Upgrade Worker' },
  { id: 'luxury', label: 'Use Luxury', effect: '+1 Pros.' },
];

export function WorkingProsperityCalc() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [action, setAction] = useState<ProsperityAction>('healthcare');

  const { gainedVp, newLevel, bonusVp } = calculateWorkingClassProsperityVp(currentLevel, action);

  const isMax = currentLevel >= PROSPERITY_LEVELS.length - 1;

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
        📈 Prosperity Score
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Current Prosperity Level</label>
          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
          >
            {PROSPERITY_LEVELS.map((level: number) => (
              <option key={level} value={level}>Level {level}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-neutral-500 font-bold">Action to Perform</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as ProsperityAction)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
            disabled={isMax}
          >
            {PROSPERITY_ACTIONS.map(a => (
              <option key={a.id} value={a.id} title={a.effect}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Base VP (New Level {isMax ? currentLevel : newLevel})</span>
          <span className="text-yellow-400 font-mono">+{getVpForNewProsperity(isMax ? currentLevel : newLevel)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Bonus VP (Healthcare)</span>
          <span className="text-green-400 font-mono">+{isMax ? 0 : bonusVp}</span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">Total VP Gained</span>
          <span className="text-green-400">{gainedVp}</span>
        </div>

        {isMax && (
            <p className="text-xs text-red-500 text-center pt-2">
                Maximum Prosperity reached (Level 10). VP gained = {getVpForNewProsperity(currentLevel)} (base VP rule still applies).
            </p>
        )}
      </div>
    </div>
  );
}