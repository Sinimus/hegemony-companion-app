import { useState } from 'react';
import { calculateLoanCosts } from '@/logic/economics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Banknote, AlertTriangle } from 'lucide-react';

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
                    <label className="text-xs uppercase text-neutral-500 font-bold flex items-center gap-2">
                        Number of Active Loans
                    </label>
                    <input
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
                            <span className="text-red-400 font-mono">-{costs.interestCost} ¥</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Cost to Pay Off (Free Action)</span>
                            <span className="text-green-400 font-mono">+{costs.payoffCost} ¥</span>
                        </div>

                        <h4 className="text-xs uppercase text-red-500 font-bold pt-4 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> End-Game Penalty Risk
                        </h4>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">CC Penalty (-5 VP/Loan)</span>
                            <span className="text-red-500 font-mono">-{costs.maxCcPenalty} VP</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">WC/MC/State Penalty (-11 VP/Loan max)</span>
                            <span className="text-red-500 font-mono">-{costs.maxWcMcPenalty} VP</span>
                        </div>

                        <p className="text-xs text-neutral-500 pt-2 italic">
                            *Penalty occurs if you cannot afford 55¥ per loan during final repayment.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}