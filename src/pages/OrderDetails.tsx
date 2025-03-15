import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { OrderSummary } from "@/components/order/OrderSummary";
import { ContactsForm } from "@/components/order/ContactsForm";
import { VehiclesSection } from "@/components/order/VehiclesSection";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { Plus } from "lucide-react";
import { useScrollToElement } from "@/hooks/useScrollToElement";

interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
  pickupDate: Date | undefined;
  deliveryDate: Date | undefined;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface VehicleInfo {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  files: File[];
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
  const [pickupContact, setPickupContact] = useState<ContactInfo | null>(null);
  const [deliveryContact, setDeliveryContact] = useState<ContactInfo | null>(null);
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([]);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(orderDetails?.pickupDate);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(orderDetails?.deliveryDate);
  const scrollToElement = useScrollToElement();

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
    setVehicles(prev => prev.filter((_, i) => i !== indexToDelete));
  };

  const handleContactsUpdate = (pickup: ContactInfo, delivery: ContactInfo) => {
    setPickupContact(pickup);
    setDeliveryContact(delivery);
  };

  const handleVehicleUpdate = (index: number, vehicle: VehicleInfo) => {
    setVehicles(prev => {
      const newVehicles = [...prev];
      newVehicles[index] = vehicle;
      return newVehicles;
    });
  };

  const navigateToQuoteTotal = () => {
    if (orderDetails && pickupContact && deliveryContact) {
      navigate("/dashboard/client/quote-total", {
        state: {
          pickupAddress: orderDetails.pickupAddress,
          deliveryAddress: orderDetails.deliveryAddress,
          distance,
          pickupContact,
          deliveryContact,
          vehicles,
          priceHT,
          pickupDate,
          deliveryDate
        }
      });
    }
  };

  const handleShowContacts = () => {
    setShowContacts(true);
    setTimeout(() => scrollToElement('contacts-section'), 100);
  };

  const handleShowVehicle = () => {
    setShowVehicle(true);
    setTimeout(() => scrollToElement('vehicles-section'), 100);
  };

  const handleAddVehicle = () => {
    setVehicleCount(prev => prev + 1);
    setTimeout(() => scrollToElement('vehicles-section'), 100);
  };

  const handleDateUpdate = (pickup: Date | undefined, delivery: Date | undefined) => {
    setPickupDate(pickup);
    setDeliveryDate(delivery);
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
        onShowContacts={handleShowContacts}
        getVehicleName={getVehicleName}
        onDateUpdate={handleDateUpdate}
        pickupDate={pickupDate}
        deliveryDate={deliveryDate}
      />

      {showContacts && (
        <div id="contacts-section">
          <ContactsForm
            onContactsValid={setAreContactFieldsValid}
            onShowVehicle={handleShowVehicle}
            onContactsUpdate={handleContactsUpdate}
          />
        </div>
      )}

      {showVehicle && (
        <div id="vehicles-section">
          <VehiclesSection
            vehicleCount={vehicleCount}
            vehicleFormsValidity={vehicleFormsValidity}
            onVehicleValidityChange={handleVehicleValidityChange}
            onDeleteVehicle={deleteVehicle}
            onAddVehicle={handleAddVehicle}
            onVehicleUpdate={handleVehicleUpdate}
          />

          {vehicleCount > 0 && vehicleFormsValidity.some(validity => validity) && pickupDate && deliveryDate && (
            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={handleAddVehicle}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un véhicule
              </Button>

              <Button
                onClick={navigateToQuoteTotal}
                className="gap-2"
              >
                <Calculator className="h-4 w-4" />
                Obtenir votre devis
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
