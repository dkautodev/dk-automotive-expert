import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { OrderSummary } from "@/components/order/OrderSummary";
import { ContactsForm } from "@/components/order/ContactsForm";
import { VehiclesSection } from "@/components/order/VehiclesSection";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
}

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state as OrderState | null;
  const [distance, setDistance] = useState<string>("");
  const [priceHT] = useState("150");
  const [showContacts, setShowContacts] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [areContactFieldsValid, setAreContactFieldsValid] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [vehicleFormsValidity, setVehicleFormsValidity] = useState<boolean[]>([]);

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

  const handleVehicleValidityChange = (index: number, isValid: boolean) => {
    setVehicleFormsValidity(prev => {
      const newValidity = [...prev];
      newValidity[index] = isValid;
      return newValidity;
    });
  };

  const deleteVehicle = (indexToDelete: number) => {
    setVehicleCount(prev => prev - 1);
    setVehicleFormsValidity(prev => prev.filter((_, i) => i !== indexToDelete));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Complétez votre demande</h1>

      <OrderSummary
        pickupAddress={orderDetails.pickupAddress}
        deliveryAddress={orderDetails.deliveryAddress}
        selectedVehicle={orderDetails.selectedVehicle}
        distance={distance}
        priceHT={priceHT}
        onShowContacts={() => setShowContacts(true)}
        getVehicleName={getVehicleName}
      />

      {showContacts && (
        <ContactsForm
          onContactsValid={setAreContactFieldsValid}
          onShowVehicle={() => setShowVehicle(true)}
        />
      )}

      {showVehicle && (
        <VehiclesSection
          vehicleCount={vehicleCount}
          vehicleFormsValidity={vehicleFormsValidity}
          onVehicleValidityChange={handleVehicleValidityChange}
          onDeleteVehicle={deleteVehicle}
          onAddVehicle={() => setVehicleCount(prev => prev + 1)}
        />
      )}

      {vehicleCount > 0 && vehicleFormsValidity.some(validity => validity) && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => navigate("/dashboard/client/quote-total")}
            className="gap-2"
          >
            <Calculator className="h-4 w-4" />
            Obtenir votre devis
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
