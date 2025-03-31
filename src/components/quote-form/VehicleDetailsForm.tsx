
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { QuoteFormValues } from './quoteFormSchema';
import VehicleFormFields from './components/VehicleFormFields';
import VehicleDisclaimer from './components/VehicleDisclaimer';
import { useVehicleFormValidation } from './hooks/useVehicleFormValidation';

interface VehicleDetailsFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
}

const VehicleDetailsForm = ({ form, onNext }: VehicleDetailsFormProps) => {
  const { handleValidation } = useVehicleFormValidation(form);

  const handleNext = () => {
    const { vehicleData, isValid } = handleValidation();
    
    if (isValid) {
      onNext(vehicleData);
    } else {
      form.trigger(['vehicleType', 'brand', 'model', 'year', 'licensePlate', 'fuelType']);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy mb-4">Informations du véhicule</h2>
      
      <VehicleFormFields form={form} />

      <VehicleDisclaimer />

      <div className="flex justify-end mt-6">
        <Button 
          type="button" 
          onClick={handleNext} 
          className="bg-[#1a237e] hover:bg-[#3f51b5]"
        >
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default VehicleDetailsForm;
