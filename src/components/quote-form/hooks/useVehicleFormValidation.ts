
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';

export const useVehicleFormValidation = (form: UseFormReturn<QuoteFormValues>) => {
  const handleValidation = () => {
    const vehicleData = {
      vehicle_type: form.getValues('vehicle_type'),
      brand: form.getValues('brand'),
      model: form.getValues('model'),
      year: form.getValues('year'),
      licensePlate: form.getValues('licensePlate'),
      fuel: form.getValues('fuel'),
    };
    
    const isValid = !form.formState.errors.vehicle_type && 
                   !form.formState.errors.brand &&
                   !form.formState.errors.model &&
                   !form.formState.errors.year &&
                   !form.formState.errors.licensePlate &&
                   !form.formState.errors.fuel;
                   
    return { vehicleData, isValid };
  };

  return { handleValidation };
};
