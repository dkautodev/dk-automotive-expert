
import { useEffect, useRef, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { MissionFormValues } from "./missionFormSchema";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";

interface AddressFieldsProps {
  form: UseFormReturn<MissionFormValues>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  const pickupInputRef = useRef<HTMLInputElement | null>(null);
  const deliveryInputRef = useRef<HTMLInputElement | null>(null);
  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [deliveryAutocomplete, setDeliveryAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    // Skip if already loaded or no API key
    if (window.google?.maps?.places || !GOOGLE_MAPS_API_KEY || mapsLoaded) {
      console.log("Google Maps déjà chargé ou pas de clé API");
      if (window.google?.maps?.places) setMapsLoaded(true);
      return;
    }

    console.log("Chargement de l'API Google Maps...");
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("API Google Maps chargée avec succès");
      setMapsLoaded(true);
    };
    script.onerror = () => console.error("Erreur lors du chargement de l'API Google Maps");
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [mapsLoaded]);

  // Initialize autocomplete when maps API is loaded
  useEffect(() => {
    if (!mapsLoaded || !window.google?.maps?.places) {
      console.log("API Google Maps pas encore disponible pour l'autocomplete");
      return;
    }
    
    console.log("Initialisation des autocompletions d'adresse");

    if (pickupInputRef.current && !pickupAutocomplete) {
      try {
        console.log("Création de l'autocompletion pour l'adresse de prise en charge");
        const autocomplete = new google.maps.places.Autocomplete(pickupInputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "fr" },
          fields: ["formatted_address"],
        });
        
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            console.log("Adresse de prise en charge sélectionnée:", place.formatted_address);
            form.setValue("pickup_address", place.formatted_address, { shouldValidate: true });
          } else {
            console.warn("Pas d'adresse formatée dans la réponse Google Maps");
          }
        });
        
        setPickupAutocomplete(autocomplete);
        console.log("Autocompletion pour l'adresse de prise en charge initialisée");
      } catch (error) {
        console.error("Erreur lors de la création de l'autocompletion pour l'adresse de prise en charge:", error);
      }
    }

    if (deliveryInputRef.current && !deliveryAutocomplete) {
      try {
        console.log("Création de l'autocompletion pour l'adresse de livraison");
        const autocomplete = new google.maps.places.Autocomplete(deliveryInputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "fr" },
          fields: ["formatted_address"],
        });
        
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            console.log("Adresse de livraison sélectionnée:", place.formatted_address);
            form.setValue("delivery_address", place.formatted_address, { shouldValidate: true });
          } else {
            console.warn("Pas d'adresse formatée dans la réponse Google Maps");
          }
        });
        
        setDeliveryAutocomplete(autocomplete);
        console.log("Autocompletion pour l'adresse de livraison initialisée");
      } catch (error) {
        console.error("Erreur lors de la création de l'autocompletion pour l'adresse de livraison:", error);
      }
    }
  }, [mapsLoaded, form, pickupAutocomplete, deliveryAutocomplete]);

  // Debug mode for inputs to check manual typing
  const handlePickupAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Valeur d'adresse de prise en charge modifiée manuellement:", e.target.value);
    form.setValue("pickup_address", e.target.value);
  };

  const handleDeliveryAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Valeur d'adresse de livraison modifiée manuellement:", e.target.value);
    form.setValue("delivery_address", e.target.value);
  };

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
                  placeholder="Commencez à taper une adresse..." 
                  className="pl-8"
                  value={field.value || ''}
                  onChange={(e) => handlePickupAddressChange(e)}
                  ref={(e) => {
                    pickupInputRef.current = e;
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
            <FormLabel>Adresse de livraison</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Commencez à taper une adresse..." 
                  className="pl-8"
                  value={field.value || ''}
                  onChange={(e) => handleDeliveryAddressChange(e)}
                  ref={(e) => {
                    deliveryInputRef.current = e;
                  }}
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
