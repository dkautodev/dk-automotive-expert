
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
      setReady(true);
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
      // Ajout log pour le debug sur la disponibilité de la ref
      if (!ready) console.log("[GoogleAutocomplete] Not ready to init (Google API non chargée)");
      if (!ref.current) console.log("[GoogleAutocomplete] ref.current absent lors de l'init");
      return;
    }
    let autocomplete: google.maps.places.Autocomplete | undefined;

    try {
      // Ajout d'un log de debug pour vérifier à quel moment c'est créé
      console.log('[GoogleAutocomplete] Initialisation autocomplete sur', ref.current);
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
    } catch (e) {
      setError("Erreur d'initialisation Google Maps. Contactez le support.");
      console.error("[GoogleAutocomplete] Erreur d'init", e);
    }

    return () => {
      if (autocomplete && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [ready, ref]); // On dépend bien de la ref, PAS ref.current

  return { ready, error };
};
