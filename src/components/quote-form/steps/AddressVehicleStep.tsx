
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calculator } from 'lucide-react';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { useQuoteCalculations } from '../hooks/useQuoteCalculations';
import { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { toast } from 'sonner';

interface AddressVehicleStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
  distance: number | null;
  priceHT: string | null;
  priceTTC: string | null;
  setDistance: (distance: number | null) => void;
  setPriceHT: (price: string | null) => void;
  setPriceTTC: (price: string | null) => void;
  setIsPerKm: (isPerKm: boolean) => void;
}

const AddressVehicleStep = ({
  form,
  onNext,
  onPrevious,
  distance,
  priceHT,
  priceTTC,
  setDistance,
  setPriceHT,
  setPriceTTC,
  setIsPerKm
}: AddressVehicleStepProps) => {
  const { calculateQuote, isCalculating } = useQuoteCalculations(
    form, setDistance, setPriceHT, setPriceTTC, setIsPerKm
  );

  const pickupInputRef = useRef<HTMLInputElement | null>(null);
  const deliveryInputRef = useRef<HTMLInputElement | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Charger l'API Google Maps
  useEffect(() => {
    if (window.google?.maps?.places || !GOOGLE_MAPS_API_KEY || mapsLoaded) {
      if (window.google?.maps?.places) setMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setMapsLoaded(true);
    };
    
    script.onerror = () => {
      toast.error("Impossible de charger l'autocomplétion d'adresse");
    };
    
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) document.head.removeChild(script);
    };
  }, [mapsLoaded]);

  // Initialiser l'autocomplétion
  useEffect(() => {
    if (!mapsLoaded || !window.google?.maps?.places) return;
    
    const setupAutocomplete = (
      inputRef: React.RefObject<HTMLInputElement>,
      fieldName: 'pickup_address' | 'delivery_address'
    ) => {
      if (!inputRef.current) return;
      
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["formatted_address"],
        componentRestrictions: { country: "fr" }
      });
      
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          form.setValue(fieldName, place.formatted_address, { shouldValidate: true });
        }
      });
    };
    
    if (pickupInputRef.current) {
      setupAutocomplete(pickupInputRef, 'pickup_address');
    }
    
    if (deliveryInputRef.current) {
      setupAutocomplete(deliveryInputRef, 'delivery_address');
    }
  }, [mapsLoaded, form]);

  const handleCalculate = async () => {
    const success = await calculateQuote({});
    if (!success) return;
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
      <h2 className="text-2xl font-bold text-dk-navy">Adresses et véhicule</h2>
      
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
                    placeholder="Saisissez l'adresse complète" 
                    className="pl-8 bg-[#EEF1FF]"
                    {...field}
                    ref={(el) => {
                      pickupInputRef.current = el;
                      if (typeof field.ref === 'function') {
                        field.ref(el);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
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
                    placeholder="Saisissez l'adresse complète" 
                    className="pl-8 bg-[#EEF1FF]"
                    {...field}
                    ref={(el) => {
                      deliveryInputRef.current = el;
                      if (typeof field.ref === 'function') {
                        field.ref(el);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
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
              TYPE DE VÉHICULE *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-[#EEF1FF]">
                  <SelectValue placeholder="Sélectionner un type de véhicule" />
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

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          PRÉCÉDENT
        </Button>
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

export default AddressVehicleStep;
