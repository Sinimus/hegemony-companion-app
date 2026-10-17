import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RuleList } from '@/components/domain/RuleList';
import { StateScoringCalc } from '@/components/calculators/StateScoringCalc';
import { FactionReference } from '@/components/domain/FactionReference';
import { WelfareBenefitCalc } from '@/components/calculators/MicroUtilityCalc';
import { IMFRiskCalc } from '@/components/calculators/IMFRiskCalc';
import { ROUND_SECTIONS } from '@/data/rules/roundFlow';
import { POLICY_CHANGES } from '@/data/rules/policyChanges';
import type { RuleItem } from '@/data/rules/types';
import { stateHasPlayer } from '@/logic/setup';
import { useGameStore } from '@/stores/useGameStore';

// The State rules that still apply when nobody plays it, picked by id from the
// rule data: the round flow steps and the fiscal and labor consequences.
const STATE_WITHOUT_PLAYER_IDS: readonly string[] = [
  'prep-state-loan',
  'prod-state-ai',
  'prod-public-limit',
  'p1-no-state-grow',
  'p1-no-state-shrink',
  'p2-public',
];

const STATE_WITHOUT_PLAYER_ITEMS: readonly RuleItem[] = [
  ...ROUND_SECTIONS.flatMap((section) => section.items),
  ...POLICY_CHANGES.fiscal,
  ...POLICY_CHANGES.labor,
].filter((item) => STATE_WITHOUT_PLAYER_IDS.includes(item.id));

export function StateView() {
  const { setup } = useGameStore();

  // With 2 or 3 classes the State has no player: no calculators, just the rules
  // that still apply to it.
  if (!stateHasPlayer(setup)) {
    return (
      <div className="space-y-6 animate-enter">
        <header>
          <h2 className="text-3xl font-black text-class-state mb-1">The State</h2>
          <p className="text-neutral-400">Legitimacy & Fiscal Responsibility</p>
        </header>
        <Card>
          <CardHeader className="border-b border-neutral-800">
            <CardTitle className="text-lg">State without a player</CardTitle>
          </CardHeader>
          <CardContent>
            <RuleList items={STATE_WITHOUT_PLAYER_ITEMS} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-enter">
      <header>
        <h2 className="text-3xl font-black text-class-state mb-1">The State</h2>
        <p className="text-neutral-400">Legitimacy & Fiscal Responsibility</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <StateScoringCalc />
        <WelfareBenefitCalc />
        <IMFRiskCalc />
      </div>
      <FactionReference playerClass="state" />
    </div>
  );
}
