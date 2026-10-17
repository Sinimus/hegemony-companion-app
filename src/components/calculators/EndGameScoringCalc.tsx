import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateEndGameVp, settleEndGameLoans } from '@/logic/scoring';
import { getActiveClasses } from '@/logic/players';
import { END_GAME_MONEY, END_GAME_POLICY_SECTION, END_GAME_RESOURCES, RESOURCE_PIECES_PER_VP } from '@/logic/scoringData';
import type { EndGameResource } from '@/logic/scoringData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Coins, AlertTriangle } from 'lucide-react';
import type { PlayerClass } from '@/types/game';

const RESOURCE_LABELS: Record<EndGameResource, string> = {
    food: 'Food',
    luxury: 'Luxury',
    health: 'Health',
    education: 'Education',
    media: 'Media',
};

// Starting money from the setup rules, for a realistic simulation.
const START_MONEY: Record<PlayerClass, number> = {
    working: 30,
    middle: 40,
    capitalist: 120,
    state: 120,
};

// Helper component for class-specific inputs
const ClassInputGroup = ({ playerClass }: { playerClass: PlayerClass }) => {
    const { policies } = useGameStore();

    const [money, setMoney] = useState(START_MONEY[playerClass]);
    const [loans, setLoans] = useState(0);
    const [resources, setResources] = useState<Record<EndGameResource, number>>({
        food: 0, luxury: 0, health: 0, education: 0, media: 0,
    });

    const classResources = END_GAME_RESOURCES[playerClass];
    const section = END_GAME_POLICY_SECTION[playerClass];
    const moneyRule = END_GAME_MONEY[playerClass];

    const settlement = settleEndGameLoans(playerClass, loans, money);
    const results = calculateEndGameVp({ playerClass, policies, loans, money, resources });

    const getPenaltyColor = (penalty: number) => penalty < 0 ? 'text-red-500' : 'text-green-500';

    return (
        <Card className="p-4 space-y-3 border-neutral-700/50">
            <h4 className={`text-lg font-bold uppercase text-class-${playerClass}`}>
                {playerClass} Class
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    <label htmlFor={`endgame-${playerClass}-money`} className="text-xs uppercase text-neutral-500 font-bold flex items-center">
                        <Coins className="w-3 h-3 mr-1" /> Money (¥)
                    </label>
                    <input id={`endgame-${playerClass}-money`} type="number" value={money} onChange={e => setMoney(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white" />
                </div>
                <div className="space-y-2">
                    <label htmlFor={`endgame-${playerClass}-loans`} className="text-xs uppercase text-neutral-500 font-bold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1 text-red-400" /> Loans
                    </label>
                    <input id={`endgame-${playerClass}-loans`} type="number" min="0" value={loans} onChange={e => setLoans(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white" />
                </div>
                {classResources.map((resource) => (
                    <div key={resource} className="space-y-2">
                        <label htmlFor={`endgame-${playerClass}-${resource}`} className="text-xs uppercase text-neutral-500 font-bold">
                            {RESOURCE_LABELS[resource]}
                        </label>
                        <input
                            id={`endgame-${playerClass}-${resource}`}
                            type="number"
                            min="0"
                            value={resources[resource]}
                            onChange={e => setResources({ ...resources, [resource]: Number(e.target.value) })}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white"
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-1 pt-4 border-t border-neutral-800">
                {section !== null ? (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Policies in section {section} (P1-P5)</span>
                        <span className="text-yellow-400 font-mono">+{results.policyVp} VP</span>
                    </div>
                ) : (
                    <div className="text-sm text-neutral-400">No policy table for the State (p. 29-30)</div>
                )}
                {moneyRule !== null && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">
                            Money (1 VP per {moneyRule.per}{moneyRule.maxVp !== Infinity ? `, max ${moneyRule.maxVp}` : ''})
                        </span>
                        <span className="text-yellow-400 font-mono">+{results.moneyVp} VP</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Resources in Storages</span>
                    <span className="text-yellow-400 font-mono">+{results.resourceVp} VP</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Loans</span>
                    <span className={getPenaltyColor(results.loanPenalty)}>{results.loanPenalty} VP</span>
                </div>
                {playerClass !== 'capitalist' && (
                    <div className="text-xs text-neutral-500">paid {settlement.paid}, unpaid {settlement.unpaid}</div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
                    <span className="text-neutral-200">Total</span>
                    <span className="text-white">{results.totalVp}</span>
                </div>
                {section !== null && (
                    <p className="text-xs text-amber-400/80">Policy table values are unverified (image in the rulebook).</p>
                )}
                {classResources.length > 0 && (
                    <p className="text-xs text-amber-400/80">
                        Resource order assumed: {classResources.map(resource => `${RESOURCE_LABELS[resource]} ${RESOURCE_PIECES_PER_VP[resource]}`).join(', ')} per VP (icons missing in the rules text).
                    </p>
                )}
            </div>
        </Card>
    );
}

export function EndGameScoringCalc() {
    const { playerCount } = useGameStore();

    return (
        <div className="space-y-6">
            <Card className="bg-neutral-900/50 border-blue-400/50">
                <CardHeader className="border-b border-blue-400/30">
                    <CardTitle className="flex items-center gap-2 text-xl text-blue-400">
                        <Trophy className="w-6 h-6" />
                        End-Game Scoring Simulator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-neutral-400">
                        The game ends after the <span className="font-bold text-white">Scoring Phase of Round 5</span>. Use this tool to simulate final VP gains and potential penalties based on policy alignment and remaining resources/loans.
                    </p>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {getActiveClasses(playerCount).map((playerClass) => (
                            <ClassInputGroup key={playerClass} playerClass={playerClass} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
