
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { toast } from 'sonner';

export const useQuoteCalculations = (
  form: UseFormReturn<QuoteFormValues>,
  setDistance: (distance: number) => void,
  setPriceHT: (price: string) => void,
  setPriceTTC: (price: string) => void
) => {
  const { calculateDistance } = useDistanceCalculation();
  const { calculatePrice } = usePriceCalculation();

  const calculateQuote = async (data: Partial<QuoteFormValues>) => {
    try {
      // Validation des adresses
      if (!data.pickup_address || !data.delivery_address) {
        toast.error("Les adresses de départ et d'arrivée sont requises");
        return false;
      }
      
      if (!data.vehicle_type) {
        toast.error("Le type de véhicule est requis");
        return false;
      }
      
      // Calculer la distance
      const calculatedDistance = await calculateDistance(
        data.pickup_address!,
        data.delivery_address!
      );
      
      if (calculatedDistance <= 0) {
        toast.error("Impossible de calculer la distance entre ces adresses");
        return false;
      }
      
      console.log(`Distance calculée: ${calculatedDistance} km`);
      setDistance(calculatedDistance);
      
      // Calculer le prix en utilisant directement la table Supabase
      const priceResult = await calculatePrice(data.vehicle_type!, calculatedDistance);
      
      if (!priceResult) {
        toast.error("Impossible de calculer le prix pour ce type de véhicule et cette distance");
        return false;
      }
      
      // Mettre à jour les prix
      setPriceHT(priceResult.priceHT);
      setPriceTTC(priceResult.priceTTC);
      
      console.log(`Prix calculés: HT=${priceResult.priceHT}€, TTC=${priceResult.priceTTC}€, isPerKm=${priceResult.isPerKm}`);
      
      // Mettre à jour le formulaire avec ces valeurs
      form.setValue('distance', calculatedDistance.toString());
      form.setValue('price_ht', priceResult.priceHT);
      form.setValue('price_ttc', priceResult.priceTTC);

      return true;
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error("Erreur lors du calcul de la distance et du prix");
      return false;
    }
  };

  return { calculateQuote };
};
