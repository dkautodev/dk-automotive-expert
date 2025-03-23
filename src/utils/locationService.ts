
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
 * Placeholder function that simulates getting communes by postal code
 * No longer uses Google Maps API
 */
export const getCommunesByPostalCode = async (postalCode: string): Promise<Commune[]> => {
  console.log("Getting communes for postal code:", postalCode);
  
  // Simulate a short delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a default commune based on postal code
  // This is just a placeholder and not real data
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
