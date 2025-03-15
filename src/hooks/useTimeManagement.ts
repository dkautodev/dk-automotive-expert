
import { useState, useEffect } from "react";
import { OrderState } from "@/types/order";
import { format } from "date-fns";

export const useTimeManagement = (
  orderDetails: OrderState,
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderState | null>>
) => {
  const [pickupTime, setPickupTime] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");

  useEffect(() => {
    if (orderDetails.pickupDate) {
      setPickupTime(format(orderDetails.pickupDate, 'HH:mm'));
    }
    if (orderDetails.deliveryDate) {
      setDeliveryTime(format(orderDetails.deliveryDate, 'HH:mm'));
    }
  }, [orderDetails.pickupDate, orderDetails.deliveryDate]);

  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setPickupTime(newTime);
    if (orderDetails && orderDetails.pickupDate) {
      const date = new Date(orderDetails.pickupDate);
      const [hours, minutes] = newTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      const updatedOrderDetails = {
        ...orderDetails,
        pickupDate: date,
        pickupTime: newTime
      };
      setOrderDetails(updatedOrderDetails);
    }
  };

  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setDeliveryTime(newTime);
    if (orderDetails && orderDetails.deliveryDate) {
      const date = new Date(orderDetails.deliveryDate);
      const [hours, minutes] = newTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      const updatedOrderDetails = {
        ...orderDetails,
        deliveryDate: date,
        deliveryTime: newTime
      };
      setOrderDetails(updatedOrderDetails);
    }
  };

  return {
    pickupTime,
    deliveryTime,
    setPickupTime,
    setDeliveryTime,
    handlePickupTimeChange,
    handleDeliveryTimeChange
  };
};
