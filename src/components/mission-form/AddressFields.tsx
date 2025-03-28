
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
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [mapsLoaded]);

  // Initialize autocomplete when maps API is loaded
  useEffect(() => {
    if (!mapsLoaded || !window.google?.maps?.places) return;

    if (pickupInputRef.current && !pickupAutocomplete) {
      const autocomplete = new google.maps.places.Autocomplete(pickupInputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "fr" },
        fields: ["formatted_address"],
      });
      
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          form.setValue("pickup_address", place.formatted_address, { shouldValidate: true });
        }
      });
      
      setPickupAutocomplete(autocomplete);
    }

    if (deliveryInputRef.current && !deliveryAutocomplete) {
      const autocomplete = new google.maps.places.Autocomplete(deliveryInputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "fr" },
        fields: ["formatted_address"],
      });
      
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          form.setValue("delivery_address", place.formatted_address, { shouldValidate: true });
        }
      });
      
      setDeliveryAutocomplete(autocomplete);
    }
  }, [mapsLoaded, form, pickupAutocomplete, deliveryAutocomplete]);

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
                  {...field} 
                  className="pl-8"
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
                  {...field} 
                  className="pl-8"
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
