
import { useState, useEffect } from "react";
import { OrderState } from "@/types/order";
import { format, setHours, setMinutes, addMinutes } from "date-fns";

export const useTimeManagement = (
  orderDetails: OrderState,
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderState | null>>
) => {
  const [pickupTime, setPickupTime] = useState<string>("08:00");
  const [deliveryTime, setDeliveryTime] = useState<string>("08:30");

  useEffect(() => {
    // Set default times when dates are selected
    if (orderDetails.pickupDate && !orderDetails.pickupTime) {
      const defaultPickupDate = setHours(setMinutes(orderDetails.pickupDate, 0), 8);
      setPickupTime("08:00");
      updateOrderDetails(defaultPickupDate, "08:00", "pickup");
    }

    if (orderDetails.deliveryDate && !orderDetails.deliveryTime) {
      const defaultDeliveryDate = addMinutes(setHours(setMinutes(orderDetails.deliveryDate, 30), 8), 30);
      setDeliveryTime("08:30");
      updateOrderDetails(defaultDeliveryDate, "08:30", "delivery");
    }

    // Sync existing times from orderDetails if they exist
    if (orderDetails.pickupTime) {
      setPickupTime(orderDetails.pickupTime);
    }
    if (orderDetails.deliveryTime) {
      setDeliveryTime(orderDetails.deliveryTime);
    }
  }, [orderDetails.pickupDate, orderDetails.deliveryDate]);

  const updateOrderDetails = (date: Date, time: string, type: 'pickup' | 'delivery') => {
    if (orderDetails) {
      const updatedOrderDetails = {
        ...orderDetails,
        [type === 'pickup' ? 'pickupTime' : 'deliveryTime']: time,
        [type === 'pickup' ? 'pickupDate' : 'deliveryDate']: date,
      };
      setOrderDetails(updatedOrderDetails);
    }
  };

  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setPickupTime(newTime);
    if (orderDetails && orderDetails.pickupDate) {
      const [hours, minutes] = newTime.split(':');
      const date = setHours(setMinutes(orderDetails.pickupDate, parseInt(minutes)), parseInt(hours));
      updateOrderDetails(date, newTime, 'pickup');
    }
  };

  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setDeliveryTime(newTime);
    if (orderDetails && orderDetails.deliveryDate) {
      const [hours, minutes] = newTime.split(':');
      const date = setHours(setMinutes(orderDetails.deliveryDate, parseInt(minutes)), parseInt(hours));
      updateOrderDetails(date, newTime, 'delivery');
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
