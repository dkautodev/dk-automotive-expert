
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { quoteFormSchema, type QuoteFormValues } from './quote-form/quoteFormSchema';
import VehicleDetailsForm from './quote-form/VehicleDetailsForm';
import AddressForm from './quote-form/AddressForm';
import ContactForm from './quote-form/ContactForm';
import { sendQuoteEmail } from '@/utils/emailService';

const QuoteForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuoteFormValues>>({});
  const [loading, setLoading] = useState(false);
  
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
      pickupStreetType: '',
      pickupStreetName: '',
      pickupComplement: '',
      pickupPostalCode: '',
      pickupCity: '',
      pickupCountry: 'France',
      
      // Champs pour l'adresse de livraison
      deliveryStreetNumber: '',
      deliveryStreetType: '',
      deliveryStreetName: '',
      deliveryComplement: '',
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

  const nextStep = (data: Partial<QuoteFormValues>) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setLoading(true);
    try {
      const completeData = { ...formData, ...data };
      setFormData(completeData);
      
      // Envoi d'email
      await sendQuoteEmail(completeData);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de devis a été envoyée avec succès.",
      });
      
      // Réinitialiser le formulaire
      form.reset();
      setFormData({});
      setStep(1);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <VehicleDetailsForm 
            form={form} 
            onNext={(data) => nextStep(data)} 
          />
        );
      case 2:
        return (
          <AddressForm 
            form={form} 
            onNext={(data) => nextStep(data)}
            onPrevious={prevStep}
          />
        );
      case 3:
        return (
          <ContactForm 
            form={form} 
            onSubmit={onSubmit}
            onPrevious={prevStep}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex justify-between mb-4">
          <div className={`h-2 bg-gray-200 rounded-full flex-1 mr-2 ${step >= 1 ? 'bg-[#1a237e]' : ''}`}></div>
          <div className={`h-2 bg-gray-200 rounded-full flex-1 mr-2 ${step >= 2 ? 'bg-[#1a237e]' : ''}`}></div>
          <div className={`h-2 bg-gray-200 rounded-full flex-1 ${step >= 3 ? 'bg-[#1a237e]' : ''}`}></div>
        </div>
        
        {renderStep()}
      </div>
    </Form>
  );
};

export default QuoteForm;
