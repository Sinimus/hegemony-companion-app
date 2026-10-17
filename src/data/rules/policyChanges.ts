import type { PolicyType } from '@/types/game';
import type { RuleItem, RuleSection } from './types';

// K4: what to adjust on the table right after a Policy moves (elections, an Immediate Vote,
// the IMF, a Historical Event or a Crisis Response card). Apply it before the next vote (p. 13).
// toward A = the section number goes down (C to B, B to A); toward C = the other way.
export type PolicyShift = 'towardA' | 'towardC';

export interface PolicyChangeItem extends RuleItem {
  shift?: PolicyShift;
}

export const POLICY_CHANGES: Record<PolicyType, readonly PolicyChangeItem[]> = {
  fiscal: [
    {
      id: 'p1-count',
      text: 'The Public Sector grows or shrinks to 3 (C), 6 (B) or 9 (A) available Public Companies. The IMF limit on State Loans changes with it.',
      source: { book: 'base', pages: '30' },
    },
    {
      id: 'p1-grow',
      text: 'New Public Companies: the State pays their cost (a Loan if it cannot). Unemployed Workers of one class that can fill all slots of a new Company go there at once, committed.',
      source: { book: 'base', pages: '30' },
      shift: 'towardA',
    },
    {
      id: 'p1-shrink',
      text: 'Closed Public Companies turn face down and the State gains their cost. Their Workers go to Unemployed, even committed ones.',
      source: { book: 'base', pages: '30' },
      shift: 'towardC',
    },
    {
      id: 'p1-state-player',
      text: 'The State player chooses which Companies open or close and, when there is a choice, whose Workers go where.',
      source: { book: 'base', pages: '30' },
      when: { classCounts: [4] },
    },
    {
      id: 'p1-no-state-grow',
      text: 'State without a player: reveal the whole next row and pay 60 from the Treasury. The owner of the Workers picks which new Company runs; if both classes could fill one, the Middle Class decides.',
      source: { book: 'base', pages: '30' },
      when: { classCounts: [2, 3] },
      shift: 'towardA',
    },
    {
      id: 'p1-no-state-shrink',
      text: 'State without a player: turn the whole bottom row face down and add 60 to the Treasury; its Workers go to Unemployed.',
      source: { book: 'base', pages: '30' },
      when: { classCounts: [2, 3] },
      shift: 'towardC',
    },
  ],
  labor: [
    {
      id: 'p2-wages',
      text: 'Every Company owner raises at once each Wage below the new minimum (A: L3 only, B: L2 or L3, C: all levels). Lowering other Wages is allowed, but not where Workers are committed.',
      source: { book: 'base', pages: '24, 30' },
    },
    {
      id: 'p2-public',
      text: 'State without a player: set every Public Company to the new minimum Wage.',
      source: { book: 'base', pages: '30' },
      when: { classCounts: [2, 3] },
    },
    {
      id: 'p2-automa',
      text: 'Capitalist and Middle Automas keep every Wage at the minimum, so move theirs to the new minimum too.',
      source: { book: 'cc', pages: '11, 12' },
      when: { anyAutoma: true },
    },
  ],
  tax: [
    {
      id: 'p3-tm',
      text: 'Move the Tax Multiplier marker now: base 3 (A, Welfare modifiers doubled), 2 (B, modifiers as printed) or 1 (C, modifiers ignored).',
      source: { book: 'base', pages: '30-31' },
    },
  ],
  health: [
    {
      id: 'p4-price',
      text: 'Public Health now costs 0 (A), 5 (B) or 10 (C). Move the Tax Multiplier: this Policy adds +2 (A), +1 (B) or 0 (C) before the Taxation rule.',
      source: { book: 'base', pages: '31' },
    },
    {
      id: 'p4-tile',
      text: 'Turn or remove the Health Welfare tile in Public Services so it matches A or B; no tile in C.',
      source: { book: 'base', pages: '27, 31' },
      when: { classCounts: [4] },
    },
    {
      id: 'p4-prices',
      text: 'The Capitalist and Middle Class may change their Health price right away.',
      source: { book: 'base', pages: '31' },
    },
    {
      id: 'p4-automa',
      text: 'Capitalist and Middle Automas put Health at its highest price in C and in the middle otherwise, at the start of their next turn.',
      source: { book: 'cc', pages: '11, 12' },
      when: { anyAutoma: true },
    },
  ],
  education: [
    {
      id: 'p5-price',
      text: 'Public Education now costs 0 (A), 5 (B) or 10 (C). Move the Tax Multiplier: +2 (A), +1 (B) or 0 (C) before the Taxation rule.',
      source: { book: 'base', pages: '31' },
    },
    {
      id: 'p5-tile',
      text: 'Place, turn or remove the Education Welfare tile so it matches A or B; no tile in C.',
      source: { book: 'base', pages: '27, 31' },
      when: { classCounts: [4] },
    },
    {
      id: 'p5-prices',
      text: 'The Capitalist and Middle Class may change their Education price right away.',
      source: { book: 'base', pages: '31' },
    },
    {
      id: 'p5-automa',
      text: 'Capitalist and Middle Automas put Education at its highest price in C and in the middle otherwise, at the start of their next turn.',
      source: { book: 'cc', pages: '11, 12' },
      when: { anyAutoma: true },
    },
  ],
  trade: [
    {
      id: 'p6-import',
      text: 'Move the Import marker. Tariffs per imported good: Food 10 and Luxury 6 (A), 5 and 3 (B), none (C); tariffs go to the State.',
      source: { book: 'base', pages: '32' },
    },
    {
      id: 'p6-deals',
      text: 'Business Deals on the board stay as they are; the new section only changes how many are drawn in the next Preparation Phase (A none, B 1, C 2).',
      source: { book: 'base', pages: '32' },
    },
    {
      id: 'p6-prices',
      text: 'The Capitalist and Middle Class may change their goods prices right away.',
      source: { book: 'base', pages: '32' },
    },
    {
      id: 'p6-automa',
      text: 'Capitalist and Middle Automas put Food and Luxury at their highest price in A and in the middle otherwise, at the start of their next turn.',
      source: { book: 'cc', pages: '11, 12' },
      when: { anyAutoma: true },
    },
  ],
  immigration: [
    {
      id: 'p7-next',
      text: 'Nothing to adjust now. From the next Preparation Phase the Working and Middle Class each get 0 (A), 1 (B) or 2 (C) extra Workers from Immigration cards.',
      source: { book: 'base', pages: '32' },
    },
    {
      id: 'p7-automa-final',
      text: 'In round 5 Automas never propose Immigration.',
      source: { book: 'cc', pages: '9' },
      when: { anyAutoma: true },
    },
  ],
};

