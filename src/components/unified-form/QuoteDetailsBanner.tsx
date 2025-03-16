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
  return <Card className="bg-secondary/50 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="space-y-2">
          <p className="text-lg font-medium">Distance totale</p>
          <p className="text-2xl font-bold">{distance || "Calcul en cours..."}</p>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">Type de véhicule</p>
          <p className="text-2xl font-bold">{getVehicleTypeName(selectedVehicle)}</p>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-lg font-medium">Prix</p>
          <div>
            <p className="text-xl">HT: {priceHT ? `${priceHT.toFixed(2)} €` : "Calcul en cours..."}</p>
            <p className="text-xl">TTC: {priceHT ? `${(priceHT * 1.20).toFixed(2)} €` : "Calcul en cours..."}</p>
          </div>
        </div>
      </div>
    </Card>;
};