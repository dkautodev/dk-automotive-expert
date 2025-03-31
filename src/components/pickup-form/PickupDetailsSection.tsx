
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { UseFormReturn } from 'react-hook-form';
import { PickupFormValues } from './pickupFormSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";

interface PickupDetailsSectionProps {
  form: UseFormReturn<PickupFormValues>;
  addressInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const PickupDetailsSection = ({ form, addressInputRef }: PickupDetailsSectionProps) => {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps API
  useEffect(() => {
    // Skip if already loaded or no API key
    if (window.google?.maps?.places || !GOOGLE_MAPS_API_KEY || mapsLoaded) {
      if (window.google?.maps?.places) setMapsLoaded(true);
      return;
    }

    console.log("Chargement de l'API Google Maps pour le formulaire d'enlèvement...");
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("API Google Maps chargée avec succès pour le formulaire d'enlèvement");
      setMapsLoaded(true);
    };
    script.onerror = () => console.error("Erreur lors du chargement de l'API Google Maps pour le formulaire d'enlèvement");

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [mapsLoaded]);

  // Initialize autocomplete when maps API is loaded
  useEffect(() => {
    if (!mapsLoaded || !window.google?.maps?.places || !addressInputRef.current || autocomplete) {
      return;
    }

    try {
      console.log("Initialisation de l'autocomplétion pour l'adresse d'enlèvement");
      const autocompleteInstance = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "fr" },
        fields: ["formatted_address"],
      });
      
      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (place && place.formatted_address) {
          console.log("Adresse d'enlèvement sélectionnée:", place.formatted_address);
          form.setValue("address", place.formatted_address, { shouldValidate: true });
        } else {
          console.warn("Pas d'adresse formatée dans la réponse Google Maps");
        }
      });
      
      setAutocomplete(autocompleteInstance);
      console.log("Autocomplétion pour l'adresse d'enlèvement initialisée");
    } catch (error) {
      console.error("Erreur lors de la création de l'autocomplétion pour l'adresse d'enlèvement:", error);
    }
  }, [mapsLoaded, addressInputRef, form, autocomplete]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Valeur d'adresse d'enlèvement modifiée manuellement:", e.target.value);
    form.setValue("address", e.target.value);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              ADRESSE <span className="text-blue-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Commencez à taper une adresse..."
                className="bg-[#EEF1FF]"
                value={field.value || ''}
                onChange={(e) => handleAddressChange(e)}
                ref={(e) => {
                  addressInputRef.current = e;
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pickupDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              DATE D'ENLÈVEMENT <span className="text-blue-500">*</span>
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-[#EEF1FF]",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Choisir une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pickupTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              HEURE D'ENLÈVEMENT <span className="text-blue-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="time"
                  placeholder="Choisir une heure" 
                  {...field} 
                  className="bg-[#EEF1FF] pl-10" 
                />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              MESSAGE COMPLÉMENTAIRE
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Ajoutez des informations complémentaires à votre demande..."
                className="bg-[#EEF1FF] min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PickupDetailsSection;
