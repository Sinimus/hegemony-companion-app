import type { PolicyLevel } from '@/types/game';

export const BASE_IMPORT_PRICES: Record<string, number> = {
  food: 4, // Base price paid to the Supply
  luxury: 6,
};

export const TARIFF_RATES: Record<PolicyLevel, Record<string, number>> = {
  A: { food: 10, luxury: 6 }, // Protectionism: high tariffs
  B: { food: 5, luxury: 3 },  // Balanced: medium tariffs
  C: { food: 0, luxury: 0 },  // Free Trade: no tariffs
};

/**
 * Calculates the total import cost (base price + tariffs).
 * @param goods Quantity of imported goods.
 * @param type Type of goods ('food' or 'luxury').
 * @param tradePolicy Current Foreign Trade Policy (P6).
 */
export const calculateImportCost = (
  goods: number,
  type: 'food' | 'luxury',
  tradePolicy: PolicyLevel
) => {
  if (goods <= 0) {
    return { baseCost: 0, tariffCost: 0, totalCost: 0, tariffRate: 0 };
  }

  const basePrice = BASE_IMPORT_PRICES[type];
  const tariffRate = TARIFF_RATES[tradePolicy][type];

  const baseCost = goods * basePrice;       // Paid to the Supply
  const tariffCost = goods * tariffRate;     // Paid to the State
  const totalCost = baseCost + tariffCost;

  return {
    baseCost,
    tariffCost,
    totalCost,
    tariffRate
  };
};