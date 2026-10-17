import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RuleList } from '@/components/domain/RuleList';
import { AUTOMA_CLASS_RULES, AUTOMA_GENERAL, AUTOMA_MODULE_RULES } from '@/data/rules/automaSimple';
import { automaPricePositions, type PricedResource } from '@/logic/automa';
import { filterItems } from '@/logic/ruleFilter';
import type { AutomaClass } from '@/logic/setup';
import { useGameStore } from '@/stores/useGameStore';

const PRICED_LABELS: Record<PricedResource, string> = {
  food: 'Food',
  luxury: 'Luxury',
  health: 'Health',
  education: 'Education',
};

const PRICED_ORDER: readonly PricedResource[] = ['food', 'luxury', 'health', 'education'];

// The rules around an Automa's AI and Instruction cards (r150), filtered for the
// game's configuration. Shown above a class's calculators: people still do its
// bookkeeping.
export function AutomaReference({ automaClass }: { automaClass: AutomaClass }) {
  const { setup, policies } = useGameStore();
  const prices = automaPricePositions(policies);
  // C&C p. 11 for the Capitalist Automa, p. 12 for the Middle Automa.
  const priceSource = automaClass === 'capitalist' ? 'C&C p. 11' : 'C&C p. 12';

  return (
    <Card>
      <CardHeader className="border-b border-neutral-800">
        <CardTitle className="text-lg">Automa (Simple Mode)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-neutral-400">The AI and Instruction cards decide; this lists the rules around them.</p>
        <RuleList items={filterItems(AUTOMA_CLASS_RULES[automaClass], setup)} />
        {(automaClass === 'middle' || automaClass === 'capitalist') && (
          <p className="text-sm text-neutral-300">
            Prices now:{' '}
            {PRICED_ORDER.map((resource) => `${PRICED_LABELS[resource]}: ${prices[resource]}`).join(', ')}{' '}
            <span className="text-xs text-neutral-500">({priceSource})</span>
          </p>
        )}
        <details className="rounded border border-neutral-800">
          <summary className="cursor-pointer text-sm font-bold text-neutral-300 p-2 select-none">General Automa rules</summary>
          <div className="p-2 border-t border-neutral-800 space-y-4">
            <RuleList items={filterItems(AUTOMA_GENERAL, setup)} />
            {setup.modules.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-200">With mini expansions</h4>
                <RuleList items={filterItems(AUTOMA_MODULE_RULES, setup)} />
              </div>
            )}
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
