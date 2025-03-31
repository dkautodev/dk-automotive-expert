
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

interface YearFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

const YearField: React.FC<YearFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="year"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-dk-navy font-semibold">
            ANNÉE DU VÉHICULE <span className="text-red-500">*</span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-[#EEF1FF]">
                <SelectValue placeholder="Choisir une année" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default YearField;
