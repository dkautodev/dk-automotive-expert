import { useState, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

const libraries: ("places")[] = ["places"];

export const useGoogleMaps = () => {
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const calculateDistance = useCallback(async (origin: string, destination: string) => {
    if (!origin || !destination) return;

    const directionsService = new google.maps.DirectionsService();
    
    try {
      const response = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (response.routes.length > 0 && response.routes[0].legs.length > 0) {
        const leg = response.routes[0].legs[0];
        setDistance(leg.distance?.text || "");
        setDuration(leg.duration?.text || "");
      }
    } catch (error) {
      console.error("Erreur lors du calcul de la distance:", error);
    }
  }, []);

  return { isLoaded, loadError, calculateDistance, distance, duration };
};
