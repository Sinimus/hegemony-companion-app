import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { IMF_LOAN_THRESHOLD, isImfInterventionDue } from '@/logic/taxes';
import { Card } from '@/components/ui/card';
import { AlertOctagon, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IMFRiskCalc() {
    const { policies } = useGameStore();
    const [currentLoans, setCurrentLoans] = useState(2);

    const threshold = IMF_LOAN_THRESHOLD[policies.fiscal];
    const isDue = isImfInterventionDue(currentLoans, policies.fiscal);
    const loansToIntervention = threshold - currentLoans;

    const statusText = isDue
        ? 'IMF intervenes in Check IMF unless the State pays off Loans first (55 each, p. 12)'
        : `${loansToIntervention} more Loan(s) until the IMF threshold`;
    const statusColor = isDue ? 'text-red-500' : 'text-green-500';

    return (
        <Card className={cn("p-4 space-y-3", isDue ? 'border-red-500/50 bg-red-900/10' : 'border-neutral-800/50 bg-neutral-900/50')}>
            <h4 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <AlertOctagon className={cn("w-4 h-4", statusColor)} /> IMF Intervention Risk
            </h4>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label htmlFor="imf-current-loans" className="text-sm text-neutral-400">Current State Loans</label>
                    <input id="imf-current-loans" type="number" min="0" value={currentLoans} onChange={e => setCurrentLoans(Number(e.target.value))} className="w-16 bg-neutral-950 border border-neutral-700 rounded p-1 text-right text-white" />
                </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 space-y-3">
                <div className="text-sm text-neutral-400 flex items-center">
                    <Landmark className="w-4 h-4 mr-1 text-class-state" />
                    IMF intervenes at {threshold} Loan(s) with Fiscal Policy {policies.fiscal} (p. 30)
                </div>

                <div>
                    <span className={cn("text-lg font-black block", statusColor)}>{statusText}</span>
                    <p className="text-xs text-neutral-500 mt-1">
                        Checked once per round, in the Check IMF step of the Production Phase (p. 12).
                    </p>
                </div>
            </div>
        </Card>
    );
}
