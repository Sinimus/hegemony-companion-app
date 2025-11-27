import { EndGameScoringCalc } from '@/components/calculators/EndGameScoringCalc';

export function EndGameView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">End Game Scoring</h2>
        <p className="text-neutral-400">Final Victory Point Calculator</p>
      </header>

      <div className="bg-neutral-900/50 border border-yellow-400/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-3">🏁 Game End Rules</h3>
        <p className="text-sm text-neutral-300 mb-4">
          The game ends after the <span className="font-bold text-white">Scoring Phase of Round 5</span>.
          Use the calculator below to determine final Victory Points based on:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc list-inside">
          <li>Policy alignment with your class ideology</li>
          <li>Remaining money and resources</li>
          <li>Outstanding loans and penalties</li>
        </ul>
      </div>

      <EndGameScoringCalc />
    </div>
  );
}