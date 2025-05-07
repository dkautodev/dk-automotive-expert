
import { useState } from "react";
import { toast } from 'sonner';

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  /**
   * Calcule la distance entre deux adresses
   * Version simplifiée pour le projet sans Supabase
   */
  const calculateDistance = async (origin: string, destination: string): Promise<number> => {
    try {
      setIsCalculating(true);
      console.log(`Calculer la distance entre ${origin} et ${destination}`);
      
      // Simulation d'un appel API avec délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Génère une distance aléatoire entre 5 et 500 km
      const randomDistance = Math.floor(Math.random() * (500 - 5 + 1)) + 5;
      
      console.log(`Distance calculée: ${randomDistance} km`);
      return randomDistance;
    } catch (error) {
      console.error('Erreur lors du calcul de la distance:', error);
      toast.error('Impossible de calculer la distance. Veuillez réessayer.');
      return 0;
    } finally {
      setIsCalculating(false);
    }
  };
  
  return { 
    calculateDistance,
    isLoaded,
    isCalculating
  };
};
