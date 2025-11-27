import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateEndGameVp } from '@/logic/scoring';
import { END_GAME_VP_CONVERSION } from '@/logic/scoringData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Coins, AlertTriangle } from 'lucide-react';
import type { PlayerClass } from '@/types/game';

// Simplified resource prices for input (based on average market values)
const RESOURCE_PRICES = {
    Food: 4,
    Luxury: 6,
    Health: 5,
    Education: 5,
    Media: 10, // Assuming media/influence has a general value
};

// Helper component for class-specific inputs
const ClassInputGroup = ({ playerClass }: { playerClass: PlayerClass }) => {
    const { policies } = useGameStore();

    // Initial money value based on setup rules for realistic simulation
    let initialMoney = 0;
    switch (playerClass) {
        case 'capitalist': initialMoney = 120; break;
        case 'middle': initialMoney = 40; break;
        case 'working': initialMoney = 30; break;
        case 'state': initialMoney = 120; break;
    }

    const [money, setMoney] = useState(initialMoney);
    const [loans, setLoans] = useState(0);
    const [resources] = useState<Record<string, number>>({
        Food: 0, Luxury: 0, Health: 0, Education: 0, Media: 0, Influence: 0
    });

    // Convert units to estimated money value for scoring purposes
    const calculateResourceValues = () => {
        let totalValue: Record<string, number> = {};
        for (const key in resources) {
            totalValue[key] = resources[key] * (RESOURCE_PRICES[key as keyof typeof RESOURCE_PRICES] || 1);
        }
        return totalValue;
    }

    const results = calculateEndGameVp(
        playerClass,
        policies,
        loans,
        money,
        calculateResourceValues() // Pass the calculated value based on units
    );

    const getPenaltyColor = (penalty: number) => penalty < 0 ? 'text-red-500' : 'text-green-500';

    // Determine alignment target label
    const alignmentTarget = playerClass === 'working' ? 'A' : playerClass === 'middle' ? 'B' : playerClass === 'capitalist' ? 'C' : 'B';

    return (
        <Card className="p-4 space-y-3 border-neutral-700/50">
            <h4 className={`text-lg font-bold uppercase text-class-${playerClass}`}>
                {playerClass} Class
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    <label className="text-xs uppercase text-neutral-500 font-bold flex items-center">
                        <Coins className="w-3 h-3 mr-1" /> Money (¥)
                    </label>
                    <input type="number" value={money} onChange={e => setMoney(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase text-neutral-500 font-bold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1 text-red-400" /> Loans
                    </label>
                    <input type="number" min="0" value={loans} onChange={e => setLoans(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white" />
                </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-neutral-800">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Policy Alignment VP (Target {alignmentTarget})</span>
                    <span className="text-yellow-400 font-mono">+{results.policyVp} VP</span>
                </div>
                {playerClass !== 'capitalist' && (
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Money Conversion (1 VP / {END_GAME_VP_CONVERSION[playerClass].moneyRate}¥)</span>
                        <span className="text-yellow-400 font-mono">+{results.moneyVp} VP</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Resource Conversion (Est. 1 VP / 15¥)</span>
                    <span className="text-yellow-400 font-mono">+{results.resourceVp} VP</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Loan Penalty ({playerClass === 'capitalist' ? '-5' : '-11'} VP/Loan)</span>
                    <span className={getPenaltyColor(results.loanPenalty)}>{results.loanPenalty} VP</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
                    <span className="text-neutral-200">Final End-Game VP</span>
                    <span className="text-white">{results.totalVp}</span>
                </div>
            </div>
        </Card>
    );
}

export function EndGameScoringCalc() {
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
                        <ClassInputGroup playerClass="working" />
                        <ClassInputGroup playerClass="middle" />
                        <ClassInputGroup playerClass="capitalist" />
                        <ClassInputGroup playerClass="state" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}