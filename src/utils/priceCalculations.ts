
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

/**
 * Détermine la tranche de distance pour un prix
 * Note: Cette fonction est conservée pour les composants qui pourraient l'utiliser
 * mais n'est plus utilisée pour les calculs de prix réels
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
