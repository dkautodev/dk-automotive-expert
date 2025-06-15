
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteFormSchema, type QuoteFormValues } from '../quoteFormSchema';
import { useQuoteFormState } from './useQuoteFormState';
import { useQuoteSubmission } from './useQuoteSubmission';

export const useQuoteForm = () => {
  const {
    step,
    setStep,
    loading,
    setLoading,
    distance,
    setDistance,
    priceHT,
    setPriceHT,
    priceTTC,
    setPriceTTC,
    isPerKm,
    setIsPerKm,
    formValidated,
    setFormValidated
  } = useQuoteFormState();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      mission_type: 'livraison',
      vehicle_type: '',
      brand: '',
      model: '',
      year: '',
      fuel: '',
      licensePlate: '',
      pickup_address: '',
      delivery_address: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      pickupStreetNumber: '',
      pickupStreetType: 'Rue',
      pickupStreetName: '',
      pickupComplement: '',
      pickupPostalCode: '',
      pickupCity: '',
      pickupCountry: 'France',
      deliveryStreetNumber: '',
      deliveryStreetType: 'Rue',
      deliveryStreetName: '',
      deliveryComplement: '',
      deliveryPostalCode: '',
      deliveryCity: '',
      deliveryCountry: 'France',
      additionalInfo: '',
    }
  });

  const { onSubmit } = useQuoteSubmission(form, setLoading, setStep, distance, priceHT, priceTTC, isPerKm);

  const nextStep = async (data: Partial<QuoteFormValues>) => {
    if (step === 2) {
      setFormValidated(true);
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return {
    form,
    step,
    loading,
    distance,
    priceHT,
    priceTTC,
    isPerKm,
    formValidated,
    setDistance,
    setPriceHT,
    setPriceTTC,
    setIsPerKm,
    nextStep,
    prevStep,
    onSubmit
  };
};
