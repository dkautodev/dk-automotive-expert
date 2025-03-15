import { useLocation, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, EuroIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";

interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
}

const OrderDetails = () => {
  const location = useLocation();
  const orderDetails = location.state as OrderState | null;
  const [distance, setDistance] = useState<string>("");
  const [priceHT] = useState("150");

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  useEffect(() => {
    const calculateDistance = async () => {
      const service = new google.maps.DistanceMatrixService();
      
      try {
        const response = await service.getDistanceMatrix({
          origins: [orderDetails.pickupAddress],
          destinations: [orderDetails.deliveryAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        });

        if (response.rows[0].elements[0].status === "OK") {
          setDistance(response.rows[0].elements[0].distance.text);
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    };

    if (orderDetails.pickupAddress && orderDetails.deliveryAddress) {
      calculateDistance();
    }
  }, [orderDetails.pickupAddress, orderDetails.deliveryAddress]);

  const getVehicleName = (id: string) => {
    const vehicle = vehicleTypes.find(v => v.id === id);
    return vehicle ? vehicle.name : id;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Complétez votre demande</h1>
      
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
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Adresse de départ</h3>
            <p className="text-gray-600">{orderDetails.pickupAddress}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Adresse de livraison</h3>
            <p className="text-gray-600">{orderDetails.deliveryAddress}</p>
          </div>

          {distance && (
            <div>
              <h3 className="font-semibold mb-1">Distance</h3>
              <p className="text-gray-600">{distance}</p>
            </div>
          )}
          
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
