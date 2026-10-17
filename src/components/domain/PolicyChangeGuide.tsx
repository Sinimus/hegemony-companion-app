import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RuleList, RuleSections } from '@/components/domain/RuleList';
import { POLICIES } from '@/data/policies';
import {
  IMF_SECTIONS,
  OFF_ELECTION_SHIFTS,
  POLICY_CHANGES,
  type PolicyShift,
} from '@/data/rules/policyChanges';
import { filterItems, filterSections } from '@/logic/ruleFilter';
import { hasModule } from '@/logic/setup';
import { useGameStore } from '@/stores/useGameStore';
import { cn } from '@/lib/utils';
import type { PolicyType } from '@/types/game';

const SHIFTS: { id: PolicyShift; label: string }[] = [
  { id: 'towardA', label: 'toward A' },
  { id: 'towardC', label: 'toward C' },
];

// What to adjust on the table right after a Policy moves, for the game's
// configuration. A reference only: the Policy board itself is set above.
export function PolicyChangeGuide() {
  const { setup } = useGameStore();
  const [policy, setPolicy] = useState<PolicyType>('fiscal');
  const [shift, setShift] = useState<PolicyShift>('towardA');

  // Items that apply to any direction come always; the rest only for the chosen one.
  const items = filterItems(POLICY_CHANGES[policy], setup).filter(
    (item) => item.shift === undefined || item.shift === shift
  );
  const offElectionItems = filterItems(OFF_ELECTION_SHIFTS, setup);
  const imfSections = filterSections(IMF_SECTIONS, setup);

  return (
    <Card>
      <CardHeader className="border-b border-neutral-800">
        <CardTitle className="text-lg">When a Policy changes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
          <div className="space-y-1">
            <label htmlFor="policy-change-policy" className="block text-xs uppercase text-neutral-500 font-bold">
              Policy
            </label>
            <select
              id="policy-change-policy"
              value={policy}
              onChange={(event) => {
                const next = POLICIES.find((policyDef) => policyDef.id === event.target.value);
                if (next) setPolicy(next.id);
              }}
              className="bg-neutral-950 border border-neutral-700 rounded p-1.5 text-sm text-white"
            >
              {POLICIES.map((policyDef) => (
                <option key={policyDef.id} value={policyDef.id}>
                  {policyDef.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <span className="block text-xs uppercase text-neutral-500 font-bold" aria-hidden="true">
              Direction
            </span>
            <div
              role="group"
              aria-label="Direction of the change"
              className="inline-flex rounded border border-neutral-700 overflow-hidden"
            >
              {SHIFTS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={shift === option.id}
                  onClick={() => setShift(option.id)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold transition-colors',
                    option.id !== 'towardA' && 'border-l border-neutral-700',
                    shift === option.id ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-800'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <RuleList items={items} />
        <p className="text-xs text-neutral-500">Update the Policy board above after the change.</p>

        {hasModule('historicalEvents', setup) && offElectionItems.length > 0 && (
          <div className="space-y-2 border-t border-neutral-800 pt-3">
            <h4 className="text-sm font-bold text-neutral-200">Moves outside the elections</h4>
            <RuleList items={offElectionItems} />
          </div>
        )}

        <div className="space-y-2 border-t border-neutral-800 pt-3">
          <h4 className="text-sm font-bold text-neutral-200">IMF intervention</h4>
          <details className="rounded border border-neutral-800">
            <summary className="cursor-pointer text-sm text-neutral-300 p-2 select-none">IMF intervenes</summary>
            <div className="p-2 border-t border-neutral-800">
              <RuleSections sections={imfSections} />
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
