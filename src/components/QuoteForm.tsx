
import { Form } from '@/components/ui/form';
import { QuoteFormValues } from './quote-form/quoteFormSchema';
import VehicleDetailsForm from './quote-form/VehicleDetailsForm';
import AddressForm from './quote-form/address-form';
import ContactForm from './quote-form/ContactForm';
import QuoteFormProgress from './quote-form/QuoteFormProgress';
import { useQuoteForm } from './quote-form/hooks/useQuoteForm';

const QuoteForm = () => {
  const {
    form,
    step,
    loading,
    distance,
    priceHT,
    priceTTC,
    nextStep,
    prevStep
  } = useQuoteForm();

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
            onSubmit={handleSubmit}
            onPrevious={prevStep}
            loading={loading}
            priceInfo={{
              distance: distance ? `${distance} km` : "En cours de calcul...",
              priceHT: priceHT || "En cours de calcul...",
              priceTTC: priceTTC || "En cours de calcul..."
            }}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (data: QuoteFormValues) => {
    try {
      const { error } = await supabase.functions.invoke('send-quote-request', {
        body: {
          ...data,
          pickup_contact: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
          },
          delivery_contact: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
          }
        }
      });

      if (error) throw error;

      toast.success('Votre demande de devis a été envoyée avec succès');
      form.reset();
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      toast.error(error.message || 'Une erreur est survenue lors de l\'envoi de votre demande');
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <QuoteFormProgress currentStep={step} />
        {renderStep()}
      </div>
    </Form>
  );
};

export default QuoteForm;
