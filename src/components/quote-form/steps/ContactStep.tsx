
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';

interface ContactStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onSubmit: (data: QuoteFormValues) => void;
  onPrevious: () => void;
  loading: boolean;
}

const ContactStep = ({ form, onSubmit, onPrevious, loading }: ContactStepProps) => {
  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Vos coordonnées</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-dk-navy font-semibold">
                SOCIÉTÉ / ORGANISATION <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Votre entreprise" className="bg-[#EEF1FF]" {...field} />
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
                <Input placeholder="Votre prénom" className="bg-[#EEF1FF]" {...field} />
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
                <Input placeholder="Votre nom" className="bg-[#EEF1FF]" {...field} />
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
                <Input 
                  type="email"
                  placeholder="votre@email.com" 
                  className="bg-[#EEF1FF]" 
                  {...field} 
                />
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
                <Input placeholder="Votre numéro de téléphone" className="bg-[#EEF1FF]" {...field} />
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
              ENVOI EN COURS...
            </>
          ) : (
            'ENVOYER MA DEMANDE'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactStep;
