
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuoteFormValues } from '../../quoteFormSchema';

interface FuelTypeFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

const FuelTypeField: React.FC<FuelTypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="fuelType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-dk-navy font-semibold">
            TYPE DE CARBURANT <span className="text-red-500">*</span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-[#EEF1FF]">
                <SelectValue placeholder="Choix du carburant" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="essence">Essence</SelectItem>
              <SelectItem value="electrique">Électrique</SelectItem>
              <SelectItem value="hybride">Hybride</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FuelTypeField;
