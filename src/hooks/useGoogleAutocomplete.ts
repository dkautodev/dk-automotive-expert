
import { useEffect, useState } from "react";

interface UseGoogleAutocompleteOpts {
  ref: React.RefObject<HTMLInputElement>;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
}

export const useGoogleAutocomplete = ({
  ref,
  onPlaceSelected,
}: UseGoogleAutocompleteOpts) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setReady(true);
      return;
    }

    // Charger le script une seule fois
    const scriptId = "google-maps";
    if (document.getElementById(scriptId)) {
      // Script déjà présent
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    // Clé insérée en dur ici: usage frontend public OK
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBjGI3KdkPfON3ssMq3_Qp3j9XZLXJHP_M&libraries=places";
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => {
      setReady(false);
      console.error("Erreur de chargement Google Maps API");
    };
    document.body.appendChild(script);

    return () => {
      // Ne pas retirer le script, utile pour tous les inputs de la même page
    };
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    let autocomplete: google.maps.places.Autocomplete | undefined;

    // Setup Google Places Autocomplete
    autocomplete = new window.google.maps.places.Autocomplete(ref.current, {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "fr" },
      fields: ["formatted_address", "address_components", "geometry"],
    });
    autocomplete.addListener("place_changed", () => {
      if (onPlaceSelected) {
        onPlaceSelected(autocomplete!.getPlace());
      }
    });

    return () => {
      if (autocomplete && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [ready, ref.current]);
};
