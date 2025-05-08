
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { calculatePrice } from '@/utils/priceCalculator';
import { toast } from 'sonner';
import { getDistanceFromLatLonInKm } from '@/hooks/useDistanceCalculation';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { useState } from 'react';

export const useQuoteCalculations = (
  form: UseFormReturn<QuoteFormValues>,
  setDistance: (distance: number) => void,
  setPriceHT: (price: string) => void,
  setPriceTTC: (price: string) => void,
  setIsPerKm: (isPerKm: boolean) => void
) => {
  const { isLoaded } = useGoogleMapsApi();
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateQuote = async (data: Partial<QuoteFormValues>): Promise<boolean> => {
    if (!isLoaded) {
      toast.error("L'API Google Maps n'est pas chargée. Veuillez réessayer.");
      return false;
    }

    if (!data.pickup_address || !data.delivery_address || !data.vehicle_type) {
      toast.error("Veuillez remplir toutes les adresses et sélectionner un type de véhicule.");
      return false;
    }

    setIsCalculating(true);
    
    try {
      // Convertir les adresses en coordonnées
      const geocoder = new google.maps.Geocoder();
      
      // Obtenir les coordonnées de l'adresse de départ
      const pickupCoordinates = await new Promise<google.maps.LatLng>((resolve, reject) => {
        geocoder.geocode({ address: data.pickup_address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error(`Erreur lors de la géocodification de l'adresse de départ: ${status}`));
          }
        });
      });
      
      // Obtenir les coordonnées de l'adresse de livraison
      const deliveryCoordinates = await new Promise<google.maps.LatLng>((resolve, reject) => {
        geocoder.geocode({ address: data.delivery_address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error(`Erreur lors de la géocodification de l'adresse de livraison: ${status}`));
          }
        });
      });
      
      // Calculer la distance entre les deux points
      const distanceInKm = getDistanceFromLatLonInKm(
        pickupCoordinates.lat(),
        pickupCoordinates.lng(),
        deliveryCoordinates.lat(),
        deliveryCoordinates.lng()
      );
      
      const distance = Math.round(distanceInKm);
      console.log(`Distance calculated: ${distance} km`);
      
      // Mettre à jour l'état avec la distance calculée
      setDistance(distance);
      
      // Calculer le prix en fonction du type de véhicule et de la distance
      const { priceHT, priceTTC, isPerKm, error } = await calculatePrice(data.vehicle_type, distance);
      
      if (error) {
        toast.error(`Erreur lors du calcul du prix: ${error}`);
        return false;
      }
      
      // Mettre à jour les états avec les prix calculés
      setPriceHT(priceHT);
      setPriceTTC(priceTTC);
      setIsPerKm(isPerKm);
      
      console.log(`Price calculated - HT: ${priceHT}€, TTC: ${priceTTC}€, isPerKm: ${isPerKm}`);
      
      return true;
    } catch (error: any) {
      console.error('Error calculating quote:', error);
      toast.error(`Erreur lors du calcul du devis: ${error.message}`);
      return false;
    } finally {
      setIsCalculating(false);
    }
  };

  return { calculateQuote, isCalculating };
};
