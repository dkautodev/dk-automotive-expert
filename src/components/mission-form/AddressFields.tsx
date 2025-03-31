
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
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [deliveryAutocomplete, setDeliveryAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps API
  useEffect(() => {
    // Skip if already loaded or no API key
    if (window.google?.maps?.places || !GOOGLE_MAPS_API_KEY || mapsLoaded) {
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
    script.onerror = (e) => {
      console.error("Erreur lors du chargement de l'API Google Maps:", e);
      // En cas d'erreur, on continue sans autocomplete
    };
    
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
      return;
    }
    
    try {
      // Initialize pickup autocomplete
      if (pickupInputRef.current && !pickupAutocomplete) {
        console.log("Initialisation de l'autocomplétion pour l'adresse de prise en charge");
        const autocomplete = new google.maps.places.Autocomplete(pickupInputRef.current, {
          types: ["address"],
          fields: ["formatted_address"],
        });
        
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            console.log("Adresse de prise en charge sélectionnée:", place.formatted_address);
            form.setValue("pickup_address", place.formatted_address, { shouldValidate: true });
          }
        });
        
        setPickupAutocomplete(autocomplete);
      }

      // Initialize delivery autocomplete
      if (deliveryInputRef.current && !deliveryAutocomplete) {
        console.log("Initialisation de l'autocomplétion pour l'adresse de livraison");
        const autocomplete = new google.maps.places.Autocomplete(deliveryInputRef.current, {
          types: ["address"],
          fields: ["formatted_address"],
        });
        
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            console.log("Adresse de livraison sélectionnée:", place.formatted_address);
            form.setValue("delivery_address", place.formatted_address, { shouldValidate: true });
          }
        });
        
        setDeliveryAutocomplete(autocomplete);
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'autocomplétion:", error);
    }
  }, [mapsLoaded, form, pickupAutocomplete, deliveryAutocomplete]);

  // Manual input handling for when autocomplete isn't used or fails
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Modification manuelle de l'adresse de prise en charge:", value);
    form.setValue("pickup_address", value, { shouldValidate: true });
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Modification manuelle de l'adresse de livraison:", value);
    form.setValue("delivery_address", value, { shouldValidate: true });
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
                  placeholder="Saisissez l'adresse complète" 
                  className="pl-8"
                  value={field.value || ''}
                  onChange={handlePickupChange}
                  ref={pickupInputRef}
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
                  value={field.value || ''}
                  onChange={handleDeliveryChange}
                  ref={deliveryInputRef}
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
