import type { RuleSection } from './types';

// K3: the five phases of a round, with the points where the mini expansions step in.
// A static reference filtered by the game configuration: no "current phase", no "next step" (r156).
export const ROUND_SECTIONS: readonly RuleSection[] = [
  {
    id: 'preparation',
    title: '1. Preparation Phase',
    items: [
      {
        id: 'prep-skip',
        text: 'Skipped in round 1. Otherwise move the Round marker on, then each class does its own steps.',
        source: { book: 'base', pages: '11' },
      },
      {
        id: 'prep-alt-benefit',
        text: 'Alternative Event Benefits that name this phase start now, at its beginning unless the card says otherwise. No Benefit is mandatory.',
        source: { book: 'cc', pages: '15' },
        when: { modules: ['alternativeEvents'] },
      },
      {
        id: 'prep-interest',
        text: 'Every player with Loans pays 5 interest per Loan.',
        source: { book: 'base', pages: '14, 18, 22, 26' },
      },
      {
        id: 'prep-state-loan',
        text: 'State without a player: pay its Loan interest from the Treasury, then pay the Loan off if the Treasury holds more than 50.',
        source: { book: 'base', pages: '33' },
        when: { classCounts: [2, 3] },
      },
      {
        id: 'prep-prosperity-wc',
        text: 'Working Class Prosperity drops 1 space (never below 0, no VP lost).',
        source: { book: 'base', pages: '14' },
      },
      {
        id: 'prep-prosperity-mc',
        text: 'Middle Class Prosperity drops 2 spaces (never below 0, no VP lost).',
        source: { book: 'base', pages: '22' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'prep-cards',
        text: 'Players draw 5 Action cards, back to 7 in hand.',
        source: { book: 'base', pages: '14' },
      },
      {
        id: 'prep-cc-market',
        text: 'Capitalist Class: discard any Market Companies and refill to 4. Discard the Business Deals and draw new ones by Foreign Trade (A none, B 1, C 2). Replace the Export card. Do this before the other classes take new Workers.',
        source: { book: 'base', pages: '18' },
      },
      {
        id: 'prep-cca-market',
        text: 'Capitalist Automa: always discards its whole Market and draws 4 new Companies.',
        source: { book: 'cc', pages: '11' },
        when: { automa: 'capitalist' },
      },
      {
        id: 'prep-mc-market',
        text: 'Middle Class: discard any Market Companies and refill to 3.',
        source: { book: 'base', pages: '22' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'prep-mca-market',
        text: 'Middle Automa: discards a Market Company only if it already owns a Company of that industry.',
        source: { book: 'cc', pages: '12' },
        when: { automa: 'middle' },
      },
      {
        id: 'prep-wc-workers',
        text: 'Working Class: add 2 unskilled Workers, plus 1 Immigration card in Immigration B or 2 in C (take the Working Class Worker shown). Move the Population marker.',
        source: { book: 'base', pages: '14, 32' },
      },
      {
        id: 'prep-mc-workers',
        text: 'Middle Class: add 1 unskilled Worker and 1 skilled Worker of choice, plus Immigration cards as above (its own draw). Move the Population marker.',
        source: { book: 'base', pages: '22, 32' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'prep-state',
        text: 'State: reveal 2 new Events and a new Political Agenda.',
        source: { book: 'base', pages: '26' },
        when: { classCounts: [4] },
      },
      {
        id: 'prep-cca-wages',
        text: 'Capitalist Automa: if it raised Wages after a Strike, it sets all its Wages back to the current minimum now.',
        source: { book: 'cc', pages: '11' },
        when: { automa: 'capitalist' },
      },
      {
        id: 'prep-mca-wages',
        text: 'Middle Automa: if it raised Wages after a Strike, it sets all its Wages back to the current minimum now.',
        source: { book: 'cc', pages: '12' },
        when: { automa: 'middle' },
      },
      {
        id: 'prep-he-reveal',
        text: 'At the end of this phase, and also in round 1 where the phase is skipped, reveal this round\'s Historical Event on top of the previous one. Check its Requirement and Trigger.',
        source: { book: 'he', pages: '1' },
        when: { modules: ['historicalEvents'] },
      },
    ],
  },
  {
    id: 'action',
    title: '2. Action Phase',
    items: [
      {
        id: 'action-turns',
        text: 'Five turns each, always Working, Middle, Capitalist, State (classes not in play are skipped). A turn is one Main Action, either a card for its effect (if its requirement is met) or a discarded card for a Basic Action, plus at most one Free Action before or after. Two cards stay in hand for next round.',
        source: { book: 'base', pages: '11' },
      },
      {
        id: 'action-legitimacy',
        text: 'Legitimacy symbols on played cards change the State\'s tracks. Only with 4 classes; ignore them otherwise and when a card is discarded for a Basic Action.',
        source: { book: 'base', pages: '11' },
      },
      {
        id: 'action-automa-turn',
        text: 'Automa turn: Free Actions first, then reveal an AI card and try its four actions left to right, then its Special Action; if nothing works it adds 3 of its Voting cubes to the bag. See its class screen.',
        source: { book: 'cc', pages: '3' },
        when: { anyAutoma: true },
      },
      {
        id: 'action-alt-benefit',
        text: 'Alternative Event Benefits that name this phase start now.',
        source: { book: 'cc', pages: '15' },
        when: { modules: ['alternativeEvents'] },
      },
      {
        id: 'action-cr-lock',
        text: 'No Bill can be proposed for a Policy with a Lock token on it.',
        source: { book: 'cc', pages: '14' },
        when: { modules: ['crisisResponse'] },
      },
      {
        id: 'action-he-trigger',
        text: 'A Historical Event with an action trigger is fired by a listed player with the listed Free or Basic Action (and any extra cost), only if its Requirement is met. Each card fires once, then turns face down.',
        source: { book: 'he', pages: '1' },
        when: { modules: ['historicalEvents'] },
      },
      {
        id: 'action-he-automa',
        text: 'An Automa fires Free Action triggers at the end of its turn. If it would take its Special Action and can fire a Basic Action trigger, it does that instead (unless the Special Action symbol is along the top of its AI card).',
        source: { book: 'cc', pages: '13' },
        when: { modules: ['historicalEvents'], anyAutoma: true },
      },
      {
        id: 'action-he-end',
        text: 'End of the phase: fire a Historical Event whose trigger is the end of the Action Phase, if its Requirement is met.',
        source: { book: 'he', pages: '1' },
        when: { modules: ['historicalEvents'] },
      },
    ],
  },
  {
    id: 'production',
    title: '3. Production Phase',
    items: [
      {
        id: 'prod-order',
        text: 'Reverse order: State, Capitalist, Middle, Working. Every class finishes a step before the next step starts.',
        source: { book: 'base', pages: '11' },
      },
      {
        id: 'prod-alt-benefit',
        text: 'Alternative Event Benefits that name this phase start now.',
        source: { book: 'cc', pages: '15' },
        when: { modules: ['alternativeEvents'] },
      },
      {
        id: 'prod-produce',
        text: 'Produce: each Company owner pays the Company\'s Wage (once per Company, not per Worker) to the owner of its Workers, then takes the output.',
        source: { book: 'base', pages: '11-12' },
      },
      {
        id: 'prod-state-ai',
        text: 'State without a player: Public Companies still produce. Wages come from the Treasury, output goes to Public Services. If the Treasury runs dry, the State takes a Loan.',
        source: { book: 'base', pages: '12, 33' },
        when: { classCounts: [2, 3] },
      },
      {
        id: 'prod-public-limit',
        text: 'Each Public Service holds at most the output of its available Public Companies plus 6; excess is lost.',
        source: { book: 'base', pages: '12' },
      },
      {
        id: 'prod-cca-strike',
        text: 'Capitalist Automa with Strike tokens on its Companies: draw 1 AI card per struck Company now; see its class screen.',
        source: { book: 'cc', pages: '11' },
        when: { automa: 'capitalist' },
      },
      {
        id: 'prod-cover-needs',
        text: 'Cover Needs: the Working and Middle Class each use Food equal to their Population and must buy what they lack.',
        source: { book: 'base', pages: '12' },
      },
      {
        id: 'prod-imf',
        text: 'Check IMF: if the State has more Loans than Fiscal Policy allows, it may pay 55 per Loan; if it cannot, the IMF intervenes (Policies screen, IMF).',
        source: { book: 'base', pages: '12' },
      },
      {
        id: 'prod-cr-locks',
        text: 'Crisis Response: remove all Lock tokens at the start of Check IMF. An intervention follows the face-up Crisis Response card.',
        source: { book: 'cc', pages: '14' },
        when: { modules: ['crisisResponse'] },
      },
      {
        id: 'prod-taxes',
        text: 'Pay Taxes to the State Treasury by the Taxation in effect now. If the IMF just moved Labor Market, the Working and Middle Class pay by its previous section.',
        source: { book: 'base', pages: '12, 33' },
      },
    ],
  },
  {
    id: 'elections',
    title: '4. Elections Phase',
    items: [
      {
        id: 'elect-skip',
        text: 'Skipped when nobody proposed a Bill.',
        source: { book: 'base', pages: '12' },
      },
      {
        id: 'elect-he-none',
        text: 'A Historical Event with No Elections: no Bills this round and this phase is skipped; Bills already proposed are discarded for 1 Influence each.',
        source: { book: 'he', pages: '2' },
        when: { modules: ['historicalEvents'] },
      },
      {
        id: 'elect-alt-benefit',
        text: 'Alternative Event Benefits that name this phase start now.',
        source: { book: 'cc', pages: '15' },
        when: { modules: ['alternativeEvents'] },
      },
      {
        id: 'elect-refill',
        text: 'Refill the bag: Working Class half its Population, Capitalist half its operational Companies, Middle Class the higher of the two for itself; all rounded up.',
        source: { book: 'base', pages: '12' },
      },
      {
        id: 'elect-refill-2',
        text: 'With 2 classes the Middle Class still adds 5 cubes. Middle Class cubes drawn count among the 5 but vote for neither side; if all 5 are Middle Class and nobody spends Influence, the Bill passes.',
        source: { book: 'base', pages: '12-13' },
        when: { classCounts: [2] },
      },
      {
        id: 'elect-state-influence',
        text: 'The State adds no cubes; it gains the Influence shown above its lowest Legitimacy.',
        source: { book: 'base', pages: '28' },
        when: { classCounts: [4] },
      },
      {
        id: 'elect-vote',
        text: 'Vote Policy 1 to 7 in order. Players declare for or against in turn order (the proposer is for), draw 5 cubes, then everyone reveals Influence at once. A tie passes. The proposer scores 3 VP, every supporter who added a cube or Influence 1 VP.',
        source: { book: 'base', pages: '12-13' },
      },
      {
        id: 'elect-apply',
        text: 'Apply the consequences of a passed Bill before the next vote (Policies screen).',
        source: { book: 'base', pages: '13' },
      },
      {
        id: 'elect-automa',
        text: 'Automa: votes for a Bill that reaches or approaches its Desired Policy, otherwise against. People announce Influence first; the Automa draws its AI cards afterwards.',
        source: { book: 'cc', pages: '8-9' },
        when: { anyAutoma: true },
      },
      {
        id: 'elect-automa-final',
        text: 'Round 5: in the final vote every Automa spends all of its Influence.',
        source: { book: 'cc', pages: '9' },
        when: { anyAutoma: true },
      },
      {
        id: 'elect-ha',
        text: 'A Hidden Agenda about Policy sections cannot be claimed in this phase until every vote is done.',
        source: { book: 'cc', pages: '16' },
        when: { modules: ['hiddenAgendas'] },
      },
    ],
  },
  {
    id: 'scoring',
    title: '5. Scoring Phase',
    items: [
      {
        id: 'score-alt-benefit',
        text: 'Alternative Event Benefits that name this phase start now.',
        source: { book: 'cc', pages: '15' },
        when: { modules: ['alternativeEvents'] },
      },
      {
        id: 'score-wc',
        text: 'Working Class: 2 VP per Trade Union.',
        source: { book: 'base', pages: '17' },
      },
      {
        id: 'score-mc',
        text: 'Middle Class: +1 Prosperity for free if Prosperity is below the number of fully operational Companies.',
        source: { book: 'base', pages: '25' },
        when: { classCounts: [3, 4] },
      },
      {
        id: 'score-cc',
        text: 'Capitalist Class: move Revenue to Capital and score the Wealth table; moving the Wealth marker right scores 3 VP per space.',
        source: { book: 'base', pages: '21' },
      },
      {
        id: 'score-state',
        text: 'State: penalties of Events left on the board, VP equal to the two lowest Legitimacy values, then every Legitimacy to half (rounded up) plus Legitimacy tokens, then 1 VP per matching Political Agenda Policy.',
        source: { book: 'base', pages: '28-29' },
        when: { classCounts: [4] },
      },
      {
        id: 'score-end',
        text: 'After round 5 the game ends: End Game screen.',
        source: { book: 'base', pages: '13' },
      },
    ],
  },
];
