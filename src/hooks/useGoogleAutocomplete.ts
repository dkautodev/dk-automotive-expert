import { useEffect, useState, useRef } from "react";

interface UseGoogleAutocompleteOpts {
  ref: React.RefObject<HTMLInputElement>;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  types?: string[];
}

export const useGoogleAutocomplete = ({
  ref,
  onPlaceSelected,
  types = ["geocode", "establishment"],
}: UseGoogleAutocompleteOpts) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteInstance = useRef<any>(null);

  useEffect(() => {
    if ((window as any).google && window.google.maps && window.google.maps.places) {
      setReady(true);
      return;
    }

    const scriptId = "google-maps";
    if (document.getElementById(scriptId)) {
      const checkGoogleMaps = () => {
        if ((window as any).google && window.google.maps && window.google.maps.places) {
          setReady(true);
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyA5RjbR6obTrUwTbVGvCZ3JSG_SvHZ_NBs&libraries=places";
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => {
      setError("Impossible de charger Google Maps. Vérifiez votre clé API.");
      setReady(false);
    };
    document.body.appendChild(script);

    return () => {};
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;

    if (autocompleteInstance.current) return;

    // Utilisation de l'API moderne si possible
    if (
      window.customElements &&
      window.customElements.get &&
      window.customElements.get('gmpx-place-autocomplete')
    ) {
      const el = document.createElement('gmpx-place-autocomplete') as any;
      el.setOptions?.({
        inputElement: ref.current,
        types: types,
        componentRestrictions: { country: "fr" },
        fields: ["formatted_address", "address_components", "geometry"],
      });
      el.inputElement = ref.current;
      el.types = types;
      el.componentRestrictions = { country: "fr" };

      const onPlaceChange = () => {
        if (onPlaceSelected) {
          const place = el.getPlace();
          onPlaceSelected(place);
        }
      };
      el.addEventListener("gmp-placeautocomplete-placechange", onPlaceChange);
      autocompleteInstance.current = el;

      // CLEANUP
      return () => {
        el.removeEventListener("gmp-placeautocomplete-placechange", onPlaceChange);
      };
    }

    // Fallback vers ancienne API
    if (window.google?.maps?.places?.Autocomplete) {
      const autocomplete = new window.google.maps.places.Autocomplete(ref.current, {
        componentRestrictions: { country: "fr" },
        types: types,
        fields: ["formatted_address", "address_components", "geometry"],
      });
      autocomplete.addListener('place_changed', () => {
        if (onPlaceSelected) {
          const place = autocomplete.getPlace();
          onPlaceSelected(place);
        }
      });
      autocompleteInstance.current = autocomplete;
    }
    // Pas de cleanup pour ancienne API

    // ... end
  }, [ready, ref, types, onPlaceSelected]);

  return { ready, error };
};
