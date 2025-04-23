
import { useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { toast } from 'sonner';
import { useGoogleMapsApi } from './useGoogleMapsApi';

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { isLoaded } = useGoogleMapsApi({ libraries: ['places'] });
  
  const calculateDistance = async (originAddress: string, destinationAddress: string): Promise<number> => {
    if (!isLoaded) {
      toast.error("Google Maps API n'est pas encore chargée");
      throw new Error("Google Maps API not loaded");
    }
    
    try {
      setIsCalculating(true);
      console.log(`Calcul de distance entre ${originAddress} et ${destinationAddress}`);
      
      const service = new google.maps.DistanceMatrixService();
      
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [originAddress],
            destinations: [destinationAddress],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            region: 'fr'
          },
          (response, status) => {
            if (status === 'OK') resolve(response);
            else reject(new Error(`Erreur Google Maps: ${status}`));
          }
        );
      });
      
      const element = response.rows[0].elements[0];
      
      if (element.status === 'ZERO_RESULTS' || element.status === 'NOT_FOUND') {
        throw new Error("Trajet impossible à calculer");
      }
      
      if (element.status === 'OK') {
        return Math.round(element.distance.value / 1000); // Convertir en kilomètres
      }
      
      throw new Error(`Impossible de calculer la distance: ${element.status}`);
    } catch (error: any) {
      console.error('Erreur lors du calcul de la distance:', error);
      toast.error(error.message || "Erreur lors du calcul de la distance");
      throw error;
    } finally {
      setIsCalculating(false);
    }
  };
  
  return {
    calculateDistance,
    isCalculating,
    isLoaded
  };
};
