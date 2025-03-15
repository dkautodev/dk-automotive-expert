
import { useState } from "react";
import { OrderState } from "@/types/order";

export const useTimeManagement = (
  orderDetails: OrderState,
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderState | null>>
) => {
  const [pickupTime, setPickupTime] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");

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

  return {
    pickupTime,
    deliveryTime,
    setPickupTime,
    setDeliveryTime,
    handlePickupTimeChange,
    handleDeliveryTimeChange
  };
};
