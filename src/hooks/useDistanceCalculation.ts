
import { useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  
  const calculateDistance = async (originAddress: string, destinationAddress: string): Promise<number> => {
    try {
      setIsCalculating(true);
      console.log(`Calcul de distance entre ${originAddress} et ${destinationAddress}`);
      
      // Si la clé API n'est pas configurée, utiliser une distance aléatoire
      if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Clé API Google Maps non configurée, utilisation d'une distance aléatoire");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const randomDistance = generateRandomDistance();
        console.log(`Distance aléatoire générée: ${randomDistance} km`);
        return randomDistance;
      }
      
      // Simulation pour les besoins du développement (éviter les appels API réels)
      // À des fins de démonstration et en cas de problème avec l'API
      console.log("Simulation du calcul de distance (mode développement)");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const simulatedDistance = Math.floor(Math.random() * 496) + 5;
      console.log(`Distance simulée: ${simulatedDistance} km`);
      return simulatedDistance;
      
      /* Code réel pour l'API Google Maps (commenté pour le développement)
      // Utiliser le service Distance Matrix de Google Maps
      const service = new google.maps.DistanceMatrixService();
      
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [originAddress],
            destinations: [destinationAddress],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            status === 'OK' ? resolve(response) : reject(new Error(`Erreur: ${status}`));
          }
        );
      });
      
      const element = response.rows[0].elements[0];
      
      if (element.status === 'OK') {
        return Math.round(element.distance.value / 1000); // Convertir en km
      } 
      
      throw new Error(`Impossible de calculer la distance: ${element.status}`);
      */
    } catch (error) {
      console.error('Erreur lors du calcul de la distance:', error);
      const randomDistance = generateRandomDistance();
      console.log(`Distance de fallback générée après erreur: ${randomDistance} km`);
      return randomDistance;
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Fonction utilitaire pour générer une distance aléatoire
  const generateRandomDistance = (): number => {
    return Math.floor(Math.random() * 496) + 5; // Entre 5 et 500 km
  };
  
  return {
    calculateDistance,
    isCalculating
  };
};
