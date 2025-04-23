
// VAT rate (20%)
export const VAT_RATE = 0.20;

/**
 * Calculate TTC from HT with input sanitization
 * @param priceHT - The price without tax (HT)
 * @returns The price with tax (TTC) formatted with 2 decimal places
 */
export const calculateTTC = (priceHT: string): string => {
  // Validate and sanitize input
  const cleanPriceHT = priceHT.replace(/[^\d.,]/g, '').replace(',', '.');
  const ht = parseFloat(cleanPriceHT);
  
  if (isNaN(ht) || ht < 0) {
    return "0.00";
  }
  
  return (ht + (ht * VAT_RATE)).toFixed(2);
};

/**
 * Calculate HT from TTC with input sanitization
 * @param priceTTC - The price with tax (TTC)
 * @returns The price without tax (HT) formatted with 2 decimal places
 */
export const calculateHT = (priceTTC: string): string => {
  // Validate and sanitize input
  const cleanPriceTTC = priceTTC.replace(/[^\d.,]/g, '').replace(',', '.');
  const ttc = parseFloat(cleanPriceTTC);
  
  if (isNaN(ttc) || ttc < 0) {
    return "0.00";
  }
  
  return (ttc / (1 + VAT_RATE)).toFixed(2);
};

/**
 * Format price to always have 2 decimal places with input sanitization
 * @param price - The price to format
 * @returns The formatted price with 2 decimal places
 */
export const formatPrice = (price: number | string): string => {
  if (typeof price === 'string') {
    // Validate and sanitize input
    const cleanPrice = price.replace(/[^\d.,]/g, '').replace(',', '.');
    const numericPrice = parseFloat(cleanPrice);
    
    if (isNaN(numericPrice) || numericPrice < 0) {
      return "0.00";
    }
    
    return numericPrice.toFixed(2);
  }
  
  if (isNaN(price) || price < 0) {
    return "0.00";
  }
  
  return price.toFixed(2);
};
