
import { useState } from 'react';

// Simule le calcul de distance en attendant l'intégration Google Maps
export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  
  const calculateDistance = async (originAddress: string, destinationAddress: string): Promise<number> => {
    try {
      setIsCalculating(true);
      
      // TODO: À remplacer par l'appel à l'API Google Maps quand elle sera installée
      // Pour le moment, on simule un délai et on génère une distance aléatoire entre 5 et 500 km
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulation d'une distance
      // Cette partie sera remplacée par le vrai calcul avec Google Maps
      const randomDistance = Math.floor(Math.random() * 496) + 5; // Entre 5 et 500 km
      
      setIsCalculating(false);
      return randomDistance;
    } catch (error) {
      setIsCalculating(false);
      console.error('Erreur lors du calcul de la distance:', error);
      throw error;
    }
  };
  
  return {
    calculateDistance,
    isCalculating
  };
};
