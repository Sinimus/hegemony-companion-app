
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
        term: 'Policy Board',
        definition: 'The main section detailing the 7 policies, ranging from Socialism/Nationalism (A) to Neoliberalism/Globalism (C).',
        source: 'Rules [891-894]'
    },
    {
        term: 'Prosperity',
        definition: 'The Working Class and Middle Class primary VP source, gained equal to the new Prosperity value after spending Health, Education, or Luxury.',
        source: 'Rules [1001-1002, 1015-1016]'
    },
    {
        term: 'Legitimacy',
        definition: 'The State\'s primary VP source. The State scores VP equal to the sum of the two lowest scores tracked across the three classes.',
        source: 'Rules [1035-1037]'
    },
    {
        term: 'Capital (CC)',
        definition: 'The Capitalist Class\'s taxed money area. Funds moved here during the Scoring Phase generate Wealth Track VP.',
        source: 'Rules [1026-1029]'
    },
    {
        term: 'IMF Intervention',
        definition: 'Triggered if the State has more Loans than Fiscal Policy (P1) allows and cannot pay them off. Leads to forced policy changes (Austerity, L1 Wages).',
        source: 'Rules [1295-1298, 2580-2596]'
    },
    {
        term: 'Tax Multiplier (TM)',
        definition: 'A dynamic value (Max 11) derived from policies P3, P4, and P5. Used to calculate Employment Tax for Capitalist and Middle Class companies.',
        source: 'Rules [933-935, 2408-2415]'
    },
];

export const POLICY_GLOSSARY: GlossaryItem[] = [
    { term: 'Fiscal Policy (P1)', definition: 'Controls the size of the Public Sector and the number of Loans that trigger IMF intervention.', source: 'Rules [2361-2362]' },
    { term: 'Labor Market (P2)', definition: 'Sets the minimum allowable Wage (L1, L2, or L3). Directly impacts Income Tax calculation.', source: 'Rules [2384-2388]' },
    { term: 'Taxation (P3)', definition: 'Determines Corporate and Income Tax rates, and sets the base value and modifier effect of the Tax Multiplier.', source: 'Rules [2404-2415]' },
    { term: 'Welfare State: Health (P4)', definition: 'Determines the cost of Public Health and provides a modifier (+0 to +2) to the Tax Multiplier.', source: 'Rules [2430-2436]' },
    { term: 'Welfare State: Education (P5)', definition: 'Determines the cost of Public Education and provides a modifier (+0 to +2) to the Tax Multiplier.', source: 'Rules [2469-2473]' },
    { term: 'Foreign Trade (P6)', definition: 'Determines import tariffs (paid to the State) and the number of Business Deal cards available.', source: 'Rules [2482-2495]' },
    { term: 'Immigration (P7)', definition: 'Controls the influx of new Workers for the Working and Middle Classes.', source: 'Rules [2514-2517]' },
];