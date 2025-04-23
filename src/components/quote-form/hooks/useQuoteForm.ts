
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { quoteFormSchema, type QuoteFormValues } from '../quoteFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { getPriceForVehicleAndDistance } from '@/services/pricingGridsService';
import { calculateTTC } from '@/utils/priceCalculations';
import { useDistanceCalculation } from '@/hooks/useDistanceCalculation';

export const useQuoteForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuoteFormValues>>({});
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [priceHT, setPriceHT] = useState<string | null>(null);
  const [priceTTC, setPriceTTC] = useState<string | null>(null);
  
  const { calculateDistance } = useDistanceCalculation();
  
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
      
      // Champs pour l'adresse de prise en charge
      pickupStreetNumber: '',
      pickupStreetType: 'Rue',
      pickupStreetName: '',
      pickupComplement: '',
      pickupPostalCode: '',
      pickupCity: '',
      pickupCountry: 'France',
      
      // Champs pour l'adresse de livraison
      deliveryStreetNumber: '',
      deliveryStreetType: 'Rue',
      deliveryStreetName: '',
      deliveryComplement: '',
      deliveryPostalCode: '',
      deliveryCity: '',
      deliveryCountry: 'France',
      
      // Champs d'adresse complète pour compatibilité
      pickup_address: '',
      delivery_address: '',
      
      // Contact
      company: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const nextStep = async (data: Partial<QuoteFormValues>) => {
    setFormData({ ...formData, ...data });
    
    // Si nous passons de l'étape 2 (adresses) à l'étape 3 (contact), calculer la distance et le prix
    if (step === 2) {
      try {
        // Construire les adresses complètes
        const pickupAddress = data.pickup_address || formData.pickup_address || '';
        const deliveryAddress = data.delivery_address || formData.delivery_address || '';
        
        // Calculer la distance
        setLoading(true);
        const distanceResult = await calculateDistance(pickupAddress, deliveryAddress);
        setDistance(distanceResult);
        
        // Calculer le prix si le type de véhicule est défini
        const vehicleType = formData.vehicle_type;
        if (vehicleType && distanceResult) {
          const price = await getPriceForVehicleAndDistance(vehicleType, distanceResult);
          setPriceHT(price.priceHT.toString());
          setPriceTTC(calculateTTC(price.priceHT.toString()));
        }
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du calcul de la distance ou du prix:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors du calcul de la distance ou du prix.",
        });
        setLoading(false);
      }
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
    nextStep,
    prevStep
  };
};
