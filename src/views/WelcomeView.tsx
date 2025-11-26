import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CORE_GLOSSARY, POLICY_GLOSSARY, ACRONYMS, type GlossaryItem } from '@/data/glossary';
import { BookOpen, Settings, Users, Target, ChevronRight } from 'lucide-react';

function InstructionsSection() {
    const instructions = [
        {
            icon: BookOpen,
            title: 'Start on the Guide',
            description: 'The default view provides a Glossary and Instructions on how to use the app.',
            color: 'text-blue-400'
        },
        {
            icon: Settings,
            title: 'Set Policies',
            description: 'Navigate to Policies (Dashboard) and use the interactive board to set the 7 Global Policies (P1-P7) to match the physical game board. The economic overview on this page updates instantly to show the real-time impact on the Tax Multiplier and State Fiscal Balance.',
            color: 'text-yellow-400'
        },
        {
            icon: Users,
            title: 'Select Faction',
            description: 'Use the navigation bar to select your faction (Working, Middle, Capitalist, or State).',
            color: 'text-green-400'
        },
        {
            icon: Target,
            title: 'Use Tools',
            description: 'In your faction\'s view, use the various Calculators (e.g., Worker Budget, Production Calc, Wealth Calc) to simulate turn actions and VP gains.',
            color: 'text-purple-400'
        },
    ];

    return (
        <Card className="border-neutral-700/50 bg-neutral-900/50">
            <CardHeader className="border-b border-neutral-800">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    How to Use the Hegemony Companion
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {instructions.map((instruction, index) => {
                        const Icon = instruction.icon;
                        return (
                            <div key={index} className="flex gap-4 p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900/70 transition-colors">
                                <div className={`p-2 rounded-lg bg-neutral-800 ${instruction.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white mb-2">{instruction.title}</h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed">{instruction.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10">
                    <div className="flex items-center gap-2 mb-2">
                        <ChevronRight className="w-4 h-4 text-amber-400" />
                        <h3 className="font-semibold text-amber-400">Pro Tip</h3>
                    </div>
                    <p className="text-sm text-amber-200">
                        Scroll to the <span className="font-semibold">Faction Reference</span> section at the bottom of your faction's page for a quick, context-aware guide on your specific turn actions and strategy, explicitly linking actions like "Make Business Deal" or "Use H/E/L" to the appropriate calculator tool.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function GlossarySection() {
    const GlossaryCategory = ({ title, items, color }: { title: string; items: GlossaryItem[]; color: string }) => (
        <Card className={`border-${color}/50 bg-neutral-900/50`}>
            <CardHeader className={`border-b border-${color}/30`}>
                <CardTitle className={`text-lg text-${color}`}>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="border-b border-neutral-800/30 pb-3 last:border-b-0 last:pb-0">
                        <h4 className="font-semibold text-white mb-2">{item.term}</h4>
                        <p className="text-sm text-neutral-300 leading-relaxed mb-1">{item.definition}</p>
                        <p className="text-xs text-neutral-500 font-mono">{item.source}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );

    const AcronymsSection = () => (
        <Card className="border-neutral-700/50 bg-neutral-900/50">
            <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-lg text-cyan-400">Quick Acronyms</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {Object.entries(ACRONYMS).map(([acronym, full]) => (
                        <div key={acronym} className="flex items-center gap-2 p-2 rounded border border-neutral-800 bg-neutral-900/50">
                            <span className="font-mono text-sm font-semibold text-cyan-400">{acronym}</span>
                            <ChevronRight className="w-3 h-3 text-neutral-500" />
                            <span className="text-xs text-neutral-400">{full}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card className="border-neutral-700/50 bg-neutral-900/50">
                <CardHeader className="border-b border-neutral-800">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="w-6 h-6 text-amber-400" />
                        Hegemony Glossary & Reference
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-neutral-400">
                            Comprehensive glossary covering all key terms, policies, and mechanics in Hegemony.
                            Perfect for both beginners learning the rules and experienced players needing quick reference.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <AcronymsSection />
                    <GlossaryCategory title="Core Concepts" items={CORE_GLOSSARY} color="green" />
                </div>
                <GlossaryCategory title="Policy Reference" items={POLICY_GLOSSARY} color="purple" />
            </div>
        </div>
    );
}

export function WelcomeView() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center space-y-4">
                <h1 className="text-4xl font-black text-white tracking-tighter">
                    Welcome to HEGEMONY
                    <span className="block text-2xl font-normal text-neutral-500 mt-2">Companion App</span>
                </h1>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                    Your digital assistant for the ultimate economic strategy board game.
                    Calculate taxes, track prosperity, and master the policies that shape society.
                </p>
            </header>

            <InstructionsSection />
            <GlossarySection />
        </div>
    );
}