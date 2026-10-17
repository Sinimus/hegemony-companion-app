import type { AutomaClass } from '@/logic/setup';
import type { RuleItem } from './types';

// K5: Automa rules for Simple Mode (r158). A rules reference, not a decision aid (r150): the AI
// and Instruction cards decide; this lists what the cards do not say. Crisis & Control v1.1.

export const AUTOMA_GENERAL: readonly RuleItem[] = [
  {
    id: 'turn',
    text: 'Turn: Free Actions first, then reveal the top AI card. Try action 1 (counting the bonus printed for it), then 2, 3 and 4 as the Instruction cards allow; then the Special Action at the bottom; if none can be done, add 3 of its Voting cubes to the bag (Apply Political Pressure).',
    source: { book: 'cc', pages: '3' },
  },
  {
    id: 'choices',
    text: 'When an action has several options, go down the Instruction card\'s list one bullet at a time, keeping only the options each bullet allows, until one is left. A bullet that matches none of the remaining options is skipped. With only one option, skip the card.',
    source: { book: 'cc', pages: '7' },
  },
  {
    id: 'free-actions',
    text: 'Free Actions happen automatically at fixed points (see below) and are not limited to one per turn.',
    source: { book: 'cc', pages: '8' },
  },
  {
    id: 'propose',
    text: 'Propose Bill uses the 2 Policies printed on the AI card, first one first.',
    source: { book: 'cc', pages: '3, 13' },
  },
  {
    id: 'immediate-2',
    text: 'Immediate Vote with 2 classes: only if, after paying the 1 Influence, it still has more Influence than the opponent and has at least as many cubes in the bag.',
    source: { book: 'cc', pages: '8' },
    when: { classCounts: [2] },
  },
  {
    id: 'immediate-34',
    text: 'Immediate Vote with 3 or 4 classes: it guesses the sides from the Desired Policies card. It calls the vote only if its side, after the 1 Influence, has more Influence and at least one other class is on its side.',
    source: { book: 'cc', pages: '8' },
    when: { classCounts: [3, 4] },
  },
  {
    id: 'vote-side',
    text: 'On another player\'s Bill: for, if it reaches or approaches its Desired Policy; otherwise against.',
    source: { book: 'cc', pages: '8' },
  },
  {
    id: 'spend',
    text: 'Spending Influence: none if it has none or its side cannot change the result. Otherwise use the Instruction card for its case (winning; losing alone with Influence; losing with allies who have Influence). Draw X: draw up to X AI cards (no more than its Influence) and spend 1 per Influence symbol. Draw 1 to Spend All: one card, symbol means all.',
    source: { book: 'cc', pages: '8-9' },
  },
  {
    id: 'spend-order',
    text: 'People announce their Influence first; draw the Automa\'s cards afterwards and return them face down under its pile.',
    source: { book: 'cc', pages: '9' },
  },
  {
    id: 'multi',
    text: 'Several Automas on one side are pooled for the decision. Spent Influence is split as evenly as possible, the one that had more pays the extra; on a tie, at random.',
    source: { book: 'cc', pages: '9' },
  },
  {
    id: 'legitimacy',
    text: 'A Legitimacy icon on a bonus or Special Action counts only if that bonus is actually used or the Special Action done.',
    source: { book: 'cc', pages: '9' },
    when: { classCounts: [4] },
  },
  {
    id: 'final-round',
    text: 'Round 5: no Bills on Immigration; Foreign Trade only if it can call an Immediate Vote on it (check that first, otherwise skip to the next Policy). Before the elections shuffle the discards under the AI pile. In the final vote every Automa spends all its Influence.',
    source: { book: 'cc', pages: '9' },
  },
  {
    id: 'uncovered',
    text: 'A case no card covers: use judgement, or for a yes/no decision draw 1 AI card and say yes if it shows the Influence symbol.',
    source: { book: 'cc', pages: '9' },
  },
];

