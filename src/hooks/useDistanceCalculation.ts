
import { useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { toast } from 'sonner';

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  
  const calculateDistance = async (originAddress: string, destinationAddress: string): Promise<number> => {
    try {
      setIsCalculating(true);
      console.log(`Calcul de distance entre ${originAddress} et ${destinationAddress}`);
      
      // Si la clé API n'est pas configurée, afficher une erreur
      if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Clé API Google Maps non configurée");
        toast.error("Clé API Google Maps non configurée, impossible de calculer la distance");
        throw new Error("Clé API Google Maps non configurée");
      }
      
      // Utiliser le service Distance Matrix de Google Maps
      const service = new google.maps.DistanceMatrixService();
      
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [originAddress],
            destinations: [destinationAddress],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,  // Par défaut, ne pas éviter les péages
            region: 'fr',       // Se concentrer sur la France/Europe
          },
          (response, status) => {
            status === 'OK' ? resolve(response) : reject(new Error(`Erreur Google Maps: ${status}`));
          }
        );
      });
      
      const element = response.rows[0].elements[0];
      
      // Vérifier si le trajet est possible par route
      if (element.status === 'ZERO_RESULTS' || element.status === 'NOT_FOUND') {
        throw new Error("Trajet impossible à calculer");
      }
      
      // Vérifier si le voyage nécessite un ferry
      if (element.status === 'OK') {
        // Vérifier la présence d'un ferry dans le trajet (basé sur la distance et la durée)
        const distanceKm = Math.round(element.distance.value / 1000);
        const durationMinutes = Math.round(element.duration.value / 60);
        
        // Si la vitesse moyenne est supérieure à 100 km/h, c'est probablement un trajet en ferry
        // (Cette heuristique est approximative et peut être ajustée)
        const averageSpeedKmh = (distanceKm / durationMinutes) * 60;
        if (averageSpeedKmh > 100) {
          throw new Error("Ce trajet nécessite un ferry ou un bateau. Veuillez contacter DKAUTOMOTIVE pour votre devis.");
        }
        
        return distanceKm;
      }
      
      throw new Error(`Impossible de calculer la distance: ${element.status}`);
    } catch (error: any) {
      console.error('Erreur lors du calcul de la distance:', error);
      
      // Message spécifique pour les trajets en ferry
      if (error.message?.includes("ferry") || error.message?.includes("bateau")) {
        toast.error("Ce trajet nécessite un ferry ou un bateau. Veuillez contacter DKAUTOMOTIVE pour votre devis.");
        throw error;
      }
      
      // Pour les autres erreurs
      toast.error(error.message || "Erreur lors du calcul de la distance");
      throw error;
    } finally {
      setIsCalculating(false);
    }
  };
  
  const calculateDistanceWithAvoidTolls = async (originAddress: string, destinationAddress: string, avoidTolls: boolean): Promise<number> => {
    try {
      setIsCalculating(true);
      console.log(`Calcul de distance entre ${originAddress} et ${destinationAddress} (éviter péages: ${avoidTolls})`);
      
      if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Clé API Google Maps non configurée");
        toast.error("Clé API Google Maps non configurée, impossible de calculer la distance");
        throw new Error("Clé API Google Maps non configurée");
      }
      
      const service = new google.maps.DistanceMatrixService();
      
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [originAddress],
            destinations: [destinationAddress],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: avoidTolls,
            region: 'fr',  // Centré sur la France/Europe
          },
          (response, status) => {
            status === 'OK' ? resolve(response) : reject(new Error(`Erreur Google Maps: ${status}`));
          }
        );
      });
      
      const element = response.rows[0].elements[0];
      
      if (element.status === 'ZERO_RESULTS' || element.status === 'NOT_FOUND') {
        throw new Error("Trajet impossible à calculer");
      }
      
      if (element.status === 'OK') {
        const distanceKm = Math.round(element.distance.value / 1000);
        const durationMinutes = Math.round(element.duration.value / 60);
        
        const averageSpeedKmh = (distanceKm / durationMinutes) * 60;
        if (averageSpeedKmh > 100) {
          throw new Error("Ce trajet nécessite un ferry ou un bateau. Veuillez contacter DKAUTOMOTIVE pour votre devis.");
        }
        
        return distanceKm;
      }
      
      throw new Error(`Impossible de calculer la distance: ${element.status}`);
    } catch (error: any) {
      console.error('Erreur lors du calcul de la distance:', error);
      
      if (error.message?.includes("ferry") || error.message?.includes("bateau")) {
        toast.error("Ce trajet nécessite un ferry ou un bateau. Veuillez contacter DKAUTOMOTIVE pour votre devis.");
      } else {
        toast.error(error.message || "Erreur lors du calcul de la distance");
      }
      
      throw error;
    } finally {
      setIsCalculating(false);
    }
  };
  
  return {
    calculateDistance,
    calculateDistanceWithAvoidTolls,
    isCalculating
  };
};
