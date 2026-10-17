import type { PlayerClass } from '@/types/game';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FactionReferenceProps {
    playerClass: PlayerClass;
}

interface ActionGuide {
    actionName: string;
    actionType: 'Basic' | 'Free' | 'N/A';
    description: string;
    calculatorLink?: string;
}

interface StrategyGuide {
    objective: string;
    vp_source: string;
    key_mechanics: string;
}

const ROUND_PHASES = [
    { name: 'Preparation Phase', order: '1. ', description: 'Pay 5 interest per Loan, lower Prosperity (Working Class 1, Middle Class 2), draw back to 7 cards, add new Workers (p. 14, 18, 22).' },
    { name: 'Action Phase', order: '2. ', description: '5 turns, each a Main Action (a card or a Basic Action) plus one Free Action. Order: WC → MC → CC → State (p. 11).' },
    { name: 'Production Phase', order: '3. ', description: 'Reverse order State → CC → MC → WC: produce and pay one Wage per Company, Cover Needs with Food, Check IMF, Pay Taxes (p. 11-12).' },
    { name: 'Elections Phase', order: '4. ', description: 'Refill the bag and vote on proposed Bills; a passed Bill scores 3 VP for its proposer and 1 VP for each supporter whose vote counted (p. 12, 32).' },
    { name: 'Scoring Phase', order: '5. ', description: 'Score Trade Unions, Wealth, the Middle Class Prosperity check, the State\'s Legitimacy and Political Agenda; Legitimacy then drops to half (p. 17, 21, 25, 28-29).' },
];

const FACTION_GUIDES: Record<PlayerClass, ActionGuide[]> = {
    'working': [
        { actionName: 'Assign Workers', actionType: 'Basic', description: 'Place up to 3 uncommitted workers on company slots or Trade Unions to secure income.', calculatorLink: 'WorkerBudget' },
        { actionName: 'Use H/E/L', actionType: 'Free', description: 'Spend Health, Education or Luxury equal to your Population for +1 Prosperity. Healthcare also gives 2 VP and a new Worker; Education trains a Worker (p. 16).', calculatorLink: 'WorkingProsperityCalc' },
        { actionName: 'Strike', actionType: 'Basic', description: 'Strike in up to 2 Companies with L1 or L2 Wages and no committed Workers; each that still pays L1 or L2 at production skips it and gives you 1 Influence. Public Companies only with 4 players (p. 15-16).', calculatorLink: 'WorkerBudget' },
        { actionName: 'Buy Goods & Services', actionType: 'Basic', description: 'Buy Food/Luxury/H/E/Influence (up to Pop limit) from 2 sources. Check P6 tariffs for Foreign Market.', calculatorLink: 'ImportTariffCalc' },
    ],
    'middle': [
        { actionName: 'Build Company', actionType: 'Basic', description: 'Pay cost and place own workers (committed) to run small business (max 8 companies).', calculatorLink: 'MiddleBalance' },
        { actionName: 'Extra Shift', actionType: 'Basic', description: 'Produce instantly using uncommitted MC workers (pay WC wage if applicable).', calculatorLink: 'MiddleBalance' },
        { actionName: 'Sell to Foreign Market', actionType: 'Basic', description: 'Sell through the current Export card only: each listed deal once per action, never Influence; 1 VP per deal (p. 23).' },
        { actionName: 'Scoring Check', actionType: 'N/A', description: 'During Scoring, check if Prosperity < Operational Companies for free +1 Prosperity.', calculatorLink: 'MiddleProsperityCalc' },
    ],
    'capitalist': [
        { actionName: 'Build Company', actionType: 'Basic', description: 'Pay cost (Revenue) to expand production (max 12 companies). Needs to consider Labor Market (P2) min wage.', calculatorLink: 'ProductionCalc' },
        { actionName: 'Adjust Wages/Prices', actionType: 'Free', description: 'Modify wages (L1-L3) and selling prices. Raising wages commits workers.', calculatorLink: 'ProductionCalc' },
        { actionName: 'Lobby', actionType: 'Basic', description: 'Spend 30¥ from Capital to gain 3 Personal Influence.', calculatorLink: 'WealthCalc' },
        { actionName: 'Make Business Deal', actionType: 'Basic', description: 'Acquire discounted goods from Foreign Market (consider P6 tariffs vs Free Trade Zone).', calculatorLink: 'ImportTariffCalc' },
    ],
    'state': [
        { actionName: 'Event Action', actionType: 'Basic', description: 'Resolve an Event card, choose a class to support, gaining Legitimacy/VP/resources.', calculatorLink: 'StateScoringCalc' },
        { actionName: 'Propose Bill', actionType: 'Basic', description: 'Propose moving a Policy by one section; 1 Influence calls an Immediate Vote. You score 3 VP only if the Bill passes (p. 12, 27).', calculatorLink: 'PolicyBoard' },
        { actionName: 'Extra Tax', actionType: 'Basic', description: 'Every other player pays you 10; Legitimacy always drops by 1 for the two Classes it is lowest with (p. 28).' },
        { actionName: 'Legitimacy Scoring', actionType: 'N/A', description: 'Gain VP equal to the sum of the two lowest Legitimacy scores.', calculatorLink: 'StateScoringCalc' },
    ],
};

