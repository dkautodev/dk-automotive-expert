
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/services/mockSupabaseClient';
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
    prevStep,
    onSubmit
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
            onSubmit={async (data) => {
              try {
                const result = await onSubmit(data);
                return result;
              } catch (error: any) {
                console.error('Error in submit handler:', error);
                return { success: false, error };
              }
            }}
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
