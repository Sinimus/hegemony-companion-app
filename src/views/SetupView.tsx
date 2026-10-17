import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RuleSections } from '@/components/domain/RuleList';
import { useGameStore } from '@/stores/useGameStore';
import { PLAYER_COUNTS, getActiveClasses } from '@/logic/players';
import { MODULES, isAutoma, toggleAutoma, toggleModule, type AutomaClass } from '@/logic/setup';
import { SETUP_SECTIONS } from '@/data/rules/setupSteps';
import { filterSections } from '@/logic/ruleFilter';
import { cn } from '@/lib/utils';
import type { PlayerClass } from '@/types/game';

// Static class-name lookup: Tailwind never generates classes built from variables
const CLASS_LABEL: Record<PlayerClass, string> = {
  working: 'Working Class',
  middle: 'Middle Class',
  capitalist: 'Capitalist Class',
  state: 'State',
};

const CLASS_TEXT: Record<PlayerClass, string> = {
  working: 'text-class-working',
  middle: 'text-class-middle',
  capitalist: 'text-class-capitalist',
  state: 'text-class-state',
};

const EXPANSION_NAMES: readonly ('Crisis & Control' | 'Historical Events')[] = ['Crisis & Control', 'Historical Events'];

// The State row of the configuration: a person plays it or nobody does.
function StatePlayerRow() {
  return (
    <div className="py-2 border-b border-neutral-800/50 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-semibold text-class-state">{CLASS_LABEL.state}</span>
        <span className="px-3 py-1 text-xs font-bold text-neutral-400">Player</span>
      </div>
      <p className="text-xs text-neutral-500 mt-1">The State has no Automa (C&C p. 3).</p>
    </div>
  );
}

// Whether a person or the Automa (Simple Mode) plays one of the other classes.
function ClassPlayerRow({ automaClass }: { automaClass: AutomaClass }) {
  const { setup, setSetup } = useGameStore();
  const automaOn = isAutoma(automaClass, setup);
  // Normalization keeps at most classCount - 1 Automas, so one class stays human;
  // the toggle is refused before it could silently drop another Automa.
  const automaBlocked = !automaOn && setup.automas.length >= setup.classCount - 1;

  return (
    <div className="py-2 border-b border-neutral-800/50 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className={cn('text-sm font-semibold', CLASS_TEXT[automaClass])}>{CLASS_LABEL[automaClass]}</span>
        <div
          role="group"
          aria-label={`${CLASS_LABEL[automaClass]}: person or Automa`}
          className="inline-flex rounded border border-neutral-700 overflow-hidden"
        >
          <button
            type="button"
            aria-pressed={!automaOn}
            onClick={() => {
              // Only a way back from the Automa; it never turns one on.
              if (automaOn) setSetup(toggleAutoma(setup, automaClass));
            }}
            className={cn(
              'px-3 py-1 text-xs font-bold transition-colors',
              !automaOn ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-800'
            )}
          >
            Player
          </button>
          <button
            type="button"
            aria-pressed={automaOn}
            disabled={automaBlocked}
            onClick={() => setSetup(toggleAutoma(setup, automaClass))}
            className={cn(
              'px-3 py-1 text-xs font-bold transition-colors border-l border-neutral-700',
              automaOn ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-800',
              automaBlocked && 'opacity-50 cursor-not-allowed'
            )}
          >
            Automa (Simple)
          </button>
        </div>
      </div>
      {automaBlocked && (
        <p className="text-xs text-neutral-500 mt-1">
          At most {setup.classCount - 1} Automa{setup.classCount - 1 > 1 ? 's' : ''} in this game, so one class stays human.
        </p>
      )}
    </div>
  );
}

export function SetupView() {
  const { setup, playerCount, setPlayerCount, setSetup } = useGameStore();
  const classesInPlay = getActiveClasses(playerCount);

  return (
    <div className="space-y-6 animate-enter">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Game Setup</h2>
        <p className="text-neutral-400">The game configuration and the setup steps for it.</p>
      </header>

      <Card>
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-lg">Game configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs uppercase text-neutral-500 font-bold" aria-hidden="true">Classes</span>
            <div role="group" aria-label="Number of classes" className="flex items-center gap-2">
              {PLAYER_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPlayerCount(count)}
                  aria-pressed={playerCount === count}
                  aria-label={`${count} classes`}
                  className={cn(
                    'w-8 h-8 rounded text-sm font-bold',
                    playerCount === count ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:bg-neutral-800'
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {classesInPlay.map((playerClass) =>
              playerClass === 'state' ? (
                <StatePlayerRow key="state" />
              ) : (
                <ClassPlayerRow key={playerClass} automaClass={playerClass} />
              )
            )}
          </div>

          <div className="space-y-4">
            {EXPANSION_NAMES.map((expansion) => (
              <div key={expansion} className="space-y-2">
                <h4 className="text-xs uppercase text-neutral-500 font-bold">{expansion}</h4>
                {MODULES.filter((module) => module.expansion === expansion).map((module) => {
                  // Alternative Events replace the State's Event cards (C&C p. 15).
                  const fourClassesOnly = module.id === 'alternativeEvents' && playerCount !== 4;
                  return (
                    <div key={module.id}>
                      <label htmlFor={`module-${module.id}`} className="flex items-center gap-2 cursor-pointer">
                        <input
                          id={`module-${module.id}`}
                          type="checkbox"
                          checked={setup.modules.includes(module.id)}
                          disabled={fourClassesOnly}
                          onChange={() => setSetup(toggleModule(setup, module.id))}
                          className="w-4 h-4 accent-blue-400"
                        />
                        <span className="text-sm">{module.label}</span>
                      </label>
                      {fourClassesOnly && (
                        <p className="text-xs text-neutral-500 ml-6">4 classes only (C&C p. 15)</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <p className="text-xs text-neutral-500 border-t border-neutral-800 pt-3">
            Saved in the page address only; share the link to use the same configuration on another phone.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-lg">Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <RuleSections sections={filterSections(SETUP_SECTIONS, setup)} checkable />
        </CardContent>
      </Card>
    </div>
  );
}
