import { useGameStore } from '@/stores/useGameStore';
import { POLICIES } from '@/data/policies';
import { PolicyRow } from './PolicyRow';

export function PolicyBoard() {
  const { policies, setPolicy } = useGameStore();

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-center text-neutral-100 mb-6 uppercase tracking-widest border-b border-neutral-800 pb-4">
        State Policies
      </h2>
      {POLICIES.map((policy) => (
        <PolicyRow
          key={policy.id}
          policy={policy}
          currentLevel={policies[policy.id]}
          onChange={(level) => setPolicy(policy.id, level)}
        />
      ))}
    </div>
  );
}