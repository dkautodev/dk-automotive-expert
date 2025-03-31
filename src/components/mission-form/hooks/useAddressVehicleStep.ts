
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "../missionFormSchema";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useClients } from "./useClients";

export const useAddressVehicleStep = (
  form: UseFormReturn<MissionFormValues>,
  onNext: () => void,
  onPrevious: () => void
) => {
  const { calculateDistance, isCalculating: isDistanceCalculating } = useDistanceCalculation();
  const { calculatePrice, isCalculating: isPriceCalculating, priceHT, priceTTC } = usePriceCalculation();
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculatingTotal, setIsCalculatingTotal] = useState<boolean>(false);

  const { 
    clients, 
    isLoading: clientsLoading, 
    fetchClients,
    error: clientsError
  } = useClients(form);

  const pickupAddress = form.watch("pickup_address");
  const deliveryAddress = form.watch("delivery_address");
  const vehicleType = form.watch("vehicle_type");

  const isCalculating = isDistanceCalculating || isPriceCalculating || isCalculatingTotal;

  // If error loading clients, retry
  useEffect(() => {
    if (clientsError) {
      console.warn("Erreur chargement clients, nouvelle tentative:", clientsError);
      const timer = setTimeout(() => {
        fetchClients();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clientsError, fetchClients]);

  // Debug logging
  useEffect(() => {
    console.log("État actuel des clients:", clients);
    console.log("Chargement clients:", clientsLoading);
    console.log("Erreur clients:", clientsError);
  }, [clients, clientsLoading, clientsError]);

  const calculateDistanceAndPrice = async () => {
    if (!pickupAddress || !deliveryAddress || !vehicleType) {
      return;
    }

    setIsCalculatingTotal(true);
    
    try {
      // Calculate distance
      const calculatedDistance = await calculateDistance(pickupAddress, deliveryAddress);
      setDistance(calculatedDistance);
      form.setValue("distance", calculatedDistance);

      // Calculate price
      const priceResult = await calculatePrice(vehicleType, calculatedDistance);
      form.setValue("price_ht", priceResult.priceHT);
      form.setValue("price_ttc", priceResult.priceTTC);
    } catch (error) {
      console.error("Error calculating distance and price:", error);
    } finally {
      setIsCalculatingTotal(false);
    }
  };

  return {
    distance,
    priceHT,
    priceTTC,
    isCalculating,
    clients,
    clientsLoading,
    clientsError,
    calculateDistanceAndPrice,
    pickupAddress,
    deliveryAddress,
    vehicleType
  };
};
