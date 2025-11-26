import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import type { PolicyType, PolicyLevel } from '@/types/game';
import { POLICIES } from '@/data/policies';
import type { PolicyDef } from '@/data/policies';
import { calculateStateLegitimacyVp, calculateStateAgendaVp, dropLegitimacy } from '@/logic/scoring';
import { Users, Briefcase, Home } from 'lucide-react';

// Konstanty pro simulaci Politické agendy
const DEFAULT_AGENDA: Record<PolicyType, PolicyLevel> = {
  fiscal: 'A', labor: 'B', tax: 'A', health: 'B', education: 'C', trade: 'A', immigration: 'B',
};

// Pomocná komponenta pro selektor Policy Level (pro Agenda UI)
const PolicyLevelSelector = ({
  policy,
  currentLevel,
  onChange
}: {
  policy: PolicyDef;
  currentLevel: PolicyLevel;
  onChange: (level: PolicyLevel) => void;
}) => {
  return (
    <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/50 last:border-b-0">
      <span className="text-neutral-400 w-1/2">{policy.name}</span>
      <div className="flex space-x-1">
        {(['A', 'B', 'C'] as PolicyLevel[]).map((level: PolicyLevel) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`w-5 h-5 rounded-sm font-bold transition-all ${
              currentLevel === level
                ? 'bg-indigo-400 text-white'
                : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export function StateScoringCalc() {
  const { policies } = useGameStore();

  // Stav pro simulaci aktuálních hodnot Legitimacy
  const [wcLeg, setWcLeg] = useState(2);
  const [mcLeg, setMcLeg] = useState(2);
  const [ccLeg, setCcLeg] = useState(2);
  // Stav pro simulaci Politické Agendy
  const [agenda, setAgenda] = useState(DEFAULT_AGENDA);

  // VP Kalkulace
  const legitimacyVp = calculateStateLegitimacyVp(wcLeg, mcLeg, ccLeg);
  const agendaVp = calculateStateAgendaVp(policies, agenda);
  const totalVp = legitimacyVp + agendaVp;

  // Simulace snížení Legitimacy pro příští kolo
  const nextWcLeg = dropLegitimacy(wcLeg);
  const nextMcLeg = dropLegitimacy(mcLeg);
  const nextCcLeg = dropLegitimacy(ccLeg);

  // Funkce pro aktualizaci agendy
  const setAgendaPolicy = (type: PolicyType, level: PolicyLevel) => {
    setAgenda(prev => ({ ...prev, [type]: level }));
  };

  return (
    <div className="space-y-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800">
      <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
        👑 VP Scoring Phase
      </h3>

      {/* Část 1: Legitimacy Scoring */}
      <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
        <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">1. Legitimacy Check & Drop</h4>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center">
            <Users className="w-5 h-5 text-green-400 mb-1" />
            <input
              type="number"
              min="0"
              max="10"
              value={wcLeg}
              onChange={(e) => setWcLeg(Number(e.target.value))}
              className="w-10 bg-neutral-900 border border-neutral-700 rounded p-1 text-center text-sm"
            />
          </div>
          <div className="flex flex-col items-center">
            <Home className="w-5 h-5 text-purple-400 mb-1" />
            <input
              type="number"
              min="0"
              max="10"
              value={mcLeg}
              onChange={(e) => setMcLeg(Number(e.target.value))}
              className="w-10 bg-neutral-900 border border-neutral-700 rounded p-1 text-center text-sm"
            />
          </div>
          <div className="flex flex-col items-center">
            <Briefcase className="w-5 h-5 text-amber-400 mb-1" />
            <input
              type="number"
              min="0"
              max="10"
              value={ccLeg}
              onChange={(e) => setCcLeg(Number(e.target.value))}
              className="w-10 bg-neutral-900 border border-neutral-700 rounded p-1 text-center text-sm"
            />
          </div>
        </div>

        <div className="flex justify-between text-base font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">VP Gained (Sum of 2 lowest)</span>
          <span className="text-yellow-400">+{legitimacyVp}</span>
        </div>
        <div className="text-xs text-neutral-500 pt-2">
          Next Round Start: WC: {nextWcLeg}, MC: {nextMcLeg}, CC: {nextCcLeg} (Half, Rounded Up)
        </div>
      </div>

      {/* Část 2: Political Agenda Scoring */}
      <div className="p-3 bg-neutral-950/50 rounded border border-neutral-800">
        <h4 className="text-xs font-bold text-neutral-500 uppercase mb-2">2. Political Agenda Match ({agendaVp} / 7 VP)</h4>

        {/* Simulátor Policy Agendy (všechny politiky) */}
        <div className="mb-2">
          {POLICIES.map(p => (
            <PolicyLevelSelector
              key={p.id}
              policy={p}
              currentLevel={agenda[p.id]}
              onChange={(level) => setAgendaPolicy(p.id, level)}
            />
          ))}
          <p className="text-xs italic text-neutral-500 mt-2">
            Actual Policies: {POLICIES.map(p => `${p.name} ${policies[p.id]}`).join(', ')} (from Global Policy Board)
          </p>
        </div>

        <div className="flex justify-between text-base font-bold pt-2 border-t border-neutral-800">
          <span className="text-neutral-200">VP Gained ({agendaVp} Matches)</span>
          <span className="text-yellow-400">+{agendaVp}</span>
        </div>
      </div>

      {/* Celkový součet VP */}
      <div className="flex justify-between text-xl font-black pt-2 border-t border-neutral-800">
        <span className="text-neutral-200">Total VP from Scoring Phase</span>
        <span className="text-indigo-400">+{totalVp}</span>
      </div>
    </div>
  );
}