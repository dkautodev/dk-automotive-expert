
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import AddressFormLayout from './AddressFormLayout';
import AddressSection from './AddressSection';
import { useAddressForm } from './useAddressForm';

interface AddressFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
}

const AddressForm = ({
  form,
  onNext,
  onPrevious
}: AddressFormProps) => {
  const {
    pickupCommunes,
    deliveryCommunes,
    isLoadingPickupCommunes,
    isLoadingDeliveryCommunes,
    handleNext,
    isFormValid
  } = useAddressForm(form);

  const onNextClick = () => {
    const { formData } = handleNext();
    
    if (isFormValid()) {
      onNext(formData);
    } else {
      form.trigger([
        'pickupStreetNumber', 'pickupStreetType', 'pickupStreetName', 
        'pickupPostalCode', 'pickupCity', 
        'deliveryStreetNumber', 'deliveryStreetType', 'deliveryStreetName', 
        'deliveryPostalCode', 'deliveryCity'
      ]);
    }
  };

  return (
    <AddressFormLayout
      form={form}
      onNext={onNext}
      onPrevious={onPrevious}
      handleNext={onNextClick}
    >
      <AddressSection
        title="ADRESSE DE PRISE EN CHARGE"
        form={form}
        prefix="pickup"
        communes={pickupCommunes}
        isLoadingCommunes={isLoadingPickupCommunes}
      />
      
      <AddressSection
        title="ADRESSE DE LIVRAISON"
        form={form}
        prefix="delivery"
        communes={deliveryCommunes}
        isLoadingCommunes={isLoadingDeliveryCommunes}
      />
    </AddressFormLayout>
  );
};

export default AddressForm;
