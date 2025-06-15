import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, RefreshCcw } from 'lucide-react';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { useRef } from 'react';
import { toast } from 'sonner';
import { useGoogleAutocomplete } from "@/hooks/useGoogleAutocomplete";
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { PickupAddressField } from './PickupAddressField';
import { DeliveryAddressField } from './DeliveryAddressField';

interface NewAddressVehicleStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  distance: number | null;
  priceHT: string | null;
  priceTTC: string | null;
  setDistance: (distance: number | null) => void;
  setPriceHT: (price: string | null) => void;
  setPriceTTC: (price: string | null) => void;
}

const NewAddressVehicleStep = ({
  form,
  onNext,
  distance,
  priceHT,
  priceTTC,
  setDistance,
  setPriceHT,
  setPriceTTC
}: NewAddressVehicleStepProps) => {
  const {
    calculatePrice,
    isCalculating
  } = usePriceCalculation();
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  // Autocomplétion pour les champs
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

  const handleCalculate = async () => {
    const pickupAddress = form.getValues('pickup_address');
    const deliveryAddress = form.getValues('delivery_address');
    const vehicleType = form.getValues('vehicle_type');
    if (!pickupAddress || !deliveryAddress || !vehicleType) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error('Clé API Google Maps non configurée');
      return;
    }
    try {
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

      const priceResult = await calculatePrice(distanceInKm, vehicleType);
      if (!priceResult) {
        return;
      }
      setPriceHT(priceResult.priceHT);
      setPriceTTC(priceResult.priceTTC);
      toast.success('Distance et prix calculés avec succès');
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error('Erreur lors du calcul de la distance et du prix');
    }
  };

  const handleNext = () => {
    if (!distance) {
      toast.error('Veuillez d\'abord calculer la distance et le prix');
      return;
    }
    const data = {
      pickup_address: form.getValues('pickup_address'),
      delivery_address: form.getValues('delivery_address'),
      vehicle_type: form.getValues('vehicle_type')
    };
    onNext(data);
  };

  const handleSwitchAddresses = () => {
    const pickup = form.getValues('pickup_address');
    const delivery = form.getValues('delivery_address');
    form.setValue('pickup_address', delivery || '', { shouldValidate: true });
    form.setValue('delivery_address', pickup || '', { shouldValidate: true });
    // Annule les calculs précédents, car le contexte a changé
    setDistance(null);
    setPriceHT(null);
    setPriceTTC(null);
    toast.success("Les adresses ont été échangées !");
  };

  const pickupAddress = form.watch('pickup_address');
  const deliveryAddress = form.watch('delivery_address');
  const vehicleType = form.watch('vehicle_type');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Adresses et catégorie de véhicule</h2>
      {/* Bloc de saisie d'adresses avec bouton échange */}
      <div className="relative flex flex-col md:flex-row items-stretch gap-0">
        <div className="w-full md:w-1/2 px-0 md:pr-6">
          <PickupAddressField form={form} pickupAuto={pickupAuto} pickupInputRef={pickupInputRef} />
        </div>
        {/* Le bouton échange, positionné absolument au centre vertical et horizontal */}
        <div className="flex justify-center items-center md:block">
          <button
            type="button"
            aria-label="Échanger les adresses"
            onClick={handleSwitchAddresses}
            className="
              absolute 
              left-1/2 top-1/2 
              -translate-x-1/2 -translate-y-1/2
              z-30
              bg-white border border-gray-300 rounded-full shadow
              p-2 flex items-center justify-center
              hover:bg-gray-100 active:bg-gray-200
              transition
            "
            style={{ width: '40px', height: '40px' }}
          >
            <RefreshCcw className="w-6 h-6 text-[#1a237e]" />
          </button>
        </div>
        <div className="w-full md:w-1/2 px-0 md:pl-6">
          <DeliveryAddressField form={form} deliveryAuto={deliveryAuto} deliveryInputRef={deliveryInputRef} />
        </div>
      </div>
      <FormField control={form.control} name="vehicle_type" render={({
        field
      }) => (
        <FormItem>
          <FormLabel className="text-dk-navy font-semibold">
            CATÉGORIE DE VÉHICULE (GRILLE TARIFAIRE) *
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="bg-[#EEF1FF]">
                <SelectValue placeholder="Sélectionner une catégorie de véhicule" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {vehicleTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleCalculate}
          disabled={!pickupAddress || !deliveryAddress || !vehicleType || isCalculating}
          className="bg-[#1a237e] hover:bg-[#3f51b5] flex items-center gap-2"
        >
          <Calculator className="h-5 w-5" />
          {isCalculating ? "Calcul en cours..." : "Calculer la distance et le prix"}
        </Button>
      </div>
      {distance && priceHT && priceTTC && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
          <h3 className="font-semibold text-green-800 mb-2">Résultat du calcul</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Distance:</span>
              <p className="font-semibold">{distance} km</p>
            </div>
            <div>
              <span className="text-gray-600">Prix HT:</span>
              <p className="font-semibold">{priceHT} €</p>
            </div>
            <div>
              <span className="text-gray-600">Prix TTC:</span>
              <p className="font-semibold">{priceTTC} €</p>
            </div>
          </div>
          {/* Bloc des 3 items avec émojis */}
          <ul className="mt-4 space-y-1 text-[15px]">
            <li className="flex items-center gap-2">
              <span role="img" aria-label="pense-bête">💡</span>
              Tous frais inclus
            </li>
            <li className="flex items-center gap-2">
              <span role="img" aria-label="chauffeur">🚗</span>
              Livraison par chauffeur professionnel
            </li>
            <li className="flex items-center gap-2">
              <span role="img" aria-label="assurance">🛡️</span>
              Assurance tous risques
            </li>
          </ul>
        </div>
      )}
      <div className="flex justify-end mt-6">
        <Button type="button" onClick={handleNext} disabled={!distance} className="bg-[#1a237e] hover:bg-[#3f51b5]">
          SUIVANT
        </Button>
      </div>
    </div>
  );
};
export default NewAddressVehicleStep;
