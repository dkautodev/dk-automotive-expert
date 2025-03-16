import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Calculator } from "lucide-react";
import { OrderSummary } from "@/components/order/OrderSummary";
import { ContactsForm } from "@/components/order/ContactsForm";
import { VehiclesSection } from "@/components/order/VehiclesSection";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { useScrollToElement } from "@/hooks/useScrollToElement";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import { OrderState } from "@/types/order";

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
    areContactFieldsValid,
    setAreContactFieldsValid,
    vehicleCount,
    setVehicleCount,
    vehicleFormsValidity,
    pickupContact,
    deliveryContact,
    vehicles,
    pickupDate,
    deliveryDate,
    pickupTime,
    deliveryTime,
    handleVehicleValidityChange,
    deleteVehicle,
    handleContactsUpdate,
    handleVehicleUpdate,
    handleDateUpdate,
    handleDateTimeUpdate
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
          pickupDate: orderDetails.pickupDate,
          deliveryDate: orderDetails.deliveryDate,
          pickupTime: pickupTime,
          deliveryTime: deliveryTime
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

  const canRequestQuote = vehicleCount > 0 && 
    vehicleFormsValidity.some(validity => validity) && 
    pickupDate instanceof Date && 
    deliveryDate instanceof Date;

  return <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Complétez votre demande</h1>

      <OrderSummary 
        pickupAddress={orderDetails.pickupAddress} 
        deliveryAddress={orderDetails.deliveryAddress} 
        selectedVehicle={orderDetails.selectedVehicle} 
        distance={distance} 
        priceHT={priceHT} 
        onShowContacts={handleShowContacts}
        getVehicleName={getVehicleName}
        onDateTimeUpdate={handleDateTimeUpdate}
        pickupDate={pickupDate}
        deliveryDate={deliveryDate}
        pickupTime={pickupTime}
        deliveryTime={deliveryTime}
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
            onQuoteRequest={navigateToQuoteTotal}
            canRequestQuote={canRequestQuote}
          />
        </div>
      )}
    </div>;
};

export default OrderDetails;
