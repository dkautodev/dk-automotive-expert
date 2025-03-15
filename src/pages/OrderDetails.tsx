
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
}

const OrderDetails = () => {
  const location = useLocation();
  const orderDetails = location.state as OrderState;

  const getVehicleName = (id: string) => {
    const vehicle = vehicleTypes.find(v => v.id === id);
    return vehicle ? vehicle.name : id;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Détails de la commande</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Informations du trajet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Adresse de départ</h3>
            <p className="text-gray-600">{orderDetails.pickupAddress}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Adresse de livraison</h3>
            <p className="text-gray-600">{orderDetails.deliveryAddress}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Type de véhicule</h3>
            <p className="text-gray-600">{getVehicleName(orderDetails.selectedVehicle)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const vehicleTypes = [
  { id: "citadine", name: "Citadine" },
  { id: "berline", name: "Berline" },
  { id: "suv", name: "4x4 (ou SUV)" },
  { id: "utilitaire-3-5", name: "Utilitaire 3-5m3" },
  { id: "utilitaire-6-12", name: "Utilitaire 6-12m3" },
  { id: "utilitaire-12-15", name: "Utilitaire 12-15m3" },
  { id: "utilitaire-15-20", name: "Utilitaire 15-20m3" },
  { id: "utilitaire-20-plus", name: "Utilitaire + de 20m3" },
];

export default OrderDetails;
