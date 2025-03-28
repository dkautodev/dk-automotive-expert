
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
      vehicleType: '',
      brand: '',
      model: '',
      year: '',
      licensePlate: '',
      fuelType: '',
      
      // Champs pour l'adresse de prise en charge
      pickupStreetNumber: '',
      pickupStreetType: 'Rue',
      pickupStreetName: '',
      pickupComplement: 'aucun',
      pickupPostalCode: '',
      pickupCity: '',
      pickupCountry: 'France',
      
      // Champs pour l'adresse de livraison
      deliveryStreetNumber: '',
      deliveryStreetType: 'Rue',
      deliveryStreetName: '',
      deliveryComplement: 'aucun',
      deliveryPostalCode: '',
      deliveryCity: '',
      deliveryCountry: 'France',
      
      // Champs d'adresse complète pour compatibilité
      pickupAddress: '',
      deliveryAddress: '',
      
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
        const pickupAddress = `${data.pickupStreetNumber || formData.pickupStreetNumber} ${data.pickupStreetType || formData.pickupStreetType} ${data.pickupStreetName || formData.pickupStreetName}, ${data.pickupPostalCode || formData.pickupPostalCode} ${data.pickupCity || formData.pickupCity}, ${data.pickupCountry || formData.pickupCountry}`;
        const deliveryAddress = `${data.deliveryStreetNumber || formData.deliveryStreetNumber} ${data.deliveryStreetType || formData.deliveryStreetType} ${data.deliveryStreetName || formData.deliveryStreetName}, ${data.deliveryPostalCode || formData.deliveryPostalCode} ${data.deliveryCity || formData.deliveryCity}, ${data.deliveryCountry || formData.deliveryCountry}`;
        
        // Calculer la distance
        setLoading(true);
        const distanceResult = await calculateDistance(pickupAddress, deliveryAddress);
        setDistance(distanceResult);
        
        // Calculer le prix si le type de véhicule est défini
        const vehicleType = formData.vehicleType;
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

  const handleSubmit = async (data: QuoteFormValues) => {
    setLoading(true);
    try {
      const completeData = { ...formData, ...data };
      setFormData(completeData);
      
      // Mise à jour des champs d'adresse complète avant l'envoi
      completeData.pickupAddress = `${completeData.pickupStreetNumber} ${completeData.pickupStreetType} ${completeData.pickupStreetName}, ${completeData.pickupPostalCode} ${completeData.pickupCity}, ${completeData.pickupCountry}`;
      completeData.deliveryAddress = `${completeData.deliveryStreetNumber} ${completeData.deliveryStreetType} ${completeData.deliveryStreetName}, ${completeData.deliveryPostalCode} ${completeData.deliveryCity}, ${completeData.deliveryCountry}`;
      
      // Créer une mission directement au lieu d'un devis
      const missionData = {
        status: 'en_attente',
        mission_type: 'livraison',
        pickup_address: completeData.pickupAddress,
        delivery_address: completeData.deliveryAddress,
        distance: distance ? `${distance} km` : null,
        price_ht: priceHT ? parseFloat(priceHT) : null,
        price_ttc: priceTTC ? parseFloat(priceTTC) : null,
        vehicle_info: {
          brand: completeData.brand,
          model: completeData.model,
          year: completeData.year,
          fuel: completeData.fuelType,
          licensePlate: completeData.licensePlate
        },
        pickup_contact: {
          firstName: completeData.firstName,
          lastName: completeData.lastName,
          email: completeData.email,
          phone: completeData.phone,
          company: completeData.company
        },
        delivery_contact: {
          firstName: completeData.firstName,
          lastName: completeData.lastName,
          email: completeData.email,
          phone: completeData.phone,
          company: completeData.company
        }
      };
      
      // Insérer la mission dans Supabase
      const { data: missionResult, error } = await supabase
        .from('missions')
        .insert(missionData)
        .select('mission_number')
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Demande envoyée",
        description: `Votre demande de mission a été envoyée avec succès. Numéro de mission: ${missionResult.mission_number}`,
      });
      
      // Réinitialiser le formulaire
      form.reset();
      setFormData({});
      setStep(1);
      setDistance(null);
      setPriceHT(null);
      setPriceTTC(null);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    step,
    loading,
    distance,
    priceHT,
    priceTTC,
    nextStep,
    prevStep,
    handleSubmit
  };
};
