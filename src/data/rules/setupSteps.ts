import type { RuleSection } from './types';

// K2: game setup for the chosen game configuration. Paraphrased, with page references (r160).
// Values the rulebook shows only in images are named as such and point to the page.
export const SETUP_SECTIONS: readonly RuleSection[] = [
  {
    id: 'board',
    title: 'Main board',
    items: [
      {
        id: 'board-cc-companies',
        text: 'Put the 4 starting Capitalist Companies (Supermarket, Shopping Mall, College, Clinic) in the Capitalist part of the Private Sector, each with its Wage marker on L2.',
        source: { book: 'base', pages: '8' },
      },
      {
        id: 'board-public-2',
        text: 'Public Companies: keep the cards marked with 2 diamonds, box the 3 marked with 3. Row 1: the 3 starting Public Companies face up, Wage on L2. Row 2: one of each type face down. Row 3: the rest face down.',
        source: { book: 'base', pages: '8' },
        when: { classCounts: [2] },
      },
      {
        id: 'board-public-34',
        text: 'Public Companies: keep the cards marked with 3 diamonds, box the 3 marked with 2. Row 1: the 3 starting Public Companies face up, Wage on L2. Row 2: one of each type face down. Row 3: the rest face down.',
        source: { book: 'base', pages: '8' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'board-mc-companies',
        text: 'Put the 2 starting Middle Class Companies (Convenience Store, Doctor\'s Office) in the Middle Class part of the Private Sector, Wage on L2.',
        source: { book: 'base', pages: '8' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'board-decks',
        text: 'Shuffle the Business Deals and reveal 1. Shuffle the Export deck and reveal 1. Put a marker on the middle space of Import. Shuffle the Immigration deck onto its space.',
        source: { book: 'base', pages: '8' },
      },
      {
        id: 'board-policies',
        text: 'Set the 7 Policy markers to their starting sections as the setup diagram shows. The Policies screen starts from the same sections; Labor Market, Foreign Trade and Immigration there are not verified against the rules text.',
        source: { book: 'base', pages: '8' },
      },
      {
        id: 'board-treasury',
        text: 'Put 120 in the State Treasury. Put Health, Education and Influence in Public Services in the amounts the table shows for your class count (image only).',
        source: { book: 'base', pages: '8' },
      },
      {
        id: 'board-markers',
        text: 'Round marker on the first space, Tax Multiplier marker on 5, every scoring marker on 0.',
        source: { book: 'base', pages: '8' },
      },
      {
        id: 'board-bag',
        text: 'Sort the Voting cubes by colour and put 8 of each colour in the bag. All 3 colours go in, even when the Middle Class does not play.',
        source: { book: 'base', pages: '8' },
      },
      {
        id: 'board-mc-workers-box',
        text: 'Return the Middle Class Workers to the box; set out the Working Class Workers by colour and type.',
        source: { book: 'base', pages: '8' },
        when: { classCounts: [2] },
      },
      {
        id: 'board-workers',
        text: 'Set out the Working Class and Middle Class Workers by colour and type near the board.',
        source: { book: 'base', pages: '8' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'board-automa-full-setup',
        text: 'With Automas, set up every class in play exactly as if a person played it. The Automa counts as a player for every player-count rule.',
        source: { book: 'cc', pages: '3' },
        when: { anyAutoma: true },
      },
      {
        id: 'board-automa-cubes',
        text: 'Keep the Voting cubes that are not in the bag next to it, sorted by colour, so you can see at a glance which class has more cubes in the bag (the Automa needs that for its Immediate Vote check).',
        source: { book: 'cc', pages: '3, 8' },
        when: { classCounts: [2], anyAutoma: true },
      },
    ],
  },
  {
    id: 'working',
    title: 'Working Class',
    items: [
      {
        id: 'wc-board',
        text: 'Player board: Population marker on 10, Prosperity on 0. Take 30 and 1 Influence, the 3 red Bill markers and the Voting token. Put the 2 Cooperative Farm cards aside.',
        source: { book: 'base', pages: '10' },
      },
      {
        id: 'wc-cards',
        text: 'Shuffle the Working Class Action cards and draw 7.',
        source: { book: 'base', pages: '10' },
        when: { human: 'working' },
      },
      {
        id: 'wc-workers-2',
        text: 'Workers on Companies, filling the slots on each card: Supermarket, Shopping Mall, Public Hospital and Public University (a skilled Worker of the matching colour and an unskilled one on each).',
        source: { book: 'base', pages: '10' },
        when: { classCounts: [2] },
      },
      {
        id: 'wc-workers-34',
        text: 'Workers on Companies, filling the slots on each card: Supermarket and College (a skilled and an unskilled Worker each) and University Hospital (a skilled and two unskilled).',
        source: { book: 'base', pages: '10' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'wc-unemployed-2',
        text: 'One unskilled Worker in Unemployed Workers, then draw 1 Immigration card and add the Working Class Worker it shows.',
        source: { book: 'base', pages: '10' },
        when: { classCounts: [2] },
      },
      {
        id: 'wc-unemployed-34',
        text: 'One unskilled Worker in Unemployed Workers, then draw 2 Immigration cards and add the Working Class Workers they show.',
        source: { book: 'base', pages: '10' },
        when: { classCounts: [3, 4] },
      },
    ],
  },
  {
    id: 'middle',
    title: 'Middle Class',
    when: { classCounts: [3, 4] },
    items: [
      {
        id: 'mc-board',
        text: 'Player board: Population on 10, Prosperity on 0. Take 40 and 1 Influence, 1 Food and 1 Health into the Storages. Price markers: Food 12, the other three 8. Take the 3 yellow Bill markers and the Voting token.',
        source: { book: 'base', pages: '10' },
      },
      {
        id: 'mc-cards',
        text: 'Shuffle the Middle Class Action cards and draw 7.',
        source: { book: 'base', pages: '10' },
        when: { human: 'middle' },
      },
      {
        id: 'mc-market',
        text: 'Shuffle the Middle Class Companies and reveal 3 as your Market.',
        source: { book: 'base', pages: '10' },
      },
      {
        id: 'mc-workers',
        text: 'Middle Class Workers fill the slots on Technical University, Shopping Mall, Convenience Store and Doctor\'s Office, standing.',
        source: { book: 'base', pages: '10' },
      },
    ],
  },
  {
    id: 'capitalist',
    title: 'Capitalist Class',
    items: [
      {
        id: 'cc-board',
        text: 'Player board: 120 in Revenue, a marker next to the Wealth table. 1 Food, 2 Luxury, 2 Education and 1 Influence into the Storages. Price markers: Food 12, the other three 8. Take the Free Trade Zone, the 3 blue Bill markers and the Voting token.',
        source: { book: 'base', pages: '10' },
      },
      {
        id: 'cc-cards',
        text: 'Shuffle the Capitalist Class Action cards and draw 7.',
        source: { book: 'base', pages: '10' },
        when: { human: 'capitalist' },
      },
      {
        id: 'cc-market',
        text: 'Shuffle the Capitalist Companies and reveal 4 as your Market.',
        source: { book: 'base', pages: '10' },
      },
    ],
  },
  {
    id: 'state',
    title: 'State',
    when: { classCounts: [4] },
    items: [
      {
        id: 'state-board',
        text: 'Player board: a marker on the second space of each Legitimacy track. Take 1 Influence, the 3 grey Bill markers and the Voting token. Shuffle the State Action cards and draw 7.',
        source: { book: 'base', pages: '10' },
      },
      {
        id: 'state-events',
        text: 'Shuffle the Event cards and reveal 2 onto the board. A card marked for rounds 2 to 5 only goes back and is replaced.',
        source: { book: 'base', pages: '10' },
        when: { modulesOff: ['alternativeEvents'] },
      },
      {
        id: 'state-alt-events',
        text: 'Alternative Events replace the Event cards: box the base Events, shuffle the Alternative Events next to the State board and reveal 2 as usual. Every rule about Event cards now means these.',
        source: { book: 'cc', pages: '15' },
        when: { modules: ['alternativeEvents'] },
      },
      {
        id: 'state-agenda',
        text: 'Shuffle the Political Agenda cards and reveal 1 next to the State board.',
        source: { book: 'base', pages: '10' },
      },
      {
        id: 'state-welfare',
        text: 'Health Welfare tile under the Health in Public Services, 4B side up. Education Welfare tile next to the State board.',
        source: { book: 'base', pages: '10' },
      },
    ],
  },
  {
    id: 'automas',
    title: 'Automas (Simple Mode)',
    when: { anyAutoma: true },
    items: [
      {
        id: 'automa-cards',
        text: 'For each Automa: its class\'s Action cards stay in the box. Shuffle its 30 AI cards into a face-down pile next to its board.',
        source: { book: 'cc', pages: '3' },
      },
      {
        id: 'automa-instructions',
        text: 'Keep its Instruction cards nearby, except those with CHECK in the title: those belong to Advanced Mode and stay in the box.',
        source: { book: 'cc', pages: '3' },
      },
    ],
  },
  {
    id: 'expansions',
    title: 'Mini expansions',
    items: [
      {
        id: 'ha-draw',
        text: 'Hidden Agendas: every player shuffles their own 5, draws 2, keeps 1 and boxes the rest unseen.',
        source: { book: 'cc', pages: '16' },
        when: { modules: ['hiddenAgendas'] },
      },
      {
        id: 'ha-automa',
        text: 'Hidden Agendas with an Automa: lay all of the Automa\'s Hidden Agendas face up; turn one face down when its task is achieved.',
        source: { book: 'cc', pages: '13' },
        when: { modules: ['hiddenAgendas'], anyAutoma: true },
      },
      {
        id: 'ha-state-events',
        text: 'Hidden Agendas with 4 classes: the State keeps the Event cards it acted on apart from the other discarded Events, because one Hidden Agenda counts them.',
        source: { book: 'cc', pages: '16' },
        when: { modules: ['hiddenAgendas'], classCounts: [4] },
      },
      {
        id: 'cr-deck',
        text: 'Crisis Response: shuffle the 10 cards face down near the board and turn the top one face up. Keep the 3 Bond cards and 2 Lock tokens at hand.',
        source: { book: 'cc', pages: '14' },
        when: { modules: ['crisisResponse'] },
      },
      {
        id: 'ac-shuffle',
        text: 'New Action cards: agree on them first, since some are very interactive. Shuffle each role\'s 5 into its Action deck. They are marked with dots beside the title.',
        source: { book: 'cc', pages: '16' },
        when: { modules: ['actionCards'] },
      },
      {
        id: 'he-deck',
        text: 'Historical Events: sort the cards by Period and shuffle each Period. Take 1 random card from each, unseen, into one face-down pile: Early Period on top, Period V at the bottom. Box the rest.',
        source: { book: 'he', pages: '1' },
        when: { modules: ['historicalEvents'] },
      },
      {
        id: 'he-early',
        text: 'Historical Events: reveal the Early Period card during setup and apply its effect.',
        source: { book: 'he', pages: '1' },
        when: { modules: ['historicalEvents'] },
      },
    ],
  },
];
