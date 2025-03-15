
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PickupFormValues } from './pickupFormSchema';

interface ContactSectionProps {
  form: UseFormReturn<PickupFormValues>;
}

const ContactSection = ({ form }: ContactSectionProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              NOM DE LA SOCIÉTÉ <span className="text-blue-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Nom de la société" {...field} className="bg-[#EEF1FF]" />
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
              NOM <span className="text-blue-500">*</span>
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
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              PRÉNOM <span className="text-blue-500">*</span>
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
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              EMAIL <span className="text-blue-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="votre@email.com" {...field} className="bg-[#EEF1FF]" />
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
              TÉLÉPHONE <span className="text-blue-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Votre numéro" {...field} className="bg-[#EEF1FF]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactSection;

