
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CreditCard } from 'lucide-react';

interface PriceInfo {
  distance: string;
  priceHT: string;
  priceTTC: string;
}

interface NewContactStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onSubmit: (data: QuoteFormValues) => void;
  onPrevious: () => void;
  loading: boolean;
  priceInfo?: PriceInfo;
}

const NewContactStep = ({ form, onSubmit, onPrevious, loading, priceInfo }: NewContactStepProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const subscription = form.watch(() => {
      if (submitError) setSubmitError(null);
    });
    return () => subscription.unsubscribe();
  }, [form, submitError]);

  const handlePreOrder = async () => {
    try {
      const isValid = await form.trigger();
      
      if (!isValid) {
        setSubmitError("Veuillez remplir tous les champs obligatoires pour pré-commander.");
        return;
      }
      
      const data = form.getValues();
      
      // Préparer les données pour la page de pré-commande
      const quoteData = {
        ...data,
        distance: priceInfo?.distance?.replace(' km', '') || '',
        price_ht: priceInfo?.priceHT || '',
        price_ttc: priceInfo?.priceTTC || '',
      };
      
      // Naviguer vers la page de pré-commande avec les données
      navigate('/pre-commande', { state: quoteData });
    } catch (error: any) {
      setSubmitError(error.message || "Erreur lors de la validation du formulaire");
    }
  };
  
  const handleSubmit = async () => {
    try {
      const isValid = await form.trigger();
      
      if (!isValid) {
        setSubmitError("Veuillez remplir tous les champs obligatoires.");
        return;
      }
      
      if (priceInfo) {
        if (priceInfo.distance) {
          form.setValue('distance', priceInfo.distance.replace(' km', ''));
        }
        if (priceInfo.priceHT) {
          form.setValue('price_ht', priceInfo.priceHT);
        }
        if (priceInfo.priceTTC) {
          form.setValue('price_ttc', priceInfo.priceTTC);
        }
      }
      
      const data = form.getValues();
      setSubmitError(null);
      onSubmit(data);
    } catch (error: any) {
      setSubmitError(error.message || "Erreur lors de la soumission du formulaire");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Étape 3: Vos coordonnées</h2>
      
      {submitError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      
      {priceInfo && (
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Résumé de votre demande</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Distance estimée:</p>
              <p className="text-lg">{priceInfo.distance}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Prix HT:</p>
              <p className="text-lg font-semibold">{priceInfo.priceHT} €</p>
            </div>
            <div>
              <p className="text-sm font-medium">Prix TTC:</p>
              <p className="text-lg font-semibold">{priceInfo.priceTTC} €</p>
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
            <FormItem className="md:col-span-2">
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

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          disabled={loading}
        >
          PRÉCÉDENT
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-3">
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
              'ENVOYER LA DEMANDE GRATUITEMENT'
            )}
          </Button>
          
          <Button 
            type="button" 
            onClick={handlePreOrder} 
            className="bg-green-600 hover:bg-green-700 text-white" 
            disabled={loading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            PRÉ-COMMANDER
          </Button>
        </div>
      </div>
      
      <div className="mt-6 space-y-4 text-sm text-gray-600">
        <p>
          <strong>Pré-commander votre mission</strong> via notre formulaire sécurisé pour choisir votre date, votre horaire et renseigner les informations de votre véhicule. Dès validation, l'un de nos conseillers vous contactera pour confirmer votre mission et finaliser les derniers détails ensemble.
        </p>
        <p>
          Si vous souhaitez obtenir plus d'informations sur nos solutions de convoyage, <strong>envoyez‑nous votre demande</strong> ! Un conseiller vous recontactera gratuitement dans les plus brefs délais pour répondre à toutes vos questions et vous aider à planifier votre transfert en toute tranquillité.
        </p>
      </div>
    </div>
  );
};

export default NewContactStep;
