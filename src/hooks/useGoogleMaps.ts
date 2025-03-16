
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

    const service = new google.maps.DistanceMatrixService();
    
    try {
      const response = await service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      });

      if (response.rows[0]?.elements[0]?.status === "OK") {
        setDistance(response.rows[0].elements[0].distance.text);
        setDuration(response.rows[0].elements[0].duration.text);
      }
    } catch (error) {
      console.error("Erreur lors du calcul de la distance:", error);
    }
  }, []);

  return { isLoaded, loadError, calculateDistance, distance, duration };
};
