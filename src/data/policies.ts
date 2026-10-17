import type { PolicyType } from '@/types/game';

export interface PolicyDef {
  id: PolicyType;
  name: string;
  description: string;
  levels: {
    A: { label: string; effect: string };
    B: { label: string; effect: string };
    C: { label: string; effect: string };
  };
}

export const POLICIES: PolicyDef[] = [
  {
    id: 'fiscal',
    name: 'Fiscal Policy',
    description: 'Size of the Public Sector and the IMF threshold (p. 30)',
    levels: {
      A: { label: '9 Public Companies', effect: '9 Public Companies; the IMF intervenes at 2 Loans' },
      B: { label: '6 Public Companies', effect: '6 Public Companies; the IMF intervenes at 2 Loans' },
      C: { label: '3 Public Companies', effect: '3 Public Companies; the strictest: the IMF intervenes at 1 Loan' }
    }
  },
  {
    id: 'labor',
    name: 'Labor Market',
    description: 'Lowest Wage level allowed on Company cards (p. 30)',
    levels: {
      A: { label: 'L3 only', effect: 'Only Level 3 Wages are allowed' },
      B: { label: 'L2 or L3', effect: 'Level 2 and Level 3 Wages are allowed' },
      C: { label: 'L1 to L3', effect: 'All Wage levels are allowed' }
    }
  },
  {
    id: 'tax',
    name: 'Taxation',
    description: 'Tax tables and the Tax Multiplier base (p. 30-31)',
    levels: {
      A: { label: 'TM base 3', effect: 'Tax Multiplier base 3; welfare modifiers count double' },
      B: { label: 'TM base 2', effect: 'Tax Multiplier base 2; welfare modifiers count normally' },
      C: { label: 'TM base 1', effect: 'Tax Multiplier base 1; welfare modifiers are ignored' }
    }
  },
  {
    id: 'health',
    name: 'Welfare State: Health & Benefits',
    description: 'Price of Public Health and a Tax Multiplier modifier (p. 31)',
    levels: {
      A: { label: 'Free', effect: 'Public Health is free; Tax Multiplier +2' },
      B: { label: '5 each', effect: 'Public Health costs 5; Tax Multiplier +1' },
      C: { label: '10 each', effect: 'Public Health costs 10; no Tax Multiplier modifier' }
    }
  },
  {
    id: 'education',
    name: 'Welfare State: Education',
    description: 'Price of Public Education and a Tax Multiplier modifier (p. 31-32)',
    levels: {
      A: { label: 'Free', effect: 'Public Education is free; Tax Multiplier +2' },
      B: { label: '5 each', effect: 'Public Education costs 5; Tax Multiplier +1' },
      C: { label: '10 each', effect: 'Public Education costs 10; no Tax Multiplier modifier' }
    }
  },
  {
    id: 'trade',
    name: 'Foreign Trade',
    description: 'Import tariffs and Business Deal cards (p. 32)',
    levels: {
      A: { label: 'Tariffs 10 / 6', effect: 'Tariff 10 per Food and 6 per Luxury; no Business Deal cards' },
      B: { label: 'Tariffs 5 / 3', effect: 'Tariff 5 per Food and 3 per Luxury; 1 Business Deal card' },
      C: { label: 'No tariffs', effect: 'No tariffs; 2 Business Deal cards' }
    }
  },
  {
    id: 'immigration',
    name: 'Immigration',
    description: 'Extra Workers each round (p. 32)',
    levels: {
      A: { label: 'No extra Workers', effect: 'Working and Middle Class get only their 2 new Workers' },
      B: { label: '+1 Worker', effect: 'Working and Middle Class each get 1 extra Worker' },
      C: { label: '+2 Workers', effect: 'Working and Middle Class each get 2 extra Workers' }
    }
  }
];
