
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { getCommunesByPostalCode, type Commune } from '@/utils/locationService';

export const useAddressForm = (form: UseFormReturn<QuoteFormValues>) => {
  const [pickupCommunes, setPickupCommunes] = useState<Commune[]>([]);
  const [deliveryCommunes, setDeliveryCommunes] = useState<Commune[]>([]);
  const [isLoadingPickupCommunes, setIsLoadingPickupCommunes] = useState(false);
  const [isLoadingDeliveryCommunes, setIsLoadingDeliveryCommunes] = useState(false);

  useEffect(() => {
    const postalCode = form.watch('pickupPostalCode');
    const fetchPickupCommunes = async () => {
      if (postalCode && postalCode.length === 5) {
        setIsLoadingPickupCommunes(true);
        const communes = await getCommunesByPostalCode(postalCode);
        setPickupCommunes(communes);
        setIsLoadingPickupCommunes(false);
        
        if (communes.length === 1) {
          form.setValue('pickupCity', communes[0].nom);
        }
      } else {
        setPickupCommunes([]);
      }
    };
    
    fetchPickupCommunes();
  }, [form.watch('pickupPostalCode')]);

  useEffect(() => {
    const postalCode = form.watch('deliveryPostalCode');
    const fetchDeliveryCommunes = async () => {
      if (postalCode && postalCode.length === 5) {
        setIsLoadingDeliveryCommunes(true);
        const communes = await getCommunesByPostalCode(postalCode);
        setDeliveryCommunes(communes);
        setIsLoadingDeliveryCommunes(false);
        
        if (communes.length === 1) {
          form.setValue('deliveryCity', communes[0].nom);
        }
      } else {
        setDeliveryCommunes([]);
      }
    };
    
    fetchDeliveryCommunes();
  }, [form.watch('deliveryPostalCode')]);

  const handleNext = () => {
    const pickupComplement = form.getValues('pickupComplement') ? `, ${form.getValues('pickupComplement')}` : '';
    const deliveryComplement = form.getValues('deliveryComplement') ? `, ${form.getValues('deliveryComplement')}` : '';
    
    const pickupAddress = `${form.getValues('pickupStreetNumber')} ${form.getValues('pickupStreetType')} ${form.getValues('pickupStreetName')}${pickupComplement}, ${form.getValues('pickupPostalCode')} ${form.getValues('pickupCity')}, ${form.getValues('pickupCountry')}`;
    const deliveryAddress = `${form.getValues('deliveryStreetNumber')} ${form.getValues('deliveryStreetType')} ${form.getValues('deliveryStreetName')}${deliveryComplement}, ${form.getValues('deliveryPostalCode')} ${form.getValues('deliveryCity')}, ${form.getValues('deliveryCountry')}`;

    form.setValue('pickup_address', pickupAddress);
    form.setValue('delivery_address', deliveryAddress);
    
    return {
      formData: {
        pickupStreetNumber: form.getValues('pickupStreetNumber'),
        pickupStreetType: form.getValues('pickupStreetType'),
        pickupStreetName: form.getValues('pickupStreetName'),
        pickupComplement: form.getValues('pickupComplement'),
        pickupPostalCode: form.getValues('pickupPostalCode'),
        pickupCity: form.getValues('pickupCity'),
        pickupCountry: form.getValues('pickupCountry'),
        deliveryStreetNumber: form.getValues('deliveryStreetNumber'),
        deliveryStreetType: form.getValues('deliveryStreetType'),
        deliveryStreetName: form.getValues('deliveryStreetName'),
        deliveryComplement: form.getValues('deliveryComplement'),
        deliveryPostalCode: form.getValues('deliveryPostalCode'),
        deliveryCity: form.getValues('deliveryCity'),
        deliveryCountry: form.getValues('deliveryCountry'),
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress
      }
    };
  };

  const isFormValid = () => {
    const pickupFieldsValid = !form.formState.errors.pickupStreetNumber && 
                             !form.formState.errors.pickupStreetType && 
                             !form.formState.errors.pickupStreetName && 
                             !form.formState.errors.pickupPostalCode && 
                             !form.formState.errors.pickupCity;
    
    const deliveryFieldsValid = !form.formState.errors.deliveryStreetNumber && 
                               !form.formState.errors.deliveryStreetType && 
                               !form.formState.errors.deliveryStreetName && 
                               !form.formState.errors.deliveryPostalCode && 
                               !form.formState.errors.deliveryCity;
    
    return pickupFieldsValid && deliveryFieldsValid;
  };

  return {
    pickupCommunes,
    deliveryCommunes,
    isLoadingPickupCommunes,
    isLoadingDeliveryCommunes,
    handleNext,
    isFormValid
  };
};
