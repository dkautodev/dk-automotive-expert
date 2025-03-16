
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";

interface QuoteDetailsBannerProps {
  pickupAddress: string;
  deliveryAddress: string;
  quoteNumber: string;
}

export const QuoteDetailsBanner = ({ 
  pickupAddress, 
  deliveryAddress,
  quoteNumber 
}: QuoteDetailsBannerProps) => {
  const [distance, setDistance] = useState("");
  const [priceHT, setPriceHT] = useState(0);
  const PRICE_PER_KM = 2.5; // Prix fixe par kilomètre
  
  useDistanceCalculation(pickupAddress, deliveryAddress, setDistance);

  useEffect(() => {
    if (distance) {
      // Extract numeric value from distance string (e.g., "100 km" -> 100)
      const distanceValue = parseFloat(distance.split(' ')[0]);
      const calculatedPriceHT = distanceValue * PRICE_PER_KM;
      setPriceHT(calculatedPriceHT);
    }
  }, [distance]);

  return (
    <Card className="bg-dk-navy text-white p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-lg font-medium">Distance totale</p>
          <p className="text-2xl font-bold">{distance || "Calcul en cours..."}</p>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">Prix</p>
          <div>
            <p className="text-xl">HT: {priceHT ? `${priceHT.toFixed(2)} €` : "Calcul en cours..."}</p>
            <p className="text-xl">TTC: {priceHT ? `${(priceHT * 1.20).toFixed(2)} €` : "Calcul en cours..."}</p>
          </div>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-lg font-medium">Numéro de devis</p>
          <p className="text-2xl font-bold">{quoteNumber || "Génération en cours..."}</p>
        </div>
      </div>
    </Card>
  );
};

