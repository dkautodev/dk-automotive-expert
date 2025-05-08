
/**
 * Calcule le prix TTC à partir du prix HT
 */
export const calculateTTC = (priceHT: string): string => {
  const priceAsNumber = parseFloat(priceHT);
  if (isNaN(priceAsNumber)) return '0.00';
  
  const priceTTC = priceAsNumber * 1.2;
  return formatPrice(priceTTC);
};

/**
 * Formate un prix avec 2 décimales
 */
export const formatPrice = (price: number | string): string => {
  const priceAsNumber = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(priceAsNumber)) return '0.00';
  
  return priceAsNumber.toFixed(2);
};
