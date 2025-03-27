
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

/**
 * Commune interface representing a French municipality
 */
export interface Commune {
  nom: string;
  code: string;
  codesPostaux: string[];
  population: number;
}

/**
 * Gets communes by postal code using Google Maps Geocoding API
 */
export const getCommunesByPostalCode = async (postalCode: string): Promise<Commune[]> => {
  console.log("Getting communes for postal code:", postalCode);

  // Fallback data for simulation when API key is not available
  const getFallbackData = () => {
    switch (postalCode.substring(0, 2)) {
      case "75":
        return [
          { nom: "Paris", code: "75056", codesPostaux: [postalCode], population: 2100000 }
        ];
      case "69":
        return [
          { nom: "Lyon", code: "69123", codesPostaux: [postalCode], population: 500000 }
        ];
      case "13":
        return [
          { nom: "Marseille", code: "13055", codesPostaux: [postalCode], population: 870000 }
        ];
      case "33":
        return [
          { nom: "Bordeaux", code: "33063", codesPostaux: [postalCode], population: 250000 }
        ];
      case "59":
        return [
          { nom: "Lille", code: "59350", codesPostaux: [postalCode], population: 230000 }
        ];
      default:
        return [
          { nom: `Ville-${postalCode}`, code: postalCode, codesPostaux: [postalCode], population: 10000 }
        ];
    }
  };
  
  // If no API key is configured, use fallback data
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key not configured, using fallback data");
    return getFallbackData();
  }
  
  try {
    // Use Google Maps Geocoding API to get location data
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${postalCode}|country:FR&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.warn(`No results found for postal code ${postalCode}, using fallback data`);
      return getFallbackData();
    }
    
    // Process results to extract commune info
    const communes: Commune[] = [];
    
    for (const result of data.results) {
      let communeName = '';
      let communeCode = '';
      
      // Extract locality from address components
      for (const component of result.address_components) {
        if (component.types.includes('locality')) {
          communeName = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          communeCode = component.short_name;
        }
      }
      
      // Only add if we found a commune name
      if (communeName) {
        communes.push({
          nom: communeName,
          code: communeCode || postalCode,
          codesPostaux: [postalCode],
          population: 0 // Population data not available from Google API
        });
      }
    }
    
    // If no communes were found, use fallback data
    if (communes.length === 0) {
      return getFallbackData();
    }
    
    return communes;
    
  } catch (error) {
    console.error('Error fetching location data:', error);
    return getFallbackData();
  }
};
