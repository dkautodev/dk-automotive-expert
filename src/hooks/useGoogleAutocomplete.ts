
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
  // Sauvegarde l'instance pour ne pas la recréer à chaque render
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
    // Dès que 'ready' et ref ok → attachez une fois et plus jamais
    if (!ready || !ref.current) {
      if (!ready) console.log("[GoogleAutocomplete] Not ready to init (Google API non chargée)");
      if (!ref.current) console.log("[GoogleAutocomplete] ref.current absent lors de l'init");
      return;
    }

    if (autocompleteInstance.current) {
      // Autocomplete déjà initialisé pour ce ref, ne rien faire
      return;
    }

    try {
      console.log('[GoogleAutocomplete] Initialisation autocomplete sur', ref.current);

      autocompleteInstance.current = new window.google.maps.places.Autocomplete(ref.current, {
        types,
        componentRestrictions: { country: "fr" },
        fields: ["formatted_address", "address_components", "geometry"],
      });

      autocompleteInstance.current.addListener("place_changed", () => {
        if (onPlaceSelected) {
          const place = autocompleteInstance.current!.getPlace();
          console.log('[GoogleAutocomplete] place_changed déclenché, place =', place);
          onPlaceSelected(place);
        }
      });

      console.log('[GoogleAutocomplete] Autocomplete initialisé avec succès');
    } catch (e) {
      console.error("[GoogleAutocomplete] Erreur d'init", e);
      setError("Erreur d'initialisation Google Maps. Contactez le support.");
    }

    // Pas de detachlistener ici, Google autocomplete gère parfaitement son cycle de vie nativement pour 1 ref.
  }, [ready, ref, types, onPlaceSelected]);

  return { ready, error };
};
