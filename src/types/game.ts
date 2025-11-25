export type PlayerClass = 'working' | 'middle' | 'capitalist' | 'state';
export type PolicyLevel = 'A' | 'B' | 'C';
export type PolicyType = 'fiscal' | 'labor' | 'tax' | 'health' | 'education' | 'trade' | 'immigration';

export interface Policy {
  type: PolicyType;
  level: PolicyLevel;
  name: string;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  class: PlayerClass;
  resources: {
    money: number;
    workers: number;
  };
}

export interface GameState {
  players: Player[];
  policies: Policy[];
  round: number;
}