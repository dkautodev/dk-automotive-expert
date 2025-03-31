
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';

export const useVehicleFormValidation = (form: UseFormReturn<QuoteFormValues>) => {
  const handleValidation = () => {
    const vehicleData = {
      vehicleType: form.getValues('vehicleType'),
      brand: form.getValues('brand'),
      model: form.getValues('model'),
      year: form.getValues('year'),
      licensePlate: form.getValues('licensePlate'),
      fuelType: form.getValues('fuelType'),
    };
    
    const isValid = !form.formState.errors.vehicleType && 
                   !form.formState.errors.brand &&
                   !form.formState.errors.model &&
                   !form.formState.errors.year &&
                   !form.formState.errors.licensePlate &&
                   !form.formState.errors.fuelType;
                   
    return { vehicleData, isValid };
  };

  return { handleValidation };
};
