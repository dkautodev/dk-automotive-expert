
import { useEffect } from 'react';

export const useDistanceCalculation = (
  pickupAddress: string,
  deliveryAddress: string,
  setDistance: (distance: string) => void
) => {
  useEffect(() => {
    const calculateDistance = async () => {
      const service = new google.maps.DistanceMatrixService();
      try {
        const response = await service.getDistanceMatrix({
          origins: [pickupAddress],
          destinations: [deliveryAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        });
        if (response.rows[0].elements[0].status === "OK") {
          setDistance(response.rows[0].elements[0].distance.text);
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    };
    
    if (pickupAddress && deliveryAddress) {
      calculateDistance();
    }
  }, [pickupAddress, deliveryAddress, setDistance]);
};
