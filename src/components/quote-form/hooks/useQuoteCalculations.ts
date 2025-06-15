
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { toast } from 'sonner';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

export const useQuoteCalculations = (
  form: UseFormReturn<QuoteFormValues>,
  setDistance: (distance: number | null) => void,
  setPriceHT: (price: string | null) => void,
  setPriceTTC: (price: string | null) => void,
  setIsPerKm: (isPerKm: boolean) => void
) => {
  const { calculatePrice, isCalculating } = usePriceCalculation();

  const calculateQuote = async (data: Partial<QuoteFormValues>): Promise<boolean> => {
    const pickupAddress = data.pickup_address || form.getValues('pickup_address');
    const deliveryAddress = data.delivery_address || form.getValues('delivery_address');
    const vehicleType = data.vehicle_type || form.getValues('vehicle_type');

    if (!pickupAddress || !deliveryAddress || !vehicleType) {
      toast.error('Veuillez remplir tous les champs requis');
      return false;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      toast.error('Clé API Google Maps non configurée');
      return false;
    }

    try {
      // Calculer la distance avec Google Maps
      const service = new google.maps.DistanceMatrixService();
      
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix({
          origins: [pickupAddress],
          destinations: [deliveryAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            resolve(response);
          } else {
            reject(new Error(`Erreur Google Maps: ${status}`));
          }
        });
      });

      const element = response.rows[0]?.elements[0];
      if (!element || element.status !== 'OK') {
        throw new Error('Impossible de calculer la distance');
      }

      const distanceInKm = Math.ceil(element.distance.value / 1000);
      setDistance(distanceInKm);

      // Calculer le prix
      const priceResult = await calculatePrice(distanceInKm, vehicleType);
      if (!priceResult) {
        return false;
      }

      setPriceHT(priceResult.priceHT);
      setPriceTTC(priceResult.priceTTC);
      setIsPerKm(priceResult.isPerKm);

      toast.success('Distance et prix calculés avec succès');
      return true;

    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error('Erreur lors du calcul de la distance et du prix');
      return false;
    }
  };

  return {
    calculateQuote,
    isCalculating
  };
};
