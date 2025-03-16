import { useState } from "react";
import { OrderState, ContactInfo, VehicleInfo } from "@/types/order";

export const useOrderDetails = (orderDetails: OrderState | null) => {
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
  const [pickupTime, setPickupTime] = useState<string>("08:00");
  const [deliveryTime, setDeliveryTime] = useState<string>("08:00");

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

  const handleDateTimeUpdate = (
    pickup: Date | undefined,
    delivery: Date | undefined,
    newPickupTime: string,
    newDeliveryTime: string
  ) => {
    setPickupDate(pickup);
    setDeliveryDate(delivery);
    setPickupTime(newPickupTime);
    setDeliveryTime(newDeliveryTime);
  };

  return {
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
  };
};
