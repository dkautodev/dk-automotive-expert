
import { useState } from 'react';
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
import { QuoteFormValues } from '../quoteFormSchema';
import { Loader } from '@/components/ui/loader';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PriceInfo {
  distance: string;
  priceHT: string;
  priceTTC: string;
  isPerKm?: boolean;
}

interface ContactStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onSubmit: (data: QuoteFormValues) => void;
  onPrevious: () => void;
  loading: boolean;
  priceInfo?: PriceInfo;
}

const ContactStep = ({ form, onSubmit, onPrevious, loading, priceInfo }: ContactStepProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Fonction explicite pour le débogage et gestion de soumission
  const handleSubmit = async () => {
    console.log("Submit button clicked");
    
    try {
      // Déclencher la validation du formulaire complet
      const isValid = await form.trigger();
      console.log("Form values before validation:", form.getValues());
      console.log("Form validation result:", isValid);
      console.log("Form errors:", form.formState.errors);
      
      if (!isValid) {
        console.error("Form validation failed with errors:", form.formState.errors);
        setSubmitError("Veuillez remplir tous les champs obligatoires.");
        return;
      }
      
      // Ajouter les champs calculés si disponibles
      if (priceInfo && priceInfo.distance) {
        form.setValue('distance', priceInfo.distance.replace(' km', ''));
      }
      if (priceInfo && priceInfo.priceHT) {
        form.setValue('price_ht', priceInfo.priceHT);
      }
      if (priceInfo && priceInfo.priceTTC) {
        form.setValue('price_ttc', priceInfo.priceTTC);
      }
      
      const data = form.getValues();
      console.log("Form validated successfully, data:", data);
      setSubmitError(null);
      onSubmit(data);
    } catch (error: any) {
      console.error("Error during form submission:", error);
      setSubmitError(error.message || "Erreur lors de la soumission du formulaire");
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
              <p className="text-sm font-medium">Type de tarif:</p>
              <p className="text-lg font-medium">{priceInfo.isPerKm ? 'Prix au kilomètre' : 'Prix forfaitaire'}</p>
              <p className="text-lg">HT: {priceInfo.priceHT} €</p>
              <p className="text-lg">TTC: {priceInfo.priceTTC} €</p>
              {priceInfo.isPerKm && priceInfo.distance && priceInfo.priceHT && (
                <p className="text-sm text-gray-600">
                  ({(parseFloat(priceInfo.priceHT) / parseFloat(priceInfo.distance.replace(' km', ''))).toFixed(2)} € HT/km)
                </p>
              )}
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

      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              INFORMATIONS COMPLÉMENTAIRES
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ajoutez des informations supplémentaires concernant votre demande"
                className="bg-[#EEF1FF] min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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

export default ContactStep;
