import { useState } from "react";
import { OrderState, Quote } from "@/types/order";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DatesTimesSection } from "./DatesTimesSection";
import { AddressesSection } from "./AddressesSection";
import { ContactsSection } from "./ContactsSection";
import { VehiclesSection } from "./VehiclesSection";
import { QuoteFooter } from "./QuoteFooter";
import { useFileManagement } from "@/hooks/useFileManagement";
import { useVehicleManagement } from "@/hooks/useVehicleManagement";
import { useQuoteManagement } from "@/hooks/useQuoteManagement";
import { useTimeManagement } from "@/hooks/useTimeManagement";
import { generateQuotePDF } from "@/utils/pdfGenerator";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";

interface QuoteContentProps {
  orderDetails: OrderState;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderState | null>>;
}

export const QuoteContent = ({ orderDetails, setOrderDetails }: QuoteContentProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const { newFiles, handleFileChange, handleRemoveFile } = useFileManagement();
  const { handleDeleteVehicle, handleAddVehicle } = useVehicleManagement(
    orderDetails,
    setOrderDetails,
    setShowAddVehicleDialog
  );
  const { saveQuote } = useQuoteManagement();
  const { 
    pickupTime, 
    deliveryTime, 
    handlePickupTimeChange, 
    handleDeliveryTimeChange 
  } = useTimeManagement(orderDetails, setOrderDetails);
  const queryClient = useQueryClient();

  const handlePickupDateSelect = (date: Date | undefined) => {
    if (orderDetails && date) {
      setOrderDetails({
        ...orderDetails,
        pickupDate: date
      });
    }
  };

  const handleDeliveryDateSelect = (date: Date | undefined) => {
    if (orderDetails && date) {
      setOrderDetails({
        ...orderDetails,
        deliveryDate: date
      });
    }
  };

  const handleContactsUpdate = (pickup: any, delivery: any) => {
    if (orderDetails) {
      setOrderDetails({
        ...orderDetails,
        pickupContact: pickup,
        deliveryContact: delivery
      });
    }
  };

  const handleSubmitQuote = async () => {
    if (!orderDetails) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour envoyer un devis.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    const totalPriceHT = Number(orderDetails?.priceHT) * orderDetails?.vehicles.length;
    const quoteData: Quote = {
      id: crypto.randomUUID(),
      quote_number: '',
      pickupAddress: orderDetails.pickupAddress,
      deliveryAddress: orderDetails.deliveryAddress,
      vehicles: orderDetails.vehicles,
      totalPriceHT: Number(totalPriceHT.toFixed(2)),
      totalPriceTTC: Number((totalPriceHT * 1.2).toFixed(2)),
      distance: typeof orderDetails.distance === 'string' ? parseFloat(orderDetails.distance) : orderDetails.distance,
      status: 'pending',
      dateCreated: new Date(),
      pickupDate: orderDetails.pickupDate || new Date(),
      pickupTime: pickupTime,
      deliveryDate: orderDetails.deliveryDate || new Date(),
      deliveryTime: deliveryTime,
      pickupContact: orderDetails.pickupContact,
      deliveryContact: orderDetails.deliveryContact
    };

    try {
      await saveQuote(quoteData);
      await queryClient.invalidateQueries({ queryKey: ['pendingQuotes'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboardCounts'] });
      
      toast({
        title: "Devis envoyé",
        description: "Votre devis a été envoyé avec succès et est en attente de validation.",
      });
      
      navigate("/dashboard/client/pending-quotes");
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du devis. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const onGeneratePDF = () => {
    if (orderDetails) {
      generateQuotePDF({
        ...orderDetails,
        id: '',
        quote_number: '',
        totalPriceHT: Number(orderDetails.priceHT) * orderDetails.vehicles.length,
        totalPriceTTC: Number(orderDetails.priceHT) * orderDetails.vehicles.length * 1.2,
        status: 'pending',
        dateCreated: new Date()
      });
    }
  };

  const totalPriceHT = Number(orderDetails?.priceHT) * orderDetails?.vehicles.length;

  return (
    <>
      <DatesTimesSection 
        orderDetails={orderDetails}
        pickupTime={pickupTime}
        deliveryTime={deliveryTime}
        onPickupDateSelect={handlePickupDateSelect}
        onDeliveryDateSelect={handleDeliveryDateSelect}
        onPickupTimeChange={handlePickupTimeChange}
        onDeliveryTimeChange={handleDeliveryTimeChange}
      />
      
      <AddressesSection orderDetails={orderDetails} />
      
      <ContactsSection
        pickupContact={orderDetails.pickupContact}
        deliveryContact={orderDetails.deliveryContact}
        onContactsUpdate={handleContactsUpdate}
      />
      
      <VehiclesSection
        vehicles={orderDetails.vehicles}
        newFiles={newFiles}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        onDeleteVehicle={handleDeleteVehicle}
        onAddVehicle={handleAddVehicle}
        showAddVehicleDialog={showAddVehicleDialog}
        setShowAddVehicleDialog={setShowAddVehicleDialog}
      />
      
      <QuoteFooter
        totalPriceHT={totalPriceHT}
        onSubmitQuote={handleSubmitQuote}
        onGeneratePDF={onGeneratePDF}
      />
    </>
  );
};