export const AUTOMA_CLASS_RULES: Record<AutomaClass, readonly RuleItem[]> = {
  working: [
    {
      id: 'wca-start',
      text: 'Start of its turn: Receive Benefits, and pay off a Loan if it can.',
      source: { book: 'cc', pages: '10' },
    },
    {
      id: 'wca-prosperity',
      text: 'End of its turn: whenever it holds Luxury, Education or Health equal to its Population, it uses them, as often as it can, in the order Luxury, Education, Health.',
      source: { book: 'cc', pages: '9' },
    },
    {
      id: 'wca-swap',
      text: 'Swap Workers happens automatically before Assign Workers.',
      source: { book: 'cc', pages: '10' },
    },
    {
      id: 'wca-buy',
      text: 'Buy Goods & Services: tops up to its Population (or buys a full Population\'s worth if it already has exactly that). If one source covers it and a second offers a full Population\'s worth it can afford, it buys that too, except Health one step before a Population increase. It avoids Health that would raise Population unless Health is all it can buy.',
      source: { book: 'cc', pages: '10' },
    },
    {
      id: 'wca-food',
      text: 'Cover Needs: Food from the cheapest source; on a tie Foreign Market, then State, Capitalist, Middle.',
      source: { book: 'cc', pages: '10' },
    },
    {
      id: 'wca-reassign',
      text: 'Moves employed Workers only if no Trade Union requirement (at least 4 Workers in that industry) is lost and Wages do not drop; given the chance, it moves Workers from Capitalist and Middle Companies to the State.',
      source: { book: 'cc', pages: '10' },
    },
    {
      id: 'wca-education',
      text: 'Use Education with no unemployed Worker to train: upgrade a random unskilled employed Worker.',
      source: { book: 'cc', pages: '10' },
    },
    {
      id: 'wca-demo',
      text: 'Demonstration VP losses fall on the Capitalist Class as far as possible, then the Middle Class, then the State.',
      source: { book: 'cc', pages: '10' },
    },
  ],
  middle: [
    {
      id: 'mca-start',
      text: 'Start of its turn: Adjust Prices if needed, Receive Benefits, and pay off a Loan if it can.',
      source: { book: 'cc', pages: '12' },
    },
    {
      id: 'mca-prices',
      text: 'Prices sit in the middle position, except: Foreign Trade A puts Food and Luxury at the top, Health C puts Health at the top, Education C puts Education at the top.',
      source: { book: 'cc', pages: '12' },
    },
    {
      id: 'mca-wages',
      text: 'Wages stay at the Labor Market minimum. After a Strike token on one of its Companies it raises its Wages to L3 on its next turn and resets them to the minimum next round.',
      source: { book: 'cc', pages: '12' },
    },
    {
      id: 'mca-prosperity',
      text: 'End of its turn: whenever its Goods & Services area holds Luxury, Education or Health equal to its Population, it uses them in the order Luxury, Education, Health.',
      source: { book: 'cc', pages: '12' },
    },
    {
      id: 'mca-swap',
      text: 'Swap Workers happens automatically before Assign Workers.',
      source: { book: 'cc', pages: '12' },
    },
    {
      id: 'mca-buy',
      text: 'Buy Goods & Services: buys from itself first as far as it can, the rest elsewhere, up to its Population; the same second-source and Health rules as the Working Automa.',
      source: { book: 'cc', pages: '12' },
    },
    {
      id: 'mca-food',
      text: 'Cover Needs: Food from the cheapest source, usually itself; on a tie State, then Foreign Market, then Capitalist.',
      source: { book: 'cc', pages: '12' },
    },
    {
      id: 'mca-company',
      text: 'Build Company: "fewest operational Companies" counts only its own Companies. Selling abroad: as much of each resource as it can.',
      source: { book: 'cc', pages: '13' },
    },
    {
      id: 'mca-move',
      text: 'When a card lets it move any Workers, it moves employed Workers from Capitalist to Public Companies if Wages do not drop.',
      source: { book: 'cc', pages: '13' },
    },
    {
      id: 'mca-special',
      text: 'AI card with the Special Action symbol first: check only the first condition; if met, it does the Special Action.',
      source: { book: 'cc', pages: '12' },
    },
  ],
  capitalist: [
    {
      id: 'cca-start',
      text: 'Start of its turn: Adjust Prices if needed, Receive Benefits, and pay off a Loan if it has at least 100 in Capital.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-prices',
      text: 'Prices sit in the middle position, except: Foreign Trade A puts Food and Luxury at the top, Health C puts Health at the top, Education C puts Education at the top.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-wages',
      text: 'Wages stay at the Labor Market minimum. At the start of Production, for each Company with a Strike token draw 1 AI card: Influence symbol raises it to L3. Without the symbol, draw once more for a Company with Machinery or the only operational one in its industry. Next round all Wages go back to the minimum.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-bonus',
      text: 'Never gives bonuses.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-storage',
      text: 'Buys a Storage automatically, even outside its turn, when it would overflow; at most one per resource, then excess is lost. Food and Luxury go to the Free Trade Zone first.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-company',
      text: 'Build Company: "fewest operational Companies" counts only its own Companies.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-export',
      text: 'Selling abroad: as much of each resource as it can, goods from the Free Trade Zone first.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-deal',
      text: 'Business Deal: of two it can afford, the more expensive; the goods go to the Free Trade Zone when they fit.',
      source: { book: 'cc', pages: '11' },
    },
    {
      id: 'cca-special',
      text: 'AI card with the Special Action symbol first: check only the first condition; if met, it does the Special Action.',
      source: { book: 'cc', pages: '11' },
    },
  ],
};

export const AUTOMA_MODULE_RULES: readonly RuleItem[] = [
  {
    id: 'out-of-turn-bill',
    text: 'Proposing a Bill outside its turn: draw the next AI card and use its first Policy, else the second; keep drawing until one can be proposed.',
    source: { book: 'cc', pages: '13' },
  },
  {
    id: 'ha',
    text: 'Hidden Agendas: all face up from setup, turned face down when achieved. At game end it scores the face-down one worth the most.',
    source: { book: 'cc', pages: '13' },
    when: { modules: ['hiddenAgendas'] },
  },
  {
    id: 'cr',
    text: 'Crisis Response: removes unskilled Workers first. Bond Program: draw 1 AI card, Influence symbol means it lends the highest amount it can.',
    source: { book: 'cc', pages: '13' },
    when: { modules: ['crisisResponse'] },
  },
  {
    id: 'ae',
    text: 'Alternative Events: in rounds 1 to 4 it keeps a card it is given, in round 5 it discards it for 1 VP. It always uses its Benefits as well as it can.',
    source: { book: 'cc', pages: '13' },
    when: { modules: ['alternativeEvents'] },
  },
  {
    id: 'ae-cards',
    text: 'Public Pressure: used in its first election after receiving it, on Policies 2 to 6 where it expects the State (by the State\'s Desired Policies) on the other side. Demand for State Intervention: the Company with the biggest Wage difference, random on a tie.',
    source: { book: 'cc', pages: '13' },
    when: { modules: ['alternativeEvents'] },
  },
  {
    id: 'he',
    text: 'Historical Events: Free Action triggers fire at the end of its turn; a possible Basic Action trigger replaces its Special Action, unless the Special Action symbol is along the top of the AI card.',
    source: { book: 'cc', pages: '13' },
    when: { modules: ['historicalEvents'] },
  },
];
