
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if ((window as any).google && window.google.maps && window.google.maps.places) {
      setReady(true);
      return;
    }

    const scriptId = "google-maps";
    if (document.getElementById(scriptId)) {
      // Script déjà présent, attendre qu'il se charge
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
    if (!ready || !ref.current) {
      if (!ready) console.log("[GoogleAutocomplete] Not ready to init (Google API non chargée)");
      if (!ref.current) console.log("[GoogleAutocomplete] ref.current absent lors de l'init");
      return;
    }

    let autocomplete: google.maps.places.Autocomplete | undefined;

    // Ajouter un petit délai pour éviter les conflits entre multiples autocomplete
    const initTimeout = setTimeout(() => {
      try {
        console.log('[GoogleAutocomplete] Initialisation autocomplete sur', ref.current);
        
        if (!ref.current) {
          console.log('[GoogleAutocomplete] ref.current perdu pendant le timeout');
          return;
        }

        autocomplete = new window.google.maps.places.Autocomplete(ref.current, {
          types,
          componentRestrictions: { country: "fr" },
          fields: ["formatted_address", "address_components", "geometry"],
        });

        autocomplete.addListener("place_changed", () => {
          if (onPlaceSelected) {
            onPlaceSelected(autocomplete!.getPlace());
          }
        });

        console.log('[GoogleAutocomplete] Autocomplete initialisé avec succès');
      } catch (e) {
        console.error("[GoogleAutocomplete] Erreur d'init", e);
        setError("Erreur d'initialisation Google Maps. Contactez le support.");
      }
    }, 50); // Petit délai pour éviter les conflits

    return () => {
      clearTimeout(initTimeout);
      if (autocomplete && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [ready, ref, types, onPlaceSelected]);

  return { ready, error };
};
