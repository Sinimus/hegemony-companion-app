import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { getIMFLoanLimit } from '@/logic/taxes';
import { Card } from '@/components/ui/card';
import { AlertOctagon, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IMFRiskCalc() {
    const { policies } = useGameStore();
    const [currentLoans, setCurrentLoans] = useState(2);

    const maxSafeLoans = getIMFLoanLimit(policies.fiscal);
    const isOverLimit = currentLoans > maxSafeLoans;
    const loansToIntervention = maxSafeLoans - currentLoans;

    const statusText = isOverLimit
        ? `DANGER: ${currentLoans - maxSafeLoans} loan(s) over limit!`
        : `SAFE: ${loansToIntervention} loan(s) remaining until limit.`;

    const statusColor = isOverLimit ? 'text-red-500' : (loansToIntervention <= 1 ? 'text-amber-500' : 'text-green-500');

    return (
        <Card className={cn("p-4 space-y-3", isOverLimit ? 'border-red-500/50 bg-red-900/10' : 'border-neutral-800/50 bg-neutral-900/50')}>
            <h4 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <AlertOctagon className={cn("w-4 h-4", statusColor)} /> IMF Intervention Risk
            </h4>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-neutral-400">Current State Loans</label>
                    <input type="number" min="0" value={currentLoans} onChange={e => setCurrentLoans(Number(e.target.value))} className="w-16 bg-neutral-950 border border-neutral-700 rounded p-1 text-right text-white" />
                </div>
            </div>

            <div className="pt-2 border-t border-neutral-800">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400 flex items-center">
                        <Landmark className="w-4 h-4 mr-1 text-class-state" /> Fiscal Policy ({policies.fiscal}) Limit:
                    </span>
                    <span className="text-white font-mono font-bold">{maxSafeLoans} Loans</span>
                </div>

                <div className="pt-3">
                    <span className={cn("text-lg font-black block", statusColor)}>{statusText}</span>
                    <p className="text-xs text-neutral-500 mt-1">
                        *Intervention requires exceeding this limit AND inability to pay loan interest/principal.
                    </p>
                </div>
            </div>
        </Card>
    );
}