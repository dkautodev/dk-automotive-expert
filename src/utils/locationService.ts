
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

/**
 * Interface pour représenter une commune française
 */
export interface Commune {
  nom: string;
  code: string;
  codesPostaux: string[];
  population: number;
}

/**
 * Récupère les communes par code postal
 */
export const getCommunesByPostalCode = async (postalCode: string): Promise<Commune[]> => {
  console.log("Recherche de communes pour le code postal:", postalCode);

  // Données de repli en cas d'indisponibilité de l'API
  const getFallbackData = (): Commune[] => {
    const codeRegion = postalCode.substring(0, 2);
    const commonRegions: Record<string, Commune> = {
      "75": { nom: "Paris", code: "75056", codesPostaux: [postalCode], population: 2100000 },
      "69": { nom: "Lyon", code: "69123", codesPostaux: [postalCode], population: 500000 },
      "13": { nom: "Marseille", code: "13055", codesPostaux: [postalCode], population: 870000 },
      "33": { nom: "Bordeaux", code: "33063", codesPostaux: [postalCode], population: 250000 },
      "59": { nom: "Lille", code: "59350", codesPostaux: [postalCode], population: 230000 }
    };

    return [commonRegions[codeRegion] || { 
      nom: `Ville-${postalCode}`, 
      code: postalCode, 
      codesPostaux: [postalCode], 
      population: 10000 
    }];
  };
  
  // Utiliser les données de repli si pas de clé API
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Clé API Google Maps non configurée, utilisation de données de repli");
    return getFallbackData();
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${postalCode}|country:FR&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results?.length) {
      return getFallbackData();
    }
    
    // Transformation des résultats en communes
    const communes: Commune[] = [];
    
    for (const result of data.results) {
      let communeName = '';
      let communeCode = '';
      
      for (const component of result.address_components) {
        if (component.types.includes('locality')) {
          communeName = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          communeCode = component.short_name;
        }
      }
      
      if (communeName) {
        communes.push({
          nom: communeName,
          code: communeCode || postalCode,
          codesPostaux: [postalCode],
          population: 0
        });
      }
    }
    
    return communes.length ? communes : getFallbackData();
  } catch (error) {
    console.error('Erreur lors de la récupération des données de localisation:', error);
    return getFallbackData();
  }
};
