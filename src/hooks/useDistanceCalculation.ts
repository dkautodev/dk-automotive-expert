
import { useState, useEffect } from 'react';

/**
 * A simplified distance calculation hook that doesn't use Google Maps API
 */
export const useDistanceCalculation = (
  originAddress: string,
  destinationAddress: string,
  setDistance: React.Dispatch<React.SetStateAction<string>>
) => {
  useEffect(() => {
    // Simplified calculation logic
    const calculateDistanceEstimate = () => {
      if (!originAddress || !destinationAddress) {
        setDistance("");
        return;
      }
      
      // Return a placeholder distance based on string lengths
      // This is just a placeholder and not a real calculation
      const randomDistance = Math.floor(Math.random() * 100) + 10;
      setDistance(`${randomDistance} km`);
    };

    calculateDistanceEstimate();
  }, [originAddress, destinationAddress, setDistance]);

  return null;
};
