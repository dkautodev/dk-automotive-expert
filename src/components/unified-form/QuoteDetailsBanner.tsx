import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import { vehicleTypes } from "@/lib/vehicleTypes";
interface QuoteDetailsBannerProps {
  pickupAddress: string;
  deliveryAddress: string;
  quoteNumber: string;
  selectedVehicle: string;
}
export const QuoteDetailsBanner = ({
  pickupAddress,
  deliveryAddress,
  quoteNumber,
  selectedVehicle
}: QuoteDetailsBannerProps) => {
  const [distance, setDistance] = useState("");
  const [priceHT, setPriceHT] = useState(0);
  const PRICE_PER_KM = 2.5;
  useDistanceCalculation(pickupAddress, deliveryAddress, setDistance);
  useEffect(() => {
    if (distance) {
      const distanceValue = parseFloat(distance.split(' ')[0]);
      const calculatedPriceHT = distanceValue * PRICE_PER_KM;
      setPriceHT(calculatedPriceHT);
    }
  }, [distance]);
  const getVehicleTypeName = (id: string) => {
    const vehicleType = vehicleTypes.find(type => type.id === id);
    return vehicleType ? vehicleType.name : "Non spécifié";
  };
  return;
};