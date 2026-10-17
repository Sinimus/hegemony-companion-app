import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RuleList } from '@/components/domain/RuleList';
import { ROUND_SECTIONS } from '@/data/rules/roundFlow';
import { filterSections } from '@/logic/ruleFilter';
import { useGameStore } from '@/stores/useGameStore';

// A static reference by phase for the current configuration: no "current phase",
// no "next step" (r156). Items from the mini expansions carry a C&C / HE tag.
export function RoundView() {
  const { setup } = useGameStore();
  const sections = filterSections(ROUND_SECTIONS, setup);

  return (
    <div className="space-y-6 animate-enter">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Round Flow</h2>
        <p className="text-neutral-400">
          Reference by phase for this configuration. Items from expansions are marked.
        </p>
      </header>

      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="border-b border-neutral-800">
            <CardTitle className="text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <RuleList items={section.items} expansionTag />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
