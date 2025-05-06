
/**
 * Extracts postal code and city from a full address string
 * @param address The full address string
 * @returns Object containing postal code and city
 */
export function extractPostalCodeAndCity(address: string | null): string {
  if (!address) return "Non spécifié";
  
  // Match French postal code (5 digits) followed by city name
  const postalCodeCityRegex = /\b(\d{5})\s+([A-Za-zÀ-ÖØ-öø-ÿ\s\-']+)(?:\s*,|\s*$)/;
  const match = address.match(postalCodeCityRegex);
  
  if (match) {
    const postalCode = match[1];
    const city = match[2].trim();
    return `${postalCode} ${city}`;
  }
  
  return "Non spécifié";
}

/**
 * Extract individual components from a full address
 * @param address Full address string
 * @returns Object with address components
 */
export function extractAddressParts(address: string | null): {
  streetNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
} {
  // Default empty result
  const result = {
    streetNumber: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'France' // Default country
  };
  
  if (!address) return result;
  
  // Extract postal code and city
  const postalCodeCityRegex = /\b(\d{5})\s+([A-Za-zÀ-ÖØ-öø-ÿ\s\-']+)(?:\s*,|\s*$)/;
  const postalCityMatch = address.match(postalCodeCityRegex);
  
  if (postalCityMatch) {
    result.postalCode = postalCityMatch[1];
    result.city = postalCityMatch[2].trim();
  }
  
  // Extract street number and street name
  // This is more complex, we'll do a simple extraction
  const streetRegex = /^([\d\-\/]*\s*[A-Za-z]*)[\s,]+(.+?)(?:\s*\d{5}|\s*$)/;
  const streetMatch = address.match(streetRegex);
  
  if (streetMatch) {
    const firstPart = streetMatch[1].trim();
    const numberMatch = firstPart.match(/^(\d+[\-\/\w]*)/);
    
    if (numberMatch) {
      result.streetNumber = numberMatch[1];
      result.street = firstPart.substring(numberMatch[1].length).trim() + " " + streetMatch[2].trim();
    } else {
      result.street = firstPart + " " + streetMatch[2].trim();
    }
  }
  
  // Extract country if present
  const countryMatch = address.match(/([A-Za-zÀ-ÖØ-öø-ÿ\s\-']+)$/);
  if (countryMatch && !postalCityMatch?.includes(countryMatch[1])) {
    const potentialCountry = countryMatch[1].trim();
    // List of common countries
    const countries = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Allemagne', 'Espagne', 'Italie'];
    if (countries.includes(potentialCountry)) {
      result.country = potentialCountry;
    }
  }
  
  return result;
}

// Add alias for backward compatibility
export const extractAddressComponents = extractAddressParts;