// Moves outside the elections. The base game has none besides the IMF.
export const OFF_ELECTION_SHIFTS: readonly RuleItem[] = [
  {
    id: 'he-arrow',
    text: 'Historical Event arrow: move that Policy one section in the arrow\'s direction if it can. A Bill marker on that Policy goes back to its owner with 1 Influence. Then apply the consequences above.',
    source: { book: 'he', pages: '2' },
    when: { modules: ['historicalEvents'] },
  },
];

// IMF intervention. Base game (p. 33-34) or, with Crisis Response, the face-up card (C&C p. 14).
export const IMF_SECTIONS: readonly RuleSection[] = [
  {
    id: 'imf-base',
    title: 'IMF intervention',
    when: { modulesOff: ['crisisResponse'] },
    items: [
      {
        id: 'imf-trigger',
        text: 'Happens in Check IMF when the State holds more Loans than Fiscal Policy allows and cannot pay them off at 55 each.',
        source: { book: 'base', pages: '12, 33' },
      },
      {
        id: 'imf-bills',
        text: 'Discard every proposed Bill; each owner gains 1 Influence per discarded Bill marker.',
        source: { book: 'base', pages: '33' },
      },
      {
        id: 'imf-policies',
        text: 'Move the Policies as the IMF demands on the board, then apply every consequence: Public Companies sold for their cost, all Wages down to L1, a new Tax Multiplier, new import prices. The example on p. 33-34 ends with 3 Public Companies, L1 Wages, Tax Multiplier 5 and the Welfare tiles changed.',
        source: { book: 'base', pages: '33-34' },
      },
      {
        id: 'imf-prices',
        text: 'The Capitalist and Middle Class may adjust their prices.',
        source: { book: 'base', pages: '33' },
      },
      {
        id: 'imf-loans',
        text: 'The State pays off its Loans at 55 each, as far as it can, and discards the rest.',
        source: { book: 'base', pages: '33' },
      },
      {
        id: 'imf-legitimacy',
        text: 'All 3 Legitimacy markers go to half their value, rounded up.',
        source: { book: 'base', pages: '33' },
        when: { classCounts: [4] },
      },
      {
        id: 'imf-taxes',
        text: 'In this phase\'s Pay Taxes the Working and Middle Class still pay by the old Labor Market section (mark it as a reminder).',
        source: { book: 'base', pages: '33' },
      },
    ],
  },
  {
    id: 'imf-cr',
    title: 'IMF intervention with Crisis Response',
    when: { modules: ['crisisResponse'] },
    items: [
      {
        id: 'cr-trigger',
        text: 'The trigger is unchanged: in Check IMF the State holds more Loans than Fiscal Policy allows and cannot pay them off. Follow the face-up Crisis Response card instead of the base steps, in its 5 parts.',
        source: { book: 'cc', pages: '14' },
      },
      {
        id: 'cr-bills',
        text: '1. Discard Bills only on the Policies the card lists; 1 Influence per discarded Bill marker.',
        source: { book: 'cc', pages: '14' },
      },
      {
        id: 'cr-policies',
        text: '2. Move only the listed Policies, then apply their consequences (above). Some Policies get a Lock token: no Bills on them until the next Check IMF.',
        source: { book: 'cc', pages: '14' },
      },
      {
        id: 'cr-effects',
        text: '3. Additional effects in the printed order; a class symbol limits an effect to that class.',
        source: { book: 'cc', pages: '14' },
      },
      {
        id: 'cr-loans',
        text: '4. The State pays off its Loans as far as it can and discards the rest.',
        source: { book: 'cc', pages: '14' },
      },
      {
        id: 'cr-legitimacy',
        text: '5. The State loses the Legitimacy the card shows.',
        source: { book: 'cc', pages: '14' },
        when: { classCounts: [4] },
      },
      {
        id: 'cr-next',
        text: 'Set the card aside and turn up the next one for the next intervention.',
        source: { book: 'cc', pages: '14' },
      },
      {
        id: 'cr-bonds',
        text: 'New Government Bond Program: players may lend the State money; the Bond cards in front of the lenders record who gave what until the State repays.',
        source: { book: 'cc', pages: '14' },
      },
      {
        id: 'cr-automa',
        text: 'Automa: loses unskilled Workers first. For the Bond Program draw 1 AI card; with the Influence symbol it lends the highest amount it can.',
        source: { book: 'cc', pages: '13' },
        when: { anyAutoma: true },
      },
      {
        id: 'cr-taxes',
        text: 'If the card moved Labor Market, the Working and Middle Class still pay this phase\'s taxes by the old section.',
        source: { book: 'base', pages: '33' },
      },
    ],
  },
];
