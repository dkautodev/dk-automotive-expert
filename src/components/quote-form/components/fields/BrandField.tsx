
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
import { carBrands } from '../../vehicleData';

interface BrandFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

const BrandField: React.FC<BrandFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="brand"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-dk-navy font-semibold">
            MARQUE DU VÉHICULE <span className="text-red-500">*</span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-[#EEF1FF]">
                <SelectValue placeholder="Choisir une marque" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {carBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
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

export default BrandField;
