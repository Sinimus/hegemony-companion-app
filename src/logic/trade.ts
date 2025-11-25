export const EXPORT_PRICES = {
  food: 10,
  luxury: 20,
  health: 15,
  education: 15,
  media: 15
};

export const TARIFFS = {
  A: 5, // Protectionism (Vysoká cla - platíš hodně za import, ale export může být ovlivněn Business Deals)
  B: 2,
  C: 0  // Free Trade
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