import type { PolicyDef } from '@/data/policies';
import type { PolicyLevel } from '@/types/game';
import { cn } from '@/lib/utils';

interface PolicyRowProps {
  policy: PolicyDef;
  currentLevel: PolicyLevel;
  onChange: (level: PolicyLevel) => void;
}

export function PolicyRow({ policy, currentLevel, onChange }: PolicyRowProps) {
  const levels: PolicyLevel[] = ['A', 'B', 'C'];

  const getLevelColor = (level: PolicyLevel) => {
    if (level === 'A') return 'bg-red-500/20 border-red-500 text-red-200';
    if (level === 'B') return 'bg-yellow-500/20 border-yellow-500 text-yellow-200';
    return 'bg-blue-500/20 border-blue-500 text-blue-200';
  };

  return (
    <div className="flex flex-col space-y-2 p-4 border border-neutral-800 rounded-lg bg-neutral-900/50">
      <div className="flex justify-between items-baseline">
        <h3 className="font-bold text-neutral-200">{policy.name}</h3>
        <span className="text-xs text-neutral-500">{policy.description}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={cn(
              'p-2 text-sm border rounded transition-all duration-200',
              currentLevel === level
                ? getLevelColor(level) + ' ring-1 ring-inset'
                : 'border-neutral-800 bg-neutral-900 text-neutral-500 hover:border-neutral-700'
            )}
          >
            <div className="font-bold mb-1">{level}</div>
            <div className="text-xs opacity-90">{policy.levels[level].label}</div>
          </button>
        ))}
      </div>

      <div className="text-xs text-neutral-400 mt-2 pl-1 italic">
        Current effect: {policy.levels[currentLevel].effect}
      </div>
    </div>
  );
}