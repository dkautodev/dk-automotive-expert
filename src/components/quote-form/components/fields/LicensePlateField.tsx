
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuoteFormValues } from '../../quoteFormSchema';

interface LicensePlateFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

const LicensePlateField: React.FC<LicensePlateFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="licensePlate"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-dk-navy font-semibold">
            IMMATRICULATION <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Input 
              placeholder="Exemple : AA-000-AA" 
              {...field} 
              className="bg-[#EEF1FF] uppercase"
              onChange={e => field.onChange(e.target.value.toUpperCase())}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LicensePlateField;
