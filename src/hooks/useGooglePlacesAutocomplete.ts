
// MIGRATION VERS L'API "PlaceAutocompleteElement" SI DISPONIBLE
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
    if (!isLoaded || !inputRef.current || loadError) return;

    let cleanup: (() => void) | undefined = undefined;

    // On check d'abord si la nouvelle API PlaceAutocompleteElement est dispo (API 2024+)
    if (
      window.customElements &&
      window.customElements.get &&
      window.customElements.get('gmpx-place-autocomplete')
    ) {
      // Nouvelle API : créer l'élément, le connecter à l'input et écouter les events.
      console.log("Using Google PlaceAutocompleteElement (modern) for", fieldName);
      const el = document.createElement('gmpx-place-autocomplete') as any;
      el.setOptions?.({
        inputElement: inputRef.current,
        types: ["address"],
        componentRestrictions: { country: ["fr"] },
        fields: ['formatted_address'],
      });
      el.inputElement = inputRef.current;
      el.types = ["address"];
      el.componentRestrictions = { country: ["fr"] };
      // Ecouteur d'event natif
      const onPlaceChange = () => {
        const place = el.getPlace();
        if (place && place.formatted_address) {
          setValue(fieldName, place.formatted_address, { shouldValidate: true });
        }
      };
      el.addEventListener("gmp-placeautocomplete-placechange", onPlaceChange);

      cleanup = () => {
        el.removeEventListener("gmp-placeautocomplete-placechange", onPlaceChange);
      };
    } else if (window.google?.maps?.places?.Autocomplete) {
      // Ancienne API : garde le fallback aussi pour Chrome vieux ou fail registration
      console.log("Using legacy Google Maps Places Autocomplete for", fieldName);
      let autocomplete: google.maps.places.Autocomplete | undefined = undefined;

      autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ['fr'] },
        types: ['address'],
        fields: ['formatted_address'],
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete!.getPlace();
        if (place && place.formatted_address) {
          setValue(fieldName, place.formatted_address, { shouldValidate: true });
        }
      });
      // Pas de cleanup requis pour l'API legacy : listeners liés à l'élément DOM
    } else {
      toast.error("Google Maps API non disponible ou trop ancienne pour l'autocomplétion.");
      console.error("Google Maps API not available, can't attach autocomplete.");
    }

    return cleanup;
  }, [isLoaded, loadError, inputRef, setValue, fieldName]);

  return { isLoaded, loadError };
};

