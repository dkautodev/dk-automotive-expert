
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
  // Save the instance to avoid recreating on each render
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);

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
    // As soon as 'ready' and ref are available → attach once and never again
    if (!ready || !ref.current) {
      if (!ready) console.log("[GoogleAutocomplete] Not ready to init (Google API not loaded)");
      if (!ref.current) console.log("[GoogleAutocomplete] ref.current absent during init");
      return;
    }

    if (autocompleteInstance.current) {
      // Autocomplete already initialized for this ref, do nothing
      return;
    }

    try {
      console.log('[GoogleAutocomplete] Initializing Autocomplete on', ref.current);

      // Create the standard Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(ref.current, {
        componentRestrictions: { country: "fr" },
        types: types,
        fields: ["formatted_address", "address_components", "geometry"],
      });

      // Add event listener for place selection
      autocomplete.addListener('place_changed', () => {
        if (onPlaceSelected) {
          const place = autocomplete.getPlace();
          console.log('[GoogleAutocomplete] place_changed triggered, place =', place);
          onPlaceSelected(place);
        }
      });

      autocompleteInstance.current = autocomplete;
      console.log('[GoogleAutocomplete] Autocomplete initialized successfully');
    } catch (e) {
      console.error("[GoogleAutocomplete] Initialization error", e);
      setError("Google Maps initialization error. Contact support.");
    }

    // Cleanup happens automatically when DOM element is removed
  }, [ready, ref, types, onPlaceSelected]);

  return { ready, error };
};
