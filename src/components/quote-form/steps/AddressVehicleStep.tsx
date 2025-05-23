
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
import VehicleTypeSelector from '../VehicleTypeSelector';
import { Loader } from '@/components/ui/loader';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { toast } from 'sonner';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

interface PriceInfo {
  distance: string | null;
  priceHT: string | null;
  priceTTC: string | null;
}

interface AddressVehicleStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
  priceInfo?: PriceInfo;
}

const AddressVehicleStep = ({ form, onNext, onPrevious, priceInfo }: AddressVehicleStepProps) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [localPriceInfo, setLocalPriceInfo] = useState<PriceInfo | null>(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  
  const pickupInputRef = useRef<HTMLInputElement | null>(null);
  const deliveryInputRef = useRef<HTMLInputElement | null>(null);

  const { calculateDistance, isCalculating: isDistanceCalculating } = useDistanceCalculation();
  const { calculatePrice } = usePriceCalculation();
  
  // Utiliser priceInfo des props s'il existe, sinon utiliser le state local
  const displayPriceInfo = priceInfo?.distance ? priceInfo : localPriceInfo;

  // Mettre à jour le state local quand priceInfo des props change
  useEffect(() => {
    if (priceInfo?.distance) {
      setLocalPriceInfo(priceInfo);
    }
  }, [priceInfo]);

  // Charger l'API Google Maps
  useEffect(() => {
    // Ne pas charger si déjà disponible ou déjà en cours de chargement
    if (window.google?.maps?.places || googleMapsLoaded) {
      if (window.google?.maps?.places) setGoogleMapsLoaded(true);
      return;
    }
    
    // Ne rien faire si la clé API n'est pas configurée
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Clé API Google Maps non configurée");
      return;
    }
    
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("API Google Maps chargée avec succès");
      setGoogleMapsLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error("Erreur lors du chargement de l'API Google Maps:", error);
      toast.error("Impossible de charger l'autocomplétion d'adresse. Vous pouvez tout de même saisir vos adresses manuellement.");
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) document.head.removeChild(script);
    };
  }, [googleMapsLoaded]);

  // Initialiser l'autocomplétion d'adresses quand Google Maps est chargé
  useEffect(() => {
    if (!googleMapsLoaded || !window.google?.maps?.places) return;
    
    // Configurer l'autocomplétion pour l'adresse de départ
    if (pickupInputRef.current) {
      try {
        const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInputRef.current, {
          componentRestrictions: { country: ["fr"] },
          fields: ["formatted_address"],
        });
        
        pickupAutocomplete.addListener("place_changed", () => {
          const place = pickupAutocomplete.getPlace();
          if (place.formatted_address) {
            form.setValue("pickup_address", place.formatted_address, { shouldValidate: true });
          }
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'autocomplétion pour l'adresse de départ:", error);
      }
    }
    
    // Configurer l'autocomplétion pour l'adresse de destination
    if (deliveryInputRef.current) {
      try {
        const deliveryAutocomplete = new google.maps.places.Autocomplete(deliveryInputRef.current, {
          componentRestrictions: { country: ["fr"] },
          fields: ["formatted_address"],
        });
        
        deliveryAutocomplete.addListener("place_changed", () => {
          const place = deliveryAutocomplete.getPlace();
          if (place.formatted_address) {
            form.setValue("delivery_address", place.formatted_address, { shouldValidate: true });
          }
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'autocomplétion pour l'adresse de destination:", error);
      }
    }
  }, [googleMapsLoaded, form]);
  
  // Empêcher la soumission du formulaire lors de l'appui sur Entrée dans les champs d'adresse
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleCalculate = async () => {
    const pickupAddress = form.getValues('pickup_address');
    const deliveryAddress = form.getValues('delivery_address');
    const vehicleType = form.getValues('vehicle_type');

    if (!pickupAddress || !deliveryAddress || !vehicleType) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsCalculating(true);
    
    try {
      console.log(`Calculating distance and price for vehicle type: ${vehicleType}`);
      
      // Calculate distance
      const distance = await calculateDistance(pickupAddress, deliveryAddress);
      
      if (distance <= 0) {
        toast.error("Impossible de calculer la distance entre ces adresses");
        setIsCalculating(false);
        return;
      }
      
      console.log(`Distance calculée: ${distance} km`);
      
      // Calculate price using the vehicle type 
      const priceResult = await calculatePrice(vehicleType, distance);
      
      if (!priceResult) {
        toast.error("Impossible de calculer le prix pour ce type de véhicule et cette distance");
        setIsCalculating(false);
        return;
      }
      
      console.log(`Prix calculé: HT=${priceResult.priceHT}€, TTC=${priceResult.priceTTC}€, isPerKm=${priceResult.isPerKm}`);
      
      // Update form
      form.setValue('distance', distance.toString());
      form.setValue('price_ht', priceResult.priceHT);
      form.setValue('price_ttc', priceResult.priceTTC);
      
      // Store results locally
      setLocalPriceInfo({
        distance: `${distance} km`,
        priceHT: priceResult.priceHT,
        priceTTC: priceResult.priceTTC
      });
      
      toast.success("Calcul effectué avec succès");
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error("Erreur lors du calcul de la distance et du prix");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleNext = () => {
    const data = {
      pickup_address: form.getValues('pickup_address'),
      delivery_address: form.getValues('delivery_address'),
      vehicle_type: form.getValues('vehicle_type')
    };

    if (form.formState.errors.pickup_address || form.formState.errors.delivery_address || form.formState.errors.vehicle_type) {
      form.trigger(['pickup_address', 'delivery_address', 'vehicle_type']);
      return;
    }

    onNext(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Adresse et véhicule</h2>
      
      <div className="space-y-4">
        <VehicleTypeSelector form={form} />
        
        <FormField
          control={form.control}
          name="pickup_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                ADRESSE DE DÉPART <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: 123 Rue de Paris, 75001 Paris"
                  className="bg-[#EEF1FF]"
                  {...field}
                  onKeyDown={handleKeyDown}
                  ref={(el) => {
                    pickupInputRef.current = el;
                    if (typeof field.ref === 'function') {
                      field.ref(el);
                    }
                  }}
                />
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
                ADRESSE DE DESTINATION <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: 456 Avenue des Champs-Élysées, 75008 Paris"
                  className="bg-[#EEF1FF]"
                  {...field}
                  onKeyDown={handleKeyDown}
                  ref={(el) => {
                    deliveryInputRef.current = el;
                    if (typeof field.ref === 'function') {
                      field.ref(el);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-center mt-4">
          <Button 
            type="button" 
            onClick={handleCalculate}
            disabled={isCalculating || isDistanceCalculating}
            variant="outline"
            className="w-full md:w-auto"
          >
            {(isCalculating || isDistanceCalculating) ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                CALCUL EN COURS...
              </>
            ) : (
              'CALCULER LA DISTANCE ET LE PRIX'
            )}
          </Button>
        </div>
        
        {displayPriceInfo && displayPriceInfo.distance && (
          <div className="bg-gray-100 p-4 rounded-md mt-6">
            <h3 className="text-lg font-semibold mb-2">Résultat du calcul</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Distance:</p>
                <p className="text-lg">{displayPriceInfo.distance}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prix HT:</p>
                <p className="text-lg">{displayPriceInfo.priceHT} €</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prix TTC:</p>
                <p className="text-lg">{displayPriceInfo.priceTTC} €</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Ces tarifs sont donnés à titre indicatif et seront confirmés par notre équipe.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          PRÉCÉDENT
        </Button>
        <Button type="button" onClick={handleNext} className="bg-[#1a237e] hover:bg-[#3f51b5]">
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default AddressVehicleStep;
