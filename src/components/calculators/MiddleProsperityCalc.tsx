import { useState } from 'react';
import { calculateMiddleClassProsperityVp, canMiddleClassGainProsperity } from '@/logic/scoring';
import { PROSPERITY_LEVELS, getVpForNewProsperity } from '@/logic/scoringData';
import type { ProsperityAction } from '@/logic/scoring';

const PROSPERITY_ACTIONS: { id: ProsperityAction; label: string; effect: string }[] = [
  { id: 'healthcare', label: 'Use Healthcare', effect: '+1 Pros. +2 Bonus VP' },
  { id: 'education', label: 'Use Education', effect: '+1 Pros. + Upgrade Worker' },
  { id: 'luxury', label: 'Use Luxury', effect: '+1 Pros.' },
];

export function MiddleProsperityCalc() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [action, setAction] = useState<ProsperityAction>('education');
  const [operationalCompanies, setOperationalCompanies] = useState(2); // MC starts with 2

  // A. Simulace akce (Use Action)
  const { gainedVp: actionVp, newLevel } = calculateMiddleClassProsperityVp(currentLevel, action);
  const isMaxAction = currentLevel >= PROSPERITY_LEVELS.length - 1;

  // B. Simulace Scoring Phase Check
  const canGainBonus = canMiddleClassGainProsperity(currentLevel, operationalCompanies);
  const bonusVpScoring = canGainBonus ? getVpForNewProsperity(currentLevel + 1) : 0;

  const currentMax = PROSPERITY_LEVELS.length - 1;

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
        ⚜️ Prosperity Score
      </h3>

      <div className="space-y-4">
        {/* Část 1: Akce v Action Phase */}
        <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">1. Action Phase: Use Action</h4>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-neutral-400">Current Prosperity Level</label>
            <select
              value={currentLevel}
              onChange={(e) => setCurrentLevel(Number(e.target.value))}
              className="w-20 bg-neutral-900 border border-neutral-700 rounded p-1 text-right"
            >
              {PROSPERITY_LEVELS.map((level: number) => (
                <option key={level} value={level}>Lvl {level}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-neutral-400">Action Type</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as ProsperityAction)}
              className="w-32 bg-neutral-900 border border-neutral-700 rounded p-1 text-right"
              disabled={isMaxAction}
            >
              {PROSPERITY_ACTIONS.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-neutral-800">
            <span className="text-neutral-200">VP Gained (New Lvl {isMaxAction ? currentMax : newLevel})</span>
            <span className="text-purple-400">+{actionVp}</span>
          </div>
        </div>

        {/* Část 2: Kontrola v Scoring Phase */}
        <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">2. Scoring Phase: Prosperity Check</h4>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-neutral-400">Fully Operational Companies</label>
            <input
              type="number"
              min="0"
              max="8"
              value={operationalCompanies}
              onChange={(e) => setOperationalCompanies(Number(e.target.value))}
              className="w-16 bg-neutral-900 border border-neutral-700 rounded p-1 text-right"
            />
          </div>
          <div className="text-xs italic text-neutral-500 mb-2">
             VP if current Prosperity ({currentLevel}) &lt; Companies ({operationalCompanies})
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-neutral-800">
            <span className="text-neutral-200">VP Gained (Free Prosperity)</span>
            <span className="text-purple-400">+{bonusVpScoring}</span>
          </div>

          <p className={`text-xs pt-2 ${canGainBonus ? 'text-green-400' : 'text-red-400'}`}>
            {canGainBonus
                ? `Condition MET: Prosperity increases to ${currentLevel + 1}!`
                : (currentLevel >= operationalCompanies ? 'Condition NOT MET: Prosperity >= Companies.' : 'Max Prosperity (Lvl 10) reached.')}
          </p>
        </div>
      </div>
    </div>
  );
}