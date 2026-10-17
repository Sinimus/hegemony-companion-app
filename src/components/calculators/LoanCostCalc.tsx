import { useState } from 'react';
import { calculateLoanCosts } from '@/logic/economics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Banknote, AlertTriangle } from 'lucide-react';
import { formatDeduction } from '@/lib/format';

export function LoanCostCalc() {
    const [loanCount, setLoanCount] = useState(1);
    const costs = calculateLoanCosts(loanCount);

    return (
        <Card className="bg-neutral-900/50 border-neutral-700/50">
            <CardHeader className="p-4 border-b-neutral-800">
                <CardTitle className="flex items-center gap-2 text-xl text-red-400">
                    <Banknote className="w-5 h-5" /> Mandatory Loan Planner
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                    <label htmlFor="loan-count" className="text-xs uppercase text-neutral-500 font-bold flex items-center gap-2">
                        Number of Active Loans
                    </label>
                    <input
                        id="loan-count"
                        type="number"
                        min="0"
                        value={loanCount}
                        onChange={(e) => setLoanCount(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white"
                    />
                </div>

                {loanCount > 0 && (
                    <div className="space-y-2 pt-4 border-t border-neutral-800">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Preparation Phase Interest (Mandatory)</span>
                            <span className="text-red-400 font-mono">{formatDeduction(costs.interestCost)} ¥</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Pay off (Free Action, 50 per Loan)</span>
                            <span className="text-red-400 font-mono">{formatDeduction(costs.payoffCost)} ¥</span>
                        </div>

                        <h4 className="text-xs uppercase text-red-500 font-bold pt-4 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> End-Game Penalty Risk
                        </h4>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Capitalist Class at game end (-5 VP per Loan)</span>
                            <span className="text-red-500 font-mono">{formatDeduction(costs.maxCcPenalty)} VP</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Other classes at game end (up to -11 VP per Loan if nothing is paid)</span>
                            <span className="text-red-500 font-mono">{formatDeduction(costs.maxWcMcPenalty)} VP</span>
                        </div>

                        <p className="text-xs text-neutral-500 pt-2 italic">
                            At game end the other classes pay 55 per Loan in steps of 5 and lose 1 VP per 5 unpaid (p. 13).
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}