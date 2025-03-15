
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, EuroIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
  distance: string;
  priceHT: string;
  onShowContacts: () => void;
  getVehicleName: (id: string) => string;
}

export const OrderSummary = ({
  pickupAddress,
  deliveryAddress,
  selectedVehicle,
  distance,
  priceHT,
  onShowContacts,
  getVehicleName
}: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Informations du trajet
          </CardTitle>
          <div className="flex items-center gap-2 text-xl">
            <EuroIcon className="h-5 w-5" />
            <span>Prix HT: {priceHT}€</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-1">Adresse de départ</h3>
          <p className="text-gray-600">{pickupAddress}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-1">Adresse de livraison</h3>
          <p className="text-gray-600">{deliveryAddress}</p>
        </div>

        {distance && (
          <div>
            <h3 className="font-semibold mb-1">Distance</h3>
            <p className="text-gray-600">{distance}</p>
          </div>
        )}
        
        <div>
          <h3 className="font-semibold mb-1">Type de véhicule</h3>
          <p className="text-gray-600">{getVehicleName(selectedVehicle)}</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onShowContacts}>Suivant</Button>
        </div>
      </CardContent>
    </Card>
  );
};
