
/**
 * Convertit un prix en chaîne de caractères formatée avec 2 décimales
 */
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numericPrice.toFixed(2);
};

/**
 * Calcule le prix TTC à partir du prix HT (TVA à 20%)
 */
export const calculateTTC = (priceHT: string | number): string => {
  const numericPrice = typeof priceHT === 'string' ? parseFloat(priceHT) : priceHT;
  const priceTTC = numericPrice * 1.2;
  return formatPrice(priceTTC);
};
