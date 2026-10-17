import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateTradeUnionVp, calculateWelfareSale } from '@/logic/scoring';
import { Card } from '@/components/ui/card';
import { Users, Scale } from 'lucide-react';

// --- Trade Union VP (WC) ---

export function TradeUnionVpCalc() {
    const [tradeUnions, setTradeUnions] = useState(1);
    const vp = calculateTradeUnionVp(tradeUnions);

    return (
        <Card className="p-4 space-y-3 border-neutral-800/50">
            <h4 className="text-sm font-bold text-class-working flex items-center gap-2">
                <Users className="w-4 h-4" /> Trade Union VP (Scoring)
            </h4>
            <div className="flex justify-between items-center">
                <label htmlFor="trade-unions" className="text-sm text-neutral-400">WC Unions on Board</label>
                <input id="trade-unions" type="number" min="0" value={tradeUnions} onChange={e => setTradeUnions(Number(e.target.value))} className="w-16 bg-neutral-950 border border-neutral-700 rounded p-1 text-right text-white" />
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
                <span className="text-neutral-200">VP Gained (Current Round)</span>
                <span className="text-green-400">+{vp}</span>
            </div>
        </Card>
    );
}

// --- Welfare Benefit Revenue (State) ---

export function WelfareBenefitCalc() {
    const { policies } = useGameStore();
    const [healthSold, setHealthSold] = useState(0);
    const [educationSold, setEducationSold] = useState(0);

    const healthResult = calculateWelfareSale(policies.health, healthSold);
    const educationResult = calculateWelfareSale(policies.education, educationSold);

    return (
        <Card className="p-4 space-y-3 border-neutral-800/50">
            <h4 className="text-sm font-bold text-class-state flex items-center gap-2">
                <Scale className="w-4 h-4" /> Welfare Benefits (State)
            </h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="welfare-health-sold" className="text-xs uppercase text-neutral-500 font-bold">Health sold in this sale</label>
                    <input id="welfare-health-sold" type="number" min="0" value={healthSold} onChange={e => setHealthSold(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="welfare-education-sold" className="text-xs uppercase text-neutral-500 font-bold">Education sold in this sale</label>
                    <input id="welfare-education-sold" type="number" min="0" value={educationSold} onChange={e => setEducationSold(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white" />
                </div>
            </div>
            <div className="pt-2 border-t border-neutral-800 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Health, P4 {policies.health}</span>
                    <span className="text-yellow-400 font-mono">+{healthResult.vpGain} VP / +{healthResult.legitimacyGain} Legitimacy</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Education, P5 {policies.education}</span>
                    <span className="text-yellow-400 font-mono">+{educationResult.vpGain} VP / +{educationResult.legitimacyGain} Legitimacy</span>
                </div>
                <p className="text-xs text-neutral-500">
                    One sale at a time: section B gives 1 VP per sale, section A gives 1 Legitimacy to the buyer per 3 sold (p. 26-27).
                </p>
            </div>
        </Card>
    );
}