const CLASS_STRATEGIES: Record<PlayerClass, StrategyGuide> = {
    'working': { objective: 'Maximize Workers\' Prosperity and secure basic needs (Food, Health, Education, Luxury).', vp_source: 'Prosperity (VP = new level) and 2 VP per Trade Union in each Scoring Phase.', key_mechanics: 'Strikes, Demonstrations, Assigning Workers, Trade Unions.' },
    'middle': { objective: 'Balance production, selling, and consuming to cover Workers\' needs and increase Prosperity.', vp_source: 'Prosperity (VP = New Level) and 1 VP per Foreign Market Transaction.', key_mechanics: 'Small Business Ownership, Extra Shifts, Self-Sufficiency.' },
    'capitalist': { objective: 'Maximize profit. Run Companies and sell goods/services, focusing on Capital growth.', vp_source: 'Wealth Track (VP from Total Capital + growth bonus) and End-Game scoring on Neoliberal policies (Section C).', key_mechanics: 'Business Deals, Lobbying, Adjusting Wages/Prices, Automation.' },
    'state': { objective: 'Maintain high Legitimacy by balancing all Classes and resolving societal Issues (Events).', vp_source: 'Legitimacy (Sum of 2 lowest scores) and Political Agenda match (1 VP/match).', key_mechanics: 'Event Action, Propose Bill, Extra Tax, Public Services management.' },
};


const CLASS_BORDER: Record<PlayerClass, string> = {
    'working': 'border-class-working',
    'middle': 'border-class-middle',
    'capitalist': 'border-class-capitalist',
    'state': 'border-class-state',
};


export function FactionReference({ playerClass }: FactionReferenceProps) {
    const strategy = CLASS_STRATEGIES[playerClass];
    const guide = FACTION_GUIDES[playerClass];

    // Determine color based on class for dynamic styling
    const FactionColor = CLASS_BORDER[playerClass];

    // --- BOX 1: General Round Flow ---
    const BoxRoundFlow = (
        <Card className={cn("h-full border-neutral-700/50", FactionColor)}>
            <CardHeader className={cn("p-4 border-b", FactionColor)}>
                <CardTitle className="text-lg">General Round Flow (5 Phases)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
                {ROUND_PHASES.map((p) => (
                    <div key={p.order} className="border-l-4 border-neutral-800/50 pl-3">
                        <p className="font-bold text-neutral-200">{p.order}{p.name}</p>
                        <p className="text-sm text-neutral-400">{p.description}</p>
                    </div>
                ))}
                <p className="text-xs italic text-neutral-500 pt-2">Turns with Main and Free Actions happen in the Action Phase (WC → MC → CC → State); every player also pays, buys Food and votes in the Production and Elections Phases (p. 11-12).</p>
            </CardContent>
        </Card>
    );

    // --- BOX 2: Faction Turn Flow (Linked to Calculators) ---
    const BoxTurnFlow = (
        <Card className={cn("h-full border-neutral-700/50", FactionColor)}>
            <CardHeader className={cn("p-4 border-b", FactionColor)}>
                <CardTitle className="text-lg">{playerClass.toUpperCase()} Turn Flow & Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {guide.map((action) => (
                    <div key={action.actionName} className="border-b border-neutral-800 pb-3 last:border-b-0">
                        <p className="font-bold text-neutral-200">{action.actionName} ({action.actionType} Action)</p>
                        <p className="text-sm text-neutral-400">{action.description}</p>
                        {action.calculatorLink &&
                            <p className="text-xs font-mono text-yellow-500 mt-1">
                                🔗 Calculator: {action.calculatorLink}
                            </p>
                        }
                    </div>
                ))}
            </CardContent>
        </Card>
    );

    // --- BOX 3: Faction Strategy ---
    const BoxStrategy = (
        <Card className={cn("h-full border-neutral-700/50", FactionColor)}>
            <CardHeader className={cn("p-4 border-b", FactionColor)}>
                <CardTitle className="text-lg">Core Strategy: {playerClass.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-sm text-neutral-300">
                <div>
                    <p className="font-bold text-white">Objective:</p>
                    <p>{strategy.objective}</p>
                </div>
                <div>
                    <p className="font-bold text-white">Main VP Source:</p>
                    <p>{strategy.vp_source}</p>
                </div>
                <div>
                    <p className="font-bold text-white">Key Mechanics:</p>
                    <p>{strategy.key_mechanics}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="grid md:grid-cols-3 gap-6 pt-6">
            {BoxRoundFlow}
            {BoxTurnFlow}
            {BoxStrategy}
        </div>
    );
}