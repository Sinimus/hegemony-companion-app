import type { PlayerClass } from '@/types/game';

// --- A. Herní Zkratky a Koncepty ---

export const HINTS: Record<string, string> = {
    'P1': 'Fiscal Policy (Fiskální Politika)',
    'P2': 'Labor Market (Trh práce)',
    'P3': 'Taxation (Zdanění)',
    'P4': 'Healthcare (Zdravotnictví)',
    'P5': 'Education (Vzdělávání)',
    'P6': 'Foreign Trade (Zahraniční Obchod)',
    'P7': 'Immigration (Imigrace)',
    'VP': 'Victory Points (Vítězné body)',
    'TM': 'Tax Multiplier (Daňový Multiplikátor)',
    'Prosperity': 'Prosperita (hlavní VP zdroj pro WC/MC)',
    'Legitimacy': 'Legitimita (hlavní VP zdroj pro Stát)',
    'IMF': 'International Monetary Fund (Mezinárodní Měnový Fond)',
    'L1/L2/L3': 'Wage Levels (Úrovně Mezd, L1 = nejnižší, L3 = nejvyšší)',
    'Capital': 'Kapitál (Peněžní rezerva CC pro VP scoring)',
    'Revenue': 'Příjem (Aktuální zisky CC před zdaněním)',
};

// --- B. Přehled Fází Kola ---

export interface Phase {
    name: string;
    description: string;
    order: string;
}

export const ROUND_PHASES: Phase[] = [
    {
        name: 'Preparation Phase',
        description: 'Placení úroků, drop Prosperity, lízání karet, příchod imigrantů, odhalení Agendy/Eventů/Export/Business Deals.',
        order: '1.'
    },
    {
        name: 'Action Phase',
        description: 'Hráči hrají 5 kol (Main + Free Action). Pořadí: WC → MC → CC → State.',
        order: '2.'
    },
    {
        name: 'Production Phase',
        description: 'Reverzní pořadí: State → CC → MC → WC. Výroba, platby mezd, Covered Needs (Food), IMF Check, placení daní.',
        order: '3.'
    },
    {
        name: 'Elections Phase',
        description: 'Plnění Voting Bag. Hlasování o navržených Billech, utrácení Influence a scoring VP za prohlasované Bille.',
        order: '4.'
    },
    {
        name: 'Scoring Phase',
        description: 'Scoring Prosperity/Wealth/Legitimacy/Agenda. Penále za neřešené Eventy. Pokles Legitimacy a Prosperity.',
        order: '5.'
    },
];

// --- C. Strategické Popisy Tříd ---

export const CLASS_STRATEGIES: Record<PlayerClass, { objective: string; vp_source: string; key_mechanics: string }> = {
    'working': {
        objective: 'Maximalizovat prosperitu a pokrýt základní potřeby (Food, Health, Education, Luxury).',
        vp_source: 'Prosperita (VP = nová úroveň) a Trade Unions (2 VP/kolo).',
        key_mechanics: 'Assign Workers, Strike (za vyšší mzdy), Demonstration (za volné pozice), Trade Unions, Buy Goods & Services (až 2 zdroje).'
    },
    'middle': {
        objective: 'Vyvážit produkci, prodej a spotřebu. Pokrýt potřeby Workers a zvýšit prosperitu.',
        vp_source: 'Prosperita (VP = nová úroveň) a bonusová prosperita v Scoring Phase (Prosperity < Operační Firmy).',
        key_mechanics: 'Build Small Companies (sami/s WC), Extra Shift (pro dodatečnou produkci), Sell to Foreign Market (VP za transakci).'
    },
    'capitalist': {
        objective: 'Maximalizovat zisk. Vlastnit Company a prodávat zboží/služby za profit.',
        vp_source: 'Wealth Track (VP z celkového Capitalu + bonus za růst) a End-Game scoring za Neoliberální politiky (sekce C).',
        key_mechanics: 'Build/Sell Companies, Adjust Wages/Prices, Make Business Deal (import s nižší cenou), Lobby (pro Influence).'
    },
    'state': {
        objective: 'Zvýšit legitimitu udržováním rovnováhy mezi třídami a řešením společenských problémů (Events).',
        vp_source: 'Součet 2 nejnižších Legitimacy skóre, shoda s Political Agenda (1 VP/shoda) a VP za poskytování welfare/benefitů.',
        key_mechanics: 'Propose Bill, Event Action (řešení problémů), Meet with MPs (pro Legitimitu), Extra Tax (za cenu Legitimity).'
    }
};