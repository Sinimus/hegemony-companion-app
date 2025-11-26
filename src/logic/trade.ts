import type { PolicyLevel } from '@/types/game';

export const EXPORT_PRICES = {
  food: 10,
  luxury: 20,
  health: 15,
  education: 15,
  media: 15
};

export const BASE_IMPORT_PRICES: Record<string, number> = {
  food: 4, // Základní cena prodejci
  luxury: 6,
};

export const TARIFF_RATES: Record<PolicyLevel, Record<string, number>> = {
  A: { food: 10, luxury: 6 }, // Protectionism: Vysoké tarify
  B: { food: 5, luxury: 3 },  // Balanced: Střední tarify
  C: { food: 0, luxury: 0 },  // Free Trade: Nulové tarify
};

// V Hegemony základní exportní cena není přímo ovlivněna cly (ty platí importér),
// ale Business Deals a Foreign Trade policy určují limity.
// Pro kalkulačku uděláme jednoduchý odhad zisku.
export const calculateExportRevenue = (
  goods: number,
  type: keyof typeof EXPORT_PRICES
) => {
  return goods * EXPORT_PRICES[type];
};

/**
 * Vypočítá celkové náklady na import (základní cena + tarify).
 * @param goods Množství importovaného zboží.
 * @param type Typ zboží ('food' nebo 'luxury').
 * @param tradePolicy Aktuální Foreign Trade Policy (P6).
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

  const baseCost = goods * basePrice;       // Placeno do Supply
  const tariffCost = goods * tariffRate;     // Placeno Státu
  const totalCost = baseCost + tariffCost;

  return {
    baseCost,
    tariffCost,
    totalCost,
    tariffRate
  };
};