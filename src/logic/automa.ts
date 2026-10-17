import type { PolicyLevel, PolicyType } from '@/types/game';

// Resources the Capitalist and Middle Class set prices for.
export type PricedResource = 'food' | 'luxury' | 'health' | 'education';

/**
 * Where an Automa puts its prices (C&C p. 11-12): the middle position, except
 * Foreign Trade A puts Food and Luxury at their highest, Health C puts Health at
 * its highest and Education C puts Education at its highest.
 */
export function automaPricePositions(
  policies: Record<PolicyType, PolicyLevel>
): Record<PricedResource, 'middle' | 'highest'> {
  return {
    food: policies.trade === 'A' ? 'highest' : 'middle',
    luxury: policies.trade === 'A' ? 'highest' : 'middle',
    health: policies.health === 'C' ? 'highest' : 'middle',
    education: policies.education === 'C' ? 'highest' : 'middle',
  };
}
