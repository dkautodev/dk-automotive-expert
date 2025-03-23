
// API pour récupérer les communes françaises par code postal
// Utilise l'API publique du gouvernement français (geo.api.gouv.fr)

export interface Commune {
  nom: string;
  code: string;
  codeDepartement: string;
  codeRegion: string;
}

// Fonction pour récupérer les communes par code postal
export const getCommunesByPostalCode = async (postalCode: string): Promise<Commune[]> => {
  if (!postalCode || postalCode.length < 5) {
    return [];
  }
  
  try {
    const response = await fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom,code,codeDepartement,codeRegion`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const data: Commune[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des communes:", error);
    return [];
  }
};
