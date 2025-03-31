
import { useEffect, useRef, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { MissionFormValues } from "./missionFormSchema";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { toast } from "sonner";

interface AddressFieldsProps {
  form: UseFormReturn<MissionFormValues>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  const pickupInputRef = useRef<HTMLInputElement | null>(null);
  const deliveryInputRef = useRef<HTMLInputElement | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [autocompletes, setAutocompletes] = useState<{
    pickup: google.maps.places.Autocomplete | null;
    delivery: google.maps.places.Autocomplete | null;
  }>({ pickup: null, delivery: null });

  // Charger l'API Google Maps
  useEffect(() => {
    // Ne pas charger si déjà chargé ou pas de clé API
    if (window.google?.maps?.places || !GOOGLE_MAPS_API_KEY || mapsLoaded) {
      if (window.google?.maps?.places) setMapsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("API Google Maps chargée avec succès");
      setMapsLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Erreur lors du chargement de l'API Google Maps");
      toast.error("Impossible de charger la fonctionnalité d'autocomplétion d'adresse");
    };
    
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) document.head.removeChild(script);
    };
  }, [mapsLoaded]);

  // Initialiser l'autocomplétion quand l'API est chargée
  useEffect(() => {
    if (!mapsLoaded || !window.google?.maps?.places) return;
    
    // Configuration commune pour les autocompletes
    const setupAutocomplete = (
      inputRef: React.RefObject<HTMLInputElement>,
      fieldName: 'pickup_address' | 'delivery_address'
    ) => {
      if (!inputRef.current) return null;
      
      try {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          fields: ["formatted_address"],
          componentRestrictions: { country: "fr" } // Restreindre à la France
        });
        
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place?.formatted_address) {
            form.setValue(fieldName, place.formatted_address, { shouldValidate: true });
          }
        });
        
        // Désactiver la soumission du formulaire quand l'utilisateur appuie sur Entrée
        inputRef.current.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        });
        
        return autocomplete;
      } catch (error) {
        console.error(`Erreur lors de l'initialisation de l'autocomplétion pour ${fieldName}:`, error);
        return null;
      }
    };
    
    // Initialiser les deux champs si nécessaire
    if (!autocompletes.pickup && pickupInputRef.current) {
      const pickupAutocomplete = setupAutocomplete(pickupInputRef, 'pickup_address');
      if (pickupAutocomplete) {
        setAutocompletes(prev => ({ ...prev, pickup: pickupAutocomplete }));
      }
    }
    
    if (!autocompletes.delivery && deliveryInputRef.current) {
      const deliveryAutocomplete = setupAutocomplete(deliveryInputRef, 'delivery_address');
      if (deliveryAutocomplete) {
        setAutocompletes(prev => ({ ...prev, delivery: deliveryAutocomplete }));
      }
    }
  }, [mapsLoaded, form, autocompletes]);

  return (
    <>
      <FormField
        control={form.control}
        name="pickup_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse de prise en charge</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Saisissez l'adresse complète" 
                  className="pl-8"
                  {...field}
                  ref={pickupInputRef}
                  role="presentation"
                  autoComplete="off"
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
            <FormLabel>Adresse de livraison</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Saisissez l'adresse complète" 
                  className="pl-8"
                  {...field}
                  ref={deliveryInputRef}
                  role="presentation"
                  autoComplete="off"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddressFields;
