import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calculator } from 'lucide-react';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { useRef } from 'react';
import { toast } from 'sonner';
import { useGoogleAutocomplete } from "@/hooks/useGoogleAutocomplete";
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

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
  const { calculatePrice, isCalculating } = usePriceCalculation();
  
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  // Hook pour autocomplétion de prise en charge
  const pickupAuto = useGoogleAutocomplete({
    ref: pickupInputRef,
    onPlaceSelected: (place) => {
      if (place && place.formatted_address) {
        form.setValue("pickup_address", place.formatted_address, { shouldValidate: true });
      }
    },
    types: ["geocode", "establishment"],
  });
  // Hook pour autocomplétion de livraison
  const deliveryAuto = useGoogleAutocomplete({
    ref: deliveryInputRef,
    onPlaceSelected: (place) => {
      if (place && place.formatted_address) {
        form.setValue("delivery_address", place.formatted_address, { shouldValidate: true });
      }
    },
    types: ["geocode", "establishment"],
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

  const pickupAddress = form.watch('pickup_address');
  const deliveryAddress = form.watch('delivery_address');
  const vehicleType = form.watch('vehicle_type');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Étape 1: Adresses et grille tarifaire</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="pickup_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                ADRESSE DE PRISE EN CHARGE *
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder={
                      pickupAuto.error 
                        ? "Petit problème... Une erreur s'est produite"
                        : "Saisissez l'adresse complète"
                    }
                    className={`pl-8 bg-[#EEF1FF] ${pickupAuto.error ? 'opacity-60 cursor-not-allowed' : ''}`}
                    {...field}
                    ref={(el) => {
                      pickupInputRef.current = el;
                      field.ref(el);
                    }}
                    disabled={!!pickupAuto.error}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                  {pickupAuto.error && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-destructive">
                      {pickupAuto.error}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="delivery_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                ADRESSE DE LIVRAISON *
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder={
                      deliveryAuto.error
                        ? "Petit problème... Une erreur s'est produite"
                        : "Saisissez l'adresse complète"
                    }
                    className={`pl-8 bg-[#EEF1FF] ${deliveryAuto.error ? 'opacity-60 cursor-not-allowed' : ''}`}
                    {...field}
                    ref={(el) => {
                      deliveryInputRef.current = el;
                      field.ref(el);
                    }}
                    disabled={!!deliveryAuto.error}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                  {deliveryAuto.error && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-destructive">
                      {deliveryAuto.error}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="vehicle_type"
        render={({ field }) => (
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
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button 
          type="button" 
          onClick={handleNext}
          disabled={!distance}
          className="bg-[#1a237e] hover:bg-[#3f51b5]"
        >
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default NewAddressVehicleStep;
