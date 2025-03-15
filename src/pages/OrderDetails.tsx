
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { OrderSummary } from "@/components/order/OrderSummary";
import { ContactsForm } from "@/components/order/ContactsForm";
import { VehiclesSection } from "@/components/order/VehiclesSection";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { useScrollToElement } from "@/hooks/useScrollToElement";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollToElement = useScrollToElement();
  const orderDetails = location.state as OrderState | null;

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  const {
    distance,
    setDistance,
    priceHT,
    showContacts,
    setShowContacts,
    showVehicle,
    setShowVehicle,
    vehicleCount,
    setVehicleCount,
    vehicleFormsValidity,
    pickupContact,
    deliveryContact,
    vehicles,
    pickupDate,
    deliveryDate,
    handleVehicleValidityChange,
    deleteVehicle,
    handleContactsUpdate,
    handleVehicleUpdate,
    handleDateUpdate,
  } = useOrderDetails(orderDetails);

  useDistanceCalculation(orderDetails.pickupAddress, orderDetails.deliveryAddress, setDistance);

  const getVehicleName = (id: string) => {
    const vehicle = vehicleTypes.find(v => v.id === id);
    return vehicle ? vehicle.name : id;
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
