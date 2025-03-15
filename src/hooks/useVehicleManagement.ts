
import { useState } from 'react';
import { OrderState, Vehicle } from '@/types/order';
import { useFileManagement } from './useFileManagement';

export const useVehicleManagement = (
  orderDetails: OrderState,
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderState | null>>,
  setShowAddVehicleDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { clearVehicleFiles } = useFileManagement();

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

  const handleAddVehicle = (newVehicle: Vehicle) => {
    if (orderDetails) {
      setOrderDetails({
        ...orderDetails,
        vehicles: [...orderDetails.vehicles, newVehicle]
      });
      setShowAddVehicleDialog(false);
    }
  };

  return {
    handleDeleteVehicle,
    handleAddVehicle
  };
};
