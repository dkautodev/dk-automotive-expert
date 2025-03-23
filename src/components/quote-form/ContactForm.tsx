
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QuoteFormValues } from './quoteFormSchema';

interface ContactFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onSubmit: (data: QuoteFormValues) => void;
  onPrevious: () => void;
  loading: boolean;
}

const ContactForm = ({ form, onSubmit, onPrevious, loading }: ContactFormProps) => {
  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy mb-4">Vos coordonnées</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                SOCIÉTÉ <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nom de votre société" 
                  {...field} 
                  className="bg-[#EEF1FF]"
                />
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
                <Input 
                  placeholder="Votre nom" 
                  {...field} 
                  className="bg-[#EEF1FF]"
                />
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
                <Input 
                  placeholder="Votre prénom" 
                  {...field} 
                  className="bg-[#EEF1FF]"
                />
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
                EMAIL PROFESSIONNEL <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="Votre email professionnel" 
                  {...field} 
                  className="bg-[#EEF1FF]"
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
                <Input 
                  placeholder="Votre numéro de téléphone" 
                  {...field} 
                  className="bg-[#EEF1FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="text-sm text-gray-600 mt-6">
        En soumettant ce formulaire, vous acceptez que les informations saisies soient utilisées pour vous contacter dans le cadre de votre demande de devis.
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
          className="bg-white"
          disabled={loading}
        >
          RETOUR
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          className="bg-[#1a237e] hover:bg-[#3f51b5]"
          disabled={loading}
        >
          {loading ? "ENVOI EN COURS..." : "ENVOYER MA DEMANDE"}
        </Button>
      </div>
    </div>
  );
};

export default ContactForm;
