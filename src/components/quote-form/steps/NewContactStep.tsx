import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QuoteFormValues } from '../quoteFormSchema';
import { Loader } from '@/components/ui/loader';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, User, Send, MapPin, Info } from 'lucide-react';
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
const NewContactStep = ({
  form,
  onSubmit,
  onPrevious,
  loading,
  priceInfo
}: NewContactStepProps) => {
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
      const quoteData = {
        ...data,
        distance: priceInfo?.distance?.replace(' km', '') || '',
        price_ht: priceInfo?.priceHT || '',
        price_ttc: priceInfo?.priceTTC || ''
      };
      navigate('/pre-commande', {
        state: quoteData
      });
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
  return <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-dk-navy/10 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-dk-navy" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-dk-navy">Vos coordonnées</h2>
          <p className="text-sm text-muted-foreground">Pour que nous puissions vous recontacter</p>
        </div>
      </div>
      
      {submitError && <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>}
      
      {/* Price Summary Card */}
      {priceInfo && <div className="bg-dk-navy/5 border border-dk-navy/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-dk-navy" />
            <h3 className="font-semibold text-dk-navy">Résumé de votre demande</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-3 text-center border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Distance</p>
              <p className="text-lg font-bold text-dk-navy">{priceInfo.distance}</p>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Prix HT</p>
              <p className="text-lg font-bold text-dk-navy">{priceInfo.priceHT} €</p>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Prix TTC</p>
              <p className="text-lg font-bold text-green-600">{priceInfo.priceTTC} €</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Ces tarifs sont donnés à titre indicatif et seront confirmés par notre équipe.
          </p>
        </div>}
      
      {/* Contact Form Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <FormField control={form.control} name="company" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                SOCIÉTÉ / ORGANISATION 
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre entreprise" {...field} className="bg-muted/50 border-border focus-visible:ring-dk-navy" />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name="firstName" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                PRÉNOM <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre prénom" {...field} className="bg-muted/50 border-border focus-visible:ring-dk-navy" />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name="lastName" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                NOM <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} className="bg-muted/50 border-border focus-visible:ring-dk-navy" />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name="email" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                EMAIL <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="votre@email.com" {...field} className="bg-muted/50 border-border focus-visible:ring-dk-navy" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name="phone" render={({
        field
      }) => <FormItem className="sm:col-span-2">
              <FormLabel className="text-dk-navy font-semibold">
                TÉLÉPHONE <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre numéro de téléphone" {...field} className="bg-muted/50 border-border focus-visible:ring-dk-navy" />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <FormField control={form.control} name="additionalInfo" render={({
      field
    }) => <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              INFORMATIONS COMPLÉMENTAIRES
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Ajoutez des informations supplémentaires concernant votre demande" className="bg-muted/50 border-border focus-visible:ring-dk-navy min-h-[100px] resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      {/* Navigation and Submit */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onPrevious} disabled={loading} className="border-border hover:bg-muted">
          PRÉCÉDENT
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="button" onClick={handleSubmit} className="bg-dk-navy hover:bg-dk-blue text-white" disabled={loading}>
            {loading ? <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                TRAITEMENT...
              </> : <>
                <Send className="mr-2 h-4 w-4" />
                ENVOYER LA DEMANDE
              </>}
          </Button>
          
          <Button type="button" onClick={handlePreOrder} className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            <CreditCard className="mr-2 h-4 w-4" />
            PRÉ-COMMANDER
          </Button>
        </div>
      </div>
      
      {/* Explanation Text */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-3 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Pré-commander votre mission</strong> via notre formulaire sécurisé pour choisir votre date, votre horaire et renseigner les informations de votre véhicule. Dès validation, l'un de nos conseillers vous contactera pour confirmer votre mission.
        </p>
        <p>
          Si vous souhaitez obtenir plus d'informations, <strong className="text-foreground">envoyez-nous votre demande</strong> ! Un conseiller vous recontactera gratuitement dans les plus brefs délais.
        </p>
      </div>
    </div>;
};
export default NewContactStep;