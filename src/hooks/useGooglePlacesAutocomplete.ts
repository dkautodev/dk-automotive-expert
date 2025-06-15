
import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { QuoteFormValues } from '@/components/quote-form/quoteFormSchema';
import { useGoogleMapsApi } from './useGoogleMapsApi';
import { toast } from 'sonner';

export const useGooglePlacesAutocomplete = (
  inputRef: React.RefObject<HTMLInputElement>,
  setValue: UseFormSetValue<QuoteFormValues>,
  fieldName: 'pickup_address' | 'delivery_address'
) => {
  const { isLoaded, loadError } = useGoogleMapsApi({ libraries: ['places'] });

  useEffect(() => {
    if (loadError) {
      console.log("Google Maps API error:", loadError);
      toast.error("Erreur : L'autocomplétion d'adresse Google ne peut pas fonctionner (clé API absente/invalide ou quota atteint).");
    }
  }, [loadError]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || loadError) {
      console.log("Google Maps not ready:", { isLoaded, hasInput: !!inputRef.current, loadError });
      return;
    }

    console.log("Initializing Google Places Autocomplete for", fieldName);
    
    let autocomplete: google.maps.places.Autocomplete | undefined = undefined;
    
    try {
      autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ['fr'] },
        types: ['address'],
        fields: ['formatted_address'],
      });

      console.log("Google Places Autocomplete initialized successfully");

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete?.getPlace();
        console.log("Place selected:", place);
        
        if (place && place.formatted_address) {
          console.log("Setting address:", place.formatted_address);
          setValue(fieldName, place.formatted_address, { shouldValidate: true });
        }
      });
    } catch (e) {
      console.error("Erreur lors de l'initialisation de Google Places:", e);
      toast.error("Impossible d'activer les suggestions d'adresse. Veuillez vérifier votre connexion ou contacter le support.");
    }

    return () => {
      if (autocomplete && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, loadError, inputRef, setValue, fieldName]);

  return { isLoaded, loadError };
};
