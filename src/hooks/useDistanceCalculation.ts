
import { useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  
  const calculateDistance = async (originAddress: string, destinationAddress: string): Promise<number> => {
    try {
      setIsCalculating(true);
      
      if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Clé API Google Maps non configurée, utilisation d'une distance aléatoire");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const randomDistance = Math.floor(Math.random() * 496) + 5; // Entre 5 et 500 km
        setIsCalculating(false);
        return randomDistance;
      }
      
      // Créer une instance du service Distance Matrix
      const service = new google.maps.DistanceMatrixService();
      
      // Demander la distance entre l'origine et la destination
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [originAddress],
            destinations: [destinationAddress],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            if (status === 'OK') {
              resolve(response);
            } else {
              reject(new Error(`Erreur lors du calcul de la distance: ${status}`));
            }
          }
        );
      });
      
      // Extraire la distance du résultat
      const element = response.rows[0].elements[0];
      
      if (element.status === 'OK') {
        // Convertir la distance en kilomètres (retirée en mètres)
        const distanceInKm = Math.round(element.distance.value / 1000);
        setIsCalculating(false);
        return distanceInKm;
      } else {
        console.error('Impossible de calculer la distance:', element.status);
        // Fallback vers une distance aléatoire en cas d'erreur
        const randomDistance = Math.floor(Math.random() * 496) + 5;
        setIsCalculating(false);
        return randomDistance;
      }
    } catch (error) {
      setIsCalculating(false);
      console.error('Erreur lors du calcul de la distance:', error);
      // Fallback vers une distance aléatoire en cas d'erreur
      const randomDistance = Math.floor(Math.random() * 496) + 5;
      return randomDistance;
    }
  };
  
  return {
    calculateDistance,
    isCalculating
  };
};
