
import { useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

export const useDistanceCalculation = (
  pickupAddress: string,
  deliveryAddress: string,
  setDistance: (distance: string) => void
) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
  });

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const calculateDistance = async () => {
      try {
        const service = new google.maps.DistanceMatrixService();
        const response = await service.getDistanceMatrix({
          origins: [pickupAddress],
          destinations: [deliveryAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        });

        if (response.rows[0]?.elements[0]?.status === "OK") {
          setDistance(response.rows[0].elements[0].distance.text);
        } else {
          console.error("Erreur lors du calcul de la distance:", response);
          setDistance("Erreur de calcul");
        }
      } catch (error) {
        console.error("Erreur avec l'API Google Maps:", error);
        setDistance("Erreur de calcul");
      }
    };
    
    if (pickupAddress && deliveryAddress) {
      calculateDistance();
    }
  }, [pickupAddress, deliveryAddress, setDistance, isLoaded, loadError]);

  return { isLoaded, loadError };
};
