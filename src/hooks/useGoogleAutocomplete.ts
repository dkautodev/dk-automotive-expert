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
    if (!ready || !ref.current) return;
    let autocomplete: google.maps.places.Autocomplete | undefined;

    try {
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
      console.error(e);
    }

    return () => {
      if (autocomplete && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [ready, ref.current]);

  return { ready, error };
};
