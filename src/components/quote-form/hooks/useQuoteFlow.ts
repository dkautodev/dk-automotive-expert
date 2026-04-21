import { useCallback, useEffect, useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { useGoogleAutocomplete } from "@/hooks/useGoogleAutocomplete";
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { toast } from 'sonner';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface UseQuoteFlowProps {
  form: UseFormReturn<QuoteFormValues>;
  setDistance: (distance: number | null) => void;
  setPriceHT: (price: string | null) => void;
  setPriceTTC: (price: string | null) => void;
}

export const useQuoteFlow = ({
  form,
  setDistance,
  setPriceHT,
  setPriceTTC
}: UseQuoteFlowProps) => {
  const { calculatePrice, isCalculating } = usePriceCalculation();
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  const [lastCalculatedValues, setLastCalculatedValues] = useState({
    pickup: '',
    delivery: '',
    vehicle: ''
  });

  // Autocomplete Setup
  const pickupAuto = useGoogleAutocomplete({
    ref: pickupInputRef,
    onPlaceSelected: place => {
      if (place && place.formatted_address) {
        form.setValue("pickup_address", place.formatted_address, { shouldValidate: true });
      }
    },
    types: ["geocode", "establishment"]
  });

  const deliveryAuto = useGoogleAutocomplete({
    ref: deliveryInputRef,
    onPlaceSelected: place => {
      if (place && place.formatted_address) {
        form.setValue("delivery_address", place.formatted_address, { shouldValidate: true });
      }
    },
    types: ["geocode", "establishment"]
  });

  // Calculation Logic
  const handleCalculate = useCallback(async (isManual = false) => {
    const pAddress = form.getValues('pickup_address');
    const dAddress = form.getValues('delivery_address');
    const vType = form.getValues('vehicle_type');

    if (!pAddress || !dAddress || !vType) return;
    
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error('Clé API Google Maps non configurée');
      return;
    }

    // Éviter de recalculer si les valeurs n'ont pas changé
    if (!isManual && 
        pAddress === lastCalculatedValues.pickup && 
        dAddress === lastCalculatedValues.delivery && 
        vType === lastCalculatedValues.vehicle) {
      return;
    }

    try {
      const service = new google.maps.DistanceMatrixService();
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix({
          origins: [pAddress],
          destinations: [dAddress],
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

      const priceResult = await calculatePrice(distanceInKm, vType);
      if (!priceResult) return;

      setPriceHT(priceResult.priceHT);
      setPriceTTC(priceResult.priceTTC);
      
      setLastCalculatedValues({
        pickup: pAddress,
        delivery: dAddress,
        vehicle: vType
      });

      if (isManual) {
        toast.success('Distance et prix calculés avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error('Erreur lors du calcul de la distance et du prix');
    }
  }, [form, lastCalculatedValues, calculatePrice, setDistance, setPriceHT, setPriceTTC]);

  // Automated trigger
  const pickupAddress = form.watch('pickup_address');
  const deliveryAddress = form.watch('delivery_address');
  const vehicleType = form.watch('vehicle_type');

  useEffect(() => {
    const canCalculate = pickupAddress && deliveryAddress && vehicleType;
    if (!canCalculate) return;

    const timer = setTimeout(() => {
      handleCalculate();
    }, 800);

    return () => clearTimeout(timer);
  }, [pickupAddress, deliveryAddress, vehicleType, handleCalculate]);

  const handleSwitchAddresses = () => {
    const pickup = form.getValues('pickup_address');
    const delivery = form.getValues('delivery_address');
    form.setValue('pickup_address', delivery || '', { shouldValidate: true });
    form.setValue('delivery_address', pickup || '', { shouldValidate: true });
    setDistance(null);
    setPriceHT(null);
    setPriceTTC(null);
    toast.success("Les adresses ont été échangées !");
  };

  return {
    isCalculating,
    pickupInputRef,
    deliveryInputRef,
    pickupAuto,
    deliveryAuto,
    handleSwitchAddresses,
    handleCalculate,
    pickupAddress,
    deliveryAddress,
    vehicleType
  };
};
