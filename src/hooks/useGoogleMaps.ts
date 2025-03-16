
import { useState, useCallback } from 'react';
import { useLoadScript, DirectionsService } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

const libraries: ("places")[] = ["places"];

export const useGoogleMaps = () => {
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const calculateDistance = useCallback(async (origin: string, destination: string) => {
    if (!origin || !destination) {
      console.log("Origin or destination missing");
      setError("Addresses are required");
      setDistance("");
      setDuration("");
      return;
    }

    console.log("Calculating distance between:", origin, destination);
    const directionsService = new google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      console.log("Directions result:", result);

      if (!result.routes || result.routes.length === 0) {
        console.log("No routes found");
        setError("No route found");
        setDistance("");
        setDuration("");
        return;
      }

      const route = result.routes[0];
      if (!route.legs || route.legs.length === 0) {
        console.log("No legs found in route");
        setError("Route details not available");
        setDistance("");
        setDuration("");
        return;
      }

      const leg = route.legs[0];
      console.log("Route leg:", leg);

      if (leg.distance && leg.duration) {
        console.log("Setting distance:", leg.distance.text);
        console.log("Setting duration:", leg.duration.text);
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
        setError(null);
      } else {
        console.log("Distance or duration information missing");
        setError("Distance calculation failed");
        setDistance("");
        setDuration("");
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      setError("Error calculating distance");
      setDistance("");
      setDuration("");
    }
  }, []);

  return { isLoaded, loadError, calculateDistance, distance, duration, error };
};
