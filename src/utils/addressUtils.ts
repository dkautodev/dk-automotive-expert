
interface AddressComponents {
  streetNumber: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
}

/**
 * Extract components from a formatted address string
 */
export const extractAddressParts = (address: string): AddressComponents => {
  console.log("Extracting address parts from:", address);
  
  // Simple regex for postal code in France (5 digits)
  const postalCodeMatch = address.match(/\b\d{5}\b/);
  
  // Default result
  const result: AddressComponents = {
    streetNumber: null,
    postalCode: postalCodeMatch ? postalCodeMatch[0] : null,
    city: null,
    country: "France"
  };
  
  // If we have a postal code, try to find the city
  if (result.postalCode) {
    // City is often after the postal code
    const postalCodeIndex = address.indexOf(result.postalCode);
    if (postalCodeIndex !== -1) {
      // Extract everything after the postal code until the end or a comma
      const afterPostalCode = address.substring(postalCodeIndex + result.postalCode.length).trim();
      const cityMatch = afterPostalCode.match(/^([^,]+)/);
      if (cityMatch) {
        result.city = cityMatch[1].trim();
      }
    }
  }
  
  // Try to extract street number (usually at the beginning)
  const streetNumberMatch = address.match(/^\s*(\d+)\s/);
  if (streetNumberMatch) {
    result.streetNumber = streetNumberMatch[1];
  }
  
  console.log("Extracted address components:", result);
  
  return result;
};
