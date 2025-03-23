
import { useState } from "react";
import { Card } from "@/components/ui/card";
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
  const [priceHT] = useState(0);

  const getVehicleTypeName = (id: string) => {
    const vehicleType = vehicleTypes.find(type => type.id === id);
    return vehicleType ? vehicleType.name : "Non spécifié";
  };

  return (
    <Card className="bg-secondary/50 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <p className="text-lg font-medium">Origine</p>
          <p className="text-sm">{pickupAddress || "Non spécifié"}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium">Destination</p>
          <p className="text-sm">{deliveryAddress || "Non spécifié"}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium">Type de véhicule</p>
          <p className="text-2xl font-bold">{getVehicleTypeName(selectedVehicle)}</p>
        </div>
        
        <div className="space-y-2 col-end-5 text-right">
          <p className="text-lg font-medium">Prix</p>
          <div>
            <p className="text-xl">HT: {priceHT ? `${priceHT.toFixed(2)} €` : "Sur devis"}</p>
            <p className="text-xl">TTC: {priceHT ? `${(priceHT * 1.20).toFixed(2)} €` : "Sur devis"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
