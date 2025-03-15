import { useLocation, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, EuroIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const OrderDetails = () => {
  const location = useLocation();
  const orderDetails = location.state as OrderState | null;
  const [distance, setDistance] = useState<string>("");
  const [priceHT] = useState("150");
  const [showContacts, setShowContacts] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [pickupContact, setPickupContact] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [deliveryContact, setDeliveryContact] = useState<ContactInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

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
    <div className="p-6 space-y-6">
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
        <CardContent className="space-y-6">
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

          <div className="flex justify-end">
            <Button onClick={() => setShowContacts(true)}>Suivant</Button>
          </div>
        </CardContent>
      </Card>

      {showContacts && (
        <Card>
          <CardHeader>
            <CardTitle>Coordonnées de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact départ</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pickup-lastName">Nom</Label>
                    <Input
                      id="pickup-lastName"
                      value={pickupContact.lastName}
                      onChange={(e) => setPickupContact({...pickupContact, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-firstName">Prénom</Label>
                    <Input
                      id="pickup-firstName"
                      value={pickupContact.firstName}
                      onChange={(e) => setPickupContact({...pickupContact, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-email">Adresse mail</Label>
                    <Input
                      id="pickup-email"
                      type="email"
                      value={pickupContact.email}
                      onChange={(e) => setPickupContact({...pickupContact, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-phone">Téléphone</Label>
                    <Input
                      id="pickup-phone"
                      value={pickupContact.phone}
                      onChange={(e) => setPickupContact({...pickupContact, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact livraison</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="delivery-lastName">Nom</Label>
                    <Input
                      id="delivery-lastName"
                      value={deliveryContact.lastName}
                      onChange={(e) => setDeliveryContact({...deliveryContact, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-firstName">Prénom</Label>
                    <Input
                      id="delivery-firstName"
                      value={deliveryContact.firstName}
                      onChange={(e) => setDeliveryContact({...deliveryContact, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-email">Adresse mail</Label>
                    <Input
                      id="delivery-email"
                      type="email"
                      value={deliveryContact.email}
                      onChange={(e) => setDeliveryContact({...deliveryContact, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-phone">Téléphone</Label>
                    <Input
                      id="delivery-phone"
                      value={deliveryContact.phone}
                      onChange={(e) => setDeliveryContact({...deliveryContact, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowVehicle(true)}>Suivant</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showVehicle && (
        <Card>
          <CardHeader>
            <CardTitle>Véhicule.s</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Vehicle selection content will go here */}
          </CardContent>
        </Card>
      )}
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
