
// VAT rate (20%)
export const VAT_RATE = 0.20;

// Calculate TTC from HT
export const calculateTTC = (priceHT: string): string => {
  const ht = parseFloat(priceHT);
  return (ht + (ht * VAT_RATE)).toFixed(2);
};

// Calculate HT from TTC
export const calculateHT = (priceTTC: string): string => {
  const ttc = parseFloat(priceTTC);
  return (ttc / (1 + VAT_RATE)).toFixed(2);
};

// Format price to always have 2 decimal places
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numericPrice.toFixed(2);
};
