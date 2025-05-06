
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { UnifiedOrderFormProps } from "./types";
import { Contact, Vehicle } from "@/types/order";
import { VehiclesSection } from "@/components/order/VehiclesSection";
import { ContactFormSection } from "./ContactFormSection";
import { FormActions } from "./FormActions";

export const UnifiedOrderForm = ({
  orderDetails,
  onQuoteNumberGenerated,
  onSubmit
}: UnifiedOrderFormProps) => {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(orderDetails.pickupDate);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(orderDetails.deliveryDate);
  const [pickupTime, setPickupTime] = useState(orderDetails.pickupTime || "08:00");
  const [deliveryTime, setDeliveryTime] = useState(orderDetails.deliveryTime || "08:00");
  const [pickupContact, setPickupContact] = useState<Contact>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [deliveryContact, setDeliveryContact] = useState<Contact>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [vehicleFormsValidity, setVehicleFormsValidity] = useState<boolean[]>([]);
  const [globalFiles, setGlobalFiles] = useState<File[]>([]);

  const validateContact = (contact: Contact): boolean => {
    return !!(contact.firstName && 
      contact.lastName && 
      contact.email && 
      contact.phone && 
      contact.email.includes('@') && 
      contact.phone.length >= 10);
  };

  const isFormValid = (): boolean => {
    return !!(pickupDate && 
      deliveryDate && 
      pickupTime && 
      deliveryTime && 
      validateContact(pickupContact) && 
      validateContact(deliveryContact) && 
      vehicles.length > 0 && 
      vehicleFormsValidity.some(v => v));
  };

  const handleVehicleValidityChange = (index: number, isValid: boolean) => {
    setVehicleFormsValidity(prev => {
      const newValidity = [...prev];
      newValidity[index] = isValid;
      return newValidity;
    });
  };

  const handleVehicleUpdate = (index: number, vehicle: Vehicle) => {
    setVehicles(prev => {
      const newVehicles = [...prev];
      newVehicles[index] = vehicle;
      return newVehicles;
    });
  };

  const deleteVehicle = (indexToDelete: number) => {
    setVehicleCount(prev => prev - 1);
    setVehicleFormsValidity(prev => prev.filter((_, i) => i !== indexToDelete));
    setVehicles(prev => prev.filter((_, i) => i !== indexToDelete));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const formData = {
      ...orderDetails,
      pickupContact,
      deliveryContact,
      vehicles,
      pickupDate: pickupDate as Date,
      deliveryDate: deliveryDate as Date,
      pickupTime,
      deliveryTime
    };

    await onSubmit(formData);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6 w-full">
          <h2 className="text-xl font-semibold">Détails de prise en charge</h2>
          <ContactFormSection
            contact={pickupContact}
            onChange={setPickupContact}
            label="Contact départ"
            prefix="pickup"
          />
        </Card>

        <Card className="p-6 space-y-6 w-full">
          <h2 className="text-xl font-semibold">Détails de livraison</h2>
          <ContactFormSection
            contact={deliveryContact}
            onChange={setDeliveryContact}
            label="Contact livraison"
            prefix="delivery"
          />
        </Card>

        <div className="md:col-span-2">
          <VehiclesSection 
            vehicleCount={vehicleCount}
            vehicleFormsValidity={vehicleFormsValidity}
            onVehicleValidityChange={handleVehicleValidityChange}
            onDeleteVehicle={deleteVehicle}
            onVehicleUpdate={handleVehicleUpdate}
            setVehicleCount={setVehicleCount}
          />

          <FormActions 
            handleSubmit={handleSubmit}
            isFormValid={isFormValid()}
            globalFiles={globalFiles}
            setGlobalFiles={setGlobalFiles}
          />
        </div>
      </div>
    </div>
  );
};
