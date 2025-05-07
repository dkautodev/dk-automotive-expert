
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

/**
 * Détermine la tranche de distance appropriée pour le calcul du prix
 */
export const getDistanceRangeId = (distance: number): string => {
  if (distance <= 10) return '1-10';
  if (distance <= 20) return '11-20';
  if (distance <= 30) return '21-30';
  if (distance <= 40) return '31-40';
  if (distance <= 50) return '41-50';
  if (distance <= 60) return '51-60';
  if (distance <= 70) return '61-70';
  if (distance <= 80) return '71-80';
  if (distance <= 90) return '81-90';
  if (distance <= 100) return '91-100';
  if (distance <= 200) return '101-200';
  if (distance <= 300) return '201-300';
  if (distance <= 400) return '301-400';
  if (distance <= 500) return '401-500';
  if (distance <= 600) return '501-600';
  if (distance <= 700) return '601-700';
  return '701+';
};
