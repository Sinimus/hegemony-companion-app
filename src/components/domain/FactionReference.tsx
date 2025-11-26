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
    { name: 'Preparation Phase', order: '1. ', description: 'Setup, pay loan interest, draw cards, get new workers, reveal Agenda/Events.' },
    { name: 'Action Phase', order: '2. ', description: '5 rounds of Main Action + Free Action. Turn Order: WC → MC → CC → State.' },
    { name: 'Production Phase', order: '3. ', description: 'Reverse Order: State → CC → MC → WC. Production, pay wages, Cover Needs (Food), IMF Check, Pay Taxes.' },
    { name: 'Elections Phase', order: '4. ', description: 'Refill Bag, vote on Bills, spend Influence, score Bill VP.' },
    { name: 'Scoring Phase', order: '5. ', description: 'Score Prosperity/Wealth/Legitimacy/Agenda. Apply Event Penalties. Reduce Legitimacy/Prosperity levels.' },
];

const FACTION_GUIDES: Record<PlayerClass, ActionGuide[]> = {
    'working': [
        { actionName: 'Assign Workers', actionType: 'Basic', description: 'Place up to 3 uncommitted workers on company slots or Trade Unions to secure income.', calculatorLink: 'WorkerBudget' },
        { actionName: 'Use H/E/L', actionType: 'Free', description: 'Spend resources (Health, Education, Luxury) equal to Population to gain +1 Prosperity.', calculatorLink: 'WorkingProsperityCalc' },
        { actionName: 'Strike', actionType: 'Basic', description: 'Place tokens on L1/L2 wage companies to pressure owners for raises, gaining Influence if production is blocked.', calculatorLink: 'WorkerBudget' },
        { actionName: 'Buy Goods & Services', actionType: 'Basic', description: 'Buy Food/Luxury/H/E/Influence (up to Pop limit) from 2 sources. Check P6 tariffs for Foreign Market.', calculatorLink: 'ImportTariffCalc' },
    ],
    'middle': [
        { actionName: 'Build Company', actionType: 'Basic', description: 'Pay cost and place own workers (committed) to run small business (max 8 companies).', calculatorLink: 'MiddleBalance' },
        { actionName: 'Extra Shift', actionType: 'Basic', description: 'Produce instantly using uncommitted MC workers (pay WC wage if applicable).', calculatorLink: 'MiddleBalance' },
        { actionName: 'Sell to Foreign Market', actionType: 'Basic', description: 'Sell produced goods/services (1x per transaction) for revenue and 1 VP per trade.', calculatorLink: 'TradeCalc' },
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
        { actionName: 'Propose Bill', actionType: 'Basic', description: 'Propose a policy change (+/- 1 step). Spend 1 Influence for an Immediate Vote to gain 3 VP.', calculatorLink: 'PolicyBoard' },
        { actionName: 'Extra Tax', actionType: 'Basic', description: 'Gain 10¥ from all players (Risk: -1 Legitimacy to 2 lowest classes).', calculatorLink: 'StateTreasury' },
        { actionName: 'Legitimacy Scoring', actionType: 'N/A', description: 'Gain VP equal to the sum of the two lowest Legitimacy scores.', calculatorLink: 'StateScoringCalc' },
    ],
};

const CLASS_STRATEGIES: Record<PlayerClass, StrategyGuide> = {
    'working': { objective: 'Maximize Workers\' Prosperity and secure basic needs (Food, Health, Education, Luxury).', vp_source: 'Prosperity (VP = New Level) and Trade Unions (2 VP/round).', key_mechanics: 'Strikes, Demonstrations, Assigning Workers, Trade Unions.' },
    'middle': { objective: 'Balance production, selling, and consuming to cover Workers\' needs and increase Prosperity.', vp_source: 'Prosperity (VP = New Level) and 1 VP per Foreign Market Transaction.', key_mechanics: 'Small Business Ownership, Extra Shifts, Self-Sufficiency.' },
    'capitalist': { objective: 'Maximize profit. Run Companies and sell goods/services, focusing on Capital growth.', vp_source: 'Wealth Track (VP from Total Capital + growth bonus) and End-Game scoring on Neoliberal policies (Section C).', key_mechanics: 'Business Deals, Lobbying, Adjusting Wages/Prices, Automation.' },
    'state': { objective: 'Maintain high Legitimacy by balancing all Classes and resolving societal Issues (Events).', vp_source: 'Legitimacy (Sum of 2 lowest scores) and Political Agenda match (1 VP/match).', key_mechanics: 'Event Action, Propose Bill, Extra Tax, Public Services management.' },
};


export function FactionReference({ playerClass }: FactionReferenceProps) {
    const strategy = CLASS_STRATEGIES[playerClass];
    const guide = FACTION_GUIDES[playerClass];

    // Determine color based on class for dynamic styling
    const FactionColor = `border-class-${playerClass}`;

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
                <p className="text-xs italic text-neutral-500 pt-2">Your turn occurs only during the **Action Phase** (WC → MC → CC → State).</p>
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