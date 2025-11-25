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
    description: 'Government spending and public sector size',
    levels: {
      A: { label: 'Social State', effect: 'High State influence, more public jobs' },
      B: { label: 'Mixed', effect: 'Balanced approach' },
      C: { label: 'Austerity', effect: 'Low State spending, IMF friendly' }
    }
  },
  {
    id: 'labor',
    name: 'Labor Market',
    description: 'Minimum wage and worker rights',
    levels: {
      A: { label: 'Pro-Labor', effect: 'High Minimum Wage' },
      B: { label: 'Balanced', effect: 'Medium Minimum Wage' },
      C: { label: 'Free Market', effect: 'Low Minimum Wage' }
    }
  },
  {
    id: 'tax',
    name: 'Taxation',
    description: 'Corporate and Income tax rates',
    levels: {
      A: { label: 'Progressive', effect: 'High Corporate Tax' },
      B: { label: 'Flat', effect: 'Medium Taxes' },
      C: { label: 'Tax Haven', effect: 'Low Taxes' }
    }
  },
  {
    id: 'health',
    name: 'Healthcare',
    description: 'Cost of medical services',
    levels: {
      A: { label: 'Free Public', effect: 'State pays via taxes' },
      B: { label: 'Subsidized', effect: 'Shared costs' },
      C: { label: 'Private', effect: 'User pays full price' }
    }
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Cost of university and training',
    levels: {
      A: { label: 'Free Public', effect: 'State pays via taxes' },
      B: { label: 'Subsidized', effect: 'Shared costs' },
      C: { label: 'Private', effect: 'User pays full price' }
    }
  },
  {
    id: 'trade',
    name: 'Foreign Trade',
    description: 'Tariffs and import/export',
    levels: {
      A: { label: 'Protectionism', effect: 'High Import Tariffs' },
      B: { label: 'Balanced', effect: 'Medium Tariffs' },
      C: { label: 'Free Trade', effect: 'Zero Tariffs' }
    }
  },
  {
    id: 'immigration',
    name: 'Immigration',
    description: 'Flow of new workers',
    levels: {
      A: { label: 'Open Borders', effect: 'High influx of workers' },
      B: { label: 'Controlled', effect: 'Medium influx' },
      C: { label: 'Closed', effect: 'No immigration' }
    }
  }
];