
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QuoteFormValues } from './quoteFormSchema';
import { Loader } from '@/components/ui/loader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';

interface PriceInfo {
  distance: string;
  priceHT: string;
  priceTTC: string;
}

interface ContactFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onSubmit: (data: QuoteFormValues) => Promise<{ success: boolean; error?: any }>;
  onPrevious: () => void;
  loading: boolean;
  priceInfo?: PriceInfo;
}

const ContactForm = ({ form, onSubmit, onPrevious, loading, priceInfo }: ContactFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Clear error when form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (submitError) setSubmitError(null);
    });
    return () => subscription.unsubscribe();
  }, [form, submitError]);

  const handleSubmit = async () => {
    // Validate form first
    const isValid = await form.trigger();
    if (!isValid) {
      console.info('Form validation failed');
      return;
    }
    
    setSubmitError(null);
    try {
      const data = form.getValues();
      console.log('Submitting form with data:', data);
      const result = await onSubmit(data);
      
      if (!result.success && result.error) {
        setSubmitError(result.error.message || 'Erreur lors de l\'envoi du formulaire');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Erreur lors de l\'envoi du formulaire');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy mb-4">Vos coordonnées</h2>
      
      {submitError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      
      {priceInfo && (
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Résumé de votre demande</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Distance estimée:</p>
              <p className="text-lg">{priceInfo.distance}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Prix estimé:</p>
              <p className="text-lg">HT: {priceInfo.priceHT} €</p>
              <p className="text-lg">TTC: {priceInfo.priceTTC} €</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Ces tarifs sont donnés à titre indicatif et seront confirmés par notre équipe.
          </p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                SOCIÉTÉ / ORGANISATION <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre entreprise" {...field} className="bg-[#EEF1FF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                PRÉNOM <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre prénom" {...field} className="bg-[#EEF1FF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                NOM <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} className="bg-[#EEF1FF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                EMAIL <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="votre@email.com" {...field} className="bg-[#EEF1FF]" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                TÉLÉPHONE <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre numéro de téléphone" {...field} className="bg-[#EEF1FF]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          disabled={loading}
        >
          PRÉCÉDENT
        </Button>
        
        <Button 
          type="button" 
          onClick={handleSubmit} 
          className="bg-[#1a237e] hover:bg-[#3f51b5]" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              TRAITEMENT...
            </>
          ) : (
            'ENVOYER VOTRE DEMANDE'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactForm;
