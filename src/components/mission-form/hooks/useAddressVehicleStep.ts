
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "../missionFormSchema";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useClients } from "./useClients";
import { toast } from "sonner";

export const useAddressVehicleStep = (
  form: UseFormReturn<MissionFormValues>,
  onNext: () => void,
  onPrevious: () => void
) => {
  const { calculateDistance, isCalculating: isDistanceCalculating } = useDistanceCalculation();
  const { calculatePrice, isCalculating: isPriceCalculating } = usePriceCalculation();
  const [distance, setDistance] = useState<number | null>(null);
  const [priceHT, setPriceHT] = useState<string | null>(null);
  const [priceTTC, setPriceTTC] = useState<string | null>(null);
  const [isPerKm, setIsPerKm] = useState<boolean>(false);
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
  
  // Surveillance du champ additional_info
  const additionalInfo = form.watch("additional_info");

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

  // Log address changes for debugging
  useEffect(() => {
    console.log("Adresse de prise en charge actuelle:", pickupAddress);
  }, [pickupAddress]);
  
  useEffect(() => {
    console.log("Adresse de livraison actuelle:", deliveryAddress);
  }, [deliveryAddress]);

  const calculateDistanceAndPrice = async () => {
    if (!pickupAddress || !deliveryAddress || !vehicleType) {
      toast.error("Veuillez remplir tous les champs (adresses et type de véhicule)");
      return;
    }

    setIsCalculatingTotal(true);
    
    try {
      console.log("Calcul de distance entre:", pickupAddress, "et", deliveryAddress);
      
      // Calculate distance
      const calculatedDistance = await calculateDistance(pickupAddress, deliveryAddress);
      console.log("Distance calculée:", calculatedDistance, "km");
      
      setDistance(calculatedDistance);
      form.setValue("distance", calculatedDistance.toString());

      // Calculate price
      const priceResult = await calculatePrice(vehicleType, calculatedDistance);
      
      if (priceResult) {
        setPriceHT(priceResult.priceHT);
        setPriceTTC(priceResult.priceTTC);
        setIsPerKm(priceResult.isPerKm);
        
        form.setValue("price_ht", priceResult.priceHT);
        form.setValue("price_ttc", priceResult.priceTTC);
        
        console.log(`Prix calculés: HT=${priceResult.priceHT}€, TTC=${priceResult.priceTTC}€, isPerKm=${priceResult.isPerKm}`);
        toast.success("Calcul effectué avec succès");
      } else {
        setPriceHT(null);
        setPriceTTC(null);
        setIsPerKm(false);
        toast.error("Impossible de calculer le prix pour ce véhicule et cette distance");
      }
    } catch (error: any) {
      console.error("Error calculating distance and price:", error);
      
      setDistance(null);
      setPriceHT(null);
      setPriceTTC(null);
      setIsPerKm(false);
      form.setValue("distance", "");
      form.setValue("price_ht", "");
      form.setValue("price_ttc", "");
    } finally {
      setIsCalculatingTotal(false);
    }
  };

  return {
    distance,
    priceHT,
    priceTTC,
    isPerKm,
    isCalculating,
    clients,
    clientsLoading,
    clientsError,
    calculateDistanceAndPrice,
    pickupAddress,
    deliveryAddress,
    vehicleType,
    additionalInfo
  };
};
