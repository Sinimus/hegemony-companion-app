
export interface GlossaryItem {
    term: string;
    definition: string;
    source: string;
}

export const ACRONYMS: Record<string, string> = {
    'VP': 'Victory Points',
    'TM': 'Tax Multiplier',
    'P1': 'Fiscal Policy',
    'P2': 'Labor Market',
    'P3': 'Taxation',
    'P4': 'Welfare State: Health & Benefits',
    'P5': 'Welfare State: Education',
    'P6': 'Foreign Trade',
    'P7': 'Immigration',
};

export const CORE_GLOSSARY: GlossaryItem[] = [
    {
        term: 'Politics Table',
        definition: 'Seven Policies, each in section A, B or C. Policies 1-5 run from Socialism (A) to Neoliberalism (C), Policies 6-7 from Nationalism (A) to Globalism (C).',
        source: 'Rulebook v1.2, p. 6'
    },
    {
        term: 'Prosperity',
        definition: 'Main VP source of the Working and Middle Class: each step up scores the new track value. It drops in the Preparation Phase (Working Class by 1, Middle Class by 2) without losing VP.',
        source: 'Rulebook v1.2, p. 14, 16, 22, 24'
    },
    {
        term: 'Legitimacy',
        definition: 'The State tracks it for each Class. In the Scoring Phase the State scores the two lowest values together, then every track drops to half (rounded up).',
        source: 'Rulebook v1.2, p. 28-29'
    },
    {
        term: 'Capital (CC)',
        definition: 'After wages and taxes, the Capitalist Class moves its Revenue into Capital and scores Capital on the Wealth table.',
        source: 'Rulebook v1.2, p. 7, 21'
    },
    {
        term: 'IMF Intervention',
        definition: 'If in Check IMF the State holds as many Loans as Fiscal Policy tolerates (1 in C, 2 in A or B) and cannot pay them off, the IMF changes several Policies, forces Wages to L1 and halves Legitimacy.',
        source: 'Rulebook v1.2, p. 12, 30, 33'
    },
    {
        term: 'Tax Multiplier (TM)',
        definition: 'Taxation sets the base (3, 2 or 1) and whether the Health and Education modifiers count double, normally or not at all; at most 11, 5 at the start. Capitalist and Middle Class pay it per operational Company as Employment Tax.',
        source: 'Rulebook v1.2, p. 8, 20, 25, 30-31'
    },
];

export const POLICY_GLOSSARY: GlossaryItem[] = [
    { term: 'Fiscal Policy (P1)', definition: 'Number of Public Companies (9, 6 or 3) and the number of State Loans at which the IMF intervenes.', source: 'Rulebook v1.2, p. 30' },
    { term: 'Labor Market (P2)', definition: 'Lowest Wage level allowed on Company cards (A: L3 only, B: L2 or L3, C: any). Also selects the row of the Income Tax table.', source: 'Rulebook v1.2, p. 30' },
    { term: 'Taxation (P3)', definition: 'Selects the tax tables for each Class and sets the base and the modifier rule of the Tax Multiplier.', source: 'Rulebook v1.2, p. 30-31' },
    { term: 'Welfare State: Health & Benefits (P4)', definition: 'Price of Public Health (free, 5 or 10) and its Tax Multiplier modifier (+2, +1 or none).', source: 'Rulebook v1.2, p. 31' },
    { term: 'Welfare State: Education (P5)', definition: 'Price of Public Education (free, 5 or 10) and its Tax Multiplier modifier (+2, +1 or none).', source: 'Rulebook v1.2, p. 31-32' },
    { term: 'Foreign Trade (P6)', definition: 'Tariffs on imported Food and Luxury, paid to the State, and the number of Business Deal cards each round.', source: 'Rulebook v1.2, p. 32' },
    { term: 'Immigration (P7)', definition: 'Extra Workers each round for the Working and Middle Class on top of their 2: none in A, 1 in B, 2 in C.', source: 'Rulebook v1.2, p. 32' },
];
