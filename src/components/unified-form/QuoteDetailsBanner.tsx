
import { useState } from "react";
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
  
  useDistanceCalculation(pickupAddress, deliveryAddress, setDistance);

  return (
    <Card className="bg-dk-navy text-white p-6 mb-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-lg font-medium">Distance totale</p>
          <p className="text-2xl font-bold">{distance || "Calcul en cours..."}</p>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-lg font-medium">Numéro de devis</p>
          <p className="text-2xl font-bold">{quoteNumber || "Génération en cours..."}</p>
        </div>
      </div>
    </Card>
  );
};
