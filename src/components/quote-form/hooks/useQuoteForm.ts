
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
    setPriceTTC
  } = useQuoteFormState();
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      pickup_address: '',
      delivery_address: '',
      vehicle_type: '',
      // Champs d'adresse détaillés
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
      // Détails du véhicule
      brand: '',
      model: '',
      year: '',
      fuel: '',
      licensePlate: '',
      vin: '',
      // Contact
      company: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      additionalInfo: '',
    }
  });

  const { onSubmit } = useQuoteSubmission(form, setLoading, setStep, distance, priceHT, priceTTC);

  const nextStep = async (data: Partial<QuoteFormValues>) => {
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
    setDistance,
    setPriceHT,
    setPriceTTC,
    nextStep,
    prevStep,
    onSubmit
  };
};
