import { useState } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { calculateTradeUnionVp, calculateWelfareBenefits, getCapitalistAutomaPriority } from '@/logic/scoring';
import { calculateTaxMultiplier } from '@/logic/economics';
import { Card } from '@/components/ui/card';
import { Users, Scale, Factory } from 'lucide-react';

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
                <label className="text-sm text-neutral-400">WC Unions on Board</label>
                <input type="number" min="0" value={tradeUnions} onChange={e => setTradeUnions(Number(e.target.value))} className="w-16 bg-neutral-950 border border-neutral-700 rounded p-1 text-right text-white" />
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
    const [benefitsSold, setBenefitsSold] = useState(5);

    const healthResult = calculateWelfareBenefits(policies.health, benefitsSold);
    const educationResult = calculateWelfareBenefits(policies.education, benefitsSold);

    const totalVp = healthResult.vpGain + educationResult.vpGain;
    const totalLeg = healthResult.legitimacyGain + educationResult.legitimacyGain;

    return (
        <Card className="p-4 space-y-3 border-neutral-800/50">
            <h4 className="text-sm font-bold text-class-state flex items-center gap-2">
                <Scale className="w-4 h-4" /> Welfare Benefits (State Revenue)
            </h4>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-neutral-400">Total Benefits Sold (H/E)</label>
                    <input type="number" min="0" value={benefitsSold} onChange={e => setBenefitsSold(Number(e.target.value))} className="w-16 bg-neutral-950 border border-neutral-700 rounded p-1 text-right text-white" />
                </div>
            </div>
            <div className="pt-2 border-t border-neutral-800">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Health Policy (P4: {policies.health}) VP Gain</span>
                    <span className="text-yellow-400">+{healthResult.vpGain} VP</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Education Policy (P5: {policies.education}) Leg Gain</span>
                    <span className="text-yellow-400">+{educationResult.legitimacyGain} Leg</span>
                </div>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-800">
                <span className="text-neutral-200">Total Bonus (VP/Leg)</span>
                <span className="text-class-state">+{totalVp} VP / +{totalLeg} Leg</span>
            </div>
        </Card>
    );
}

// --- Automa Decision Assistant (CC) ---

export function AutomaDecisionAssistant() {
    const { policies } = useGameStore();
    const [ccCapital, setCcCapital] = useState(120);

    const taxMultiplier = calculateTaxMultiplier(policies.tax, policies.health, policies.education);
    const priority = getCapitalistAutomaPriority(ccCapital, taxMultiplier);

    return (
        <Card className="p-4 space-y-3 border-neutral-800/50">
            <h4 className="text-sm font-bold text-red-500 flex items-center gap-2">
                <Factory className="w-4 h-4" /> Automa Decision Assistant (CC)
            </h4>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-neutral-400">Capitalist Capital (¥)</label>
                    <input type="number" min="0" value={ccCapital} onChange={e => setCcCapital(Number(e.target.value))} className="w-16 bg-neutral-950 border border-neutral-700 rounded p-1 text-right text-white" />
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Current Tax Multiplier (TM)</span>
                    <span className="text-yellow-400 font-mono">{taxMultiplier}</span>
                </div>
            </div>
            <div className="flex flex-col pt-2 border-t border-neutral-800">
                <span className="text-xs uppercase text-neutral-500 mb-1">CC Automa Next Priority</span>
                <span className="text-lg font-black text-white">{priority.action}</span>
                <span className="text-xs font-mono text-yellow-500 mt-1">Tool: {priority.tool}</span>
            </div>
        </Card>
    );
}