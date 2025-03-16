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
import { supabase } from "@/integrations/supabase/client";
import { generateQuotePDF } from "@/utils/pdfGenerator";
import { toast } from "@/components/ui/use-toast";

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
    handleDateTimeUpdate
  } = useOrderDetails(orderDetails);

  useDistanceCalculation(orderDetails.pickupAddress, orderDetails.deliveryAddress, setDistance);

  const getVehicleName = (id: string) => {
    const vehicle = vehicleTypes.find(v => v.id === id);
    return vehicle ? vehicle.name : id;
  };

  const navigateToQuoteTotal = async () => {
    if (orderDetails && pickupContact && deliveryContact) {
      try {
        const totalPriceHT = parseFloat(priceHT);
        const totalPriceTTC = totalPriceHT * 1.20;

        const { data: quoteData, error: quoteError } = await supabase
          .from('quotes')
          .insert({
            pickup_address: orderDetails.pickupAddress,
            delivery_address: orderDetails.deliveryAddress,
            vehicles: vehicles,
            total_price_ht: totalPriceHT,
            total_price_ttc: totalPriceTTC,
            distance: distance,
            pickup_date: pickupDate,
            delivery_date: deliveryDate,
            pickup_time: pickupTime,
            delivery_time: deliveryTime,
            pickup_contact: pickupContact,
            delivery_contact: deliveryContact
          })
          .select()
          .single();

        if (quoteError) throw quoteError;

        const quote = {
          id: quoteData.id,
          quote_number: quoteData.quote_number,
          pickupAddress: orderDetails.pickupAddress,
          deliveryAddress: orderDetails.deliveryAddress,
          vehicles,
          totalPriceHT,
          totalPriceTTC,
          distance: parseFloat(distance),
          status: quoteData.status,
          dateCreated: new Date(quoteData.date_created),
          pickupDate: pickupDate as Date,
          pickupTime,
          deliveryDate: deliveryDate as Date,
          deliveryTime,
          pickupContact,
          deliveryContact
        };

        generateQuotePDF(quote);

        toast({
          title: "Devis créé avec succès",
          description: "Le PDF a été généré et téléchargé"
        });

        navigate("/dashboard/client/pending-invoices");
      } catch (error) {
        console.error("Error creating quote:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création du devis",
          variant: "destructive"
        });
      }
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
      distance={distance} 
      priceHT={priceHT} 
      onShowContacts={handleShowContacts}
      getVehicleName={getVehicleName}
      onDateTimeUpdate={handleDateTimeUpdate}
      pickupDate={pickupDate}
      deliveryDate={deliveryDate}
      pickupTime={pickupTime}
      deliveryTime={deliveryTime}
      selectedVehicleType={orderDetails.selectedVehicle}
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
          onVehicleUpdate={handleVehicleUpdate}
          onQuoteRequest={navigateToQuoteTotal}
          canRequestQuote={canRequestQuote}
          setVehicleCount={setVehicleCount}
        />
      </div>
    )}
  </div>;
};

export default OrderDetails;
