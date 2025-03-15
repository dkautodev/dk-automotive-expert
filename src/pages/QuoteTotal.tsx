import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { OrderState, Quote } from "@/types/order";
import { QuoteActions } from "@/components/quote/QuoteActions";
import { AddressesSection } from "@/components/quote/AddressesSection";
import { ContactsSection } from "@/components/quote/ContactsSection";
import { VehiclesSection } from "@/components/quote/VehiclesSection";
import { QuoteFooter } from "@/components/quote/QuoteFooter";
import { DatesTimesSection } from "@/components/quote/DatesTimesSection";
import { useFileManagement } from "@/hooks/useFileManagement";
import { generateQuotePDF } from "@/utils/pdfGenerator";
import { useVehicleManagement } from "@/hooks/useVehicleManagement";
import { useQuoteManagement } from "@/hooks/useQuoteManagement";

const QuoteTotal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState(location.state as OrderState | null);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [pickupTime, setPickupTime] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const { newFiles, handleFileChange, handleRemoveFile } = useFileManagement();
  const { handleDeleteVehicle, handleAddVehicle } = useVehicleManagement(
    orderDetails!,
    setOrderDetails,
    setShowAddVehicleDialog
  );
  const { saveQuote } = useQuoteManagement();

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

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

  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupTime(e.target.value);
    if (orderDetails) {
      const date = new Date(orderDetails.pickupDate);
      const [hours, minutes] = e.target.value.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      setOrderDetails({
        ...orderDetails,
        pickupDate: date
      });
    }
  };

  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryTime(e.target.value);
    if (orderDetails) {
      const date = new Date(orderDetails.deliveryDate);
      const [hours, minutes] = e.target.value.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
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

    const newQuote: Quote = {
      id: Math.random().toString(36).substring(7),
      dateCreated: new Date(),
      pickupAddress: orderDetails.pickupAddress,
      deliveryAddress: orderDetails.deliveryAddress,
      vehicles: orderDetails.vehicles,
      totalPriceHT: totalPriceHT,
      status: 'pending'
    };

    try {
      await saveQuote(newQuote);
      
      toast({
        title: "Devis envoyé",
        description: "Votre devis a été envoyé avec succès et est en attente de validation.",
      });
      
      navigate("/dashboard/client/pending-quotes");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du devis.",
        variant: "destructive"
      });
    }
  };

  const totalPriceHT = Number(orderDetails?.priceHT) * orderDetails?.vehicles.length;

  return (
    <div className="space-y-6">
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50 shadow-sm">
        <div className="container py-4">
          <QuoteActions />
        </div>
      </div>
      
      <div className="container pt-20 pb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Récapitulatif de votre devis</CardTitle>
            <div className="text-sm font-semibold text-muted-foreground">
              DEV-00000100
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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
              onGeneratePDF={() => generateQuotePDF(orderDetails, totalPriceHT)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteTotal;
