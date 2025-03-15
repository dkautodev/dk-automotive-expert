import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from "react";
import { OrderState } from "@/types/order";
import { QuoteActions } from "@/components/quote/QuoteActions";
import { AddressesSection } from "@/components/quote/AddressesSection";
import { ContactsSection } from "@/components/quote/ContactsSection";
import { VehiclesSection } from "@/components/quote/VehiclesSection";
import { QuoteFooter } from "@/components/quote/QuoteFooter";
import { DatesTimesSection } from "@/components/quote/DatesTimesSection";
import { useFileManagement } from "@/hooks/useFileManagement";

const QuoteTotal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState(location.state as OrderState | null);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [pickupTime, setPickupTime] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const { newFiles, handleFileChange, handleRemoveFile, clearVehicleFiles } = useFileManagement();

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

  const handleDeleteVehicle = (index: number) => {
    if (orderDetails) {
      const updatedVehicles = orderDetails.vehicles.filter((_, i) => i !== index);
      setOrderDetails({
        ...orderDetails,
        vehicles: updatedVehicles
      });
      clearVehicleFiles(index);
    }
  };

  const handleAddVehicle = (newVehicle: any) => {
    if (orderDetails) {
      setOrderDetails({
        ...orderDetails,
        vehicles: [...orderDetails.vehicles, newVehicle]
      });
      setShowAddVehicleDialog(false);
    }
  };

  const handleSubmitQuote = () => {
    toast({
      title: "Devis envoyé",
      description: "Votre devis a été envoyé avec succès et est en attente de validation.",
    });
    
    navigate("/dashboard/client");
  };

  const generatePDF = () => {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
          <h1 style="color: #1a365d;">Devis de transport</h1>
          <div style="text-align: right;">
            <p style="color: #64748b; margin: 0;">Devis n° DEV-00000100</p>
            <p style="color: #64748b; margin: 0;">Date: ${format(new Date(), "dd/MM/yyyy")}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5282;">Adresses et dates</h2>
          <p><strong>Départ:</strong> ${orderDetails.pickupAddress}</p>
          <p><strong>Date de prise en charge:</strong> ${format(orderDetails.pickupDate, "PPP", { locale: fr })}</p>
          <p><strong>Livraison:</strong> ${orderDetails.deliveryAddress}</p>
          <p><strong>Date de livraison:</strong> ${format(orderDetails.deliveryDate, "PPP", { locale: fr })}</p>
          <p><strong>Distance:</strong> ${orderDetails.distance}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5282;">Contacts</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h3>Contact départ</h3>
              <p>${orderDetails.pickupContact.firstName} ${orderDetails.pickupContact.lastName}</p>
              <p>${orderDetails.pickupContact.email}</p>
              <p>${orderDetails.pickupContact.phone}</p>
            </div>
            <div>
              <h3>Contact livraison</h3>
              <p>${orderDetails.deliveryContact.firstName} ${orderDetails.deliveryContact.lastName}</p>
              <p>${orderDetails.deliveryContact.email}</p>
              <p>${orderDetails.deliveryContact.phone}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2c5282;">Véhicules</h2>
          ${orderDetails.vehicles.map(vehicle => `
            <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #e2e8f0;">
              <p><strong>Marque:</strong> ${vehicle.brand}</p>
              <p><strong>Modèle:</strong> ${vehicle.model}</p>
              <p><strong>Année:</strong> ${vehicle.year}</p>
              <p><strong>Carburant:</strong> ${vehicle.fuel}</p>
              <p><strong>Immatriculation:</strong> ${vehicle.licensePlate}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 30px; text-align: right;">
          <h2 style="color: #2c5282;">Prix Total HT: ${totalPriceHT}€</h2>
        </div>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: 'devis-transport.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  const totalPriceHT = Number(orderDetails?.priceHT) * orderDetails?.vehicles.length;

  return (
    <div className="p-6 space-y-6">
      <QuoteActions />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Récapitulatif de votre devis</CardTitle>
          <div className="text-sm text-muted-foreground">
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
            onGeneratePDF={generatePDF}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteTotal;
