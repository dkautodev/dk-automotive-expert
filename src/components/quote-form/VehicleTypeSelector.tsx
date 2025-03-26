
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from './quoteFormSchema';
import { vehicleTypes } from '@/lib/vehicleTypes';

interface VehicleTypeSelectorProps {
  form: UseFormReturn<QuoteFormValues>;
}

const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="vehicleType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-dk-navy font-semibold">
            TYPE DE VÉHICULE <span className="text-red-500">*</span>
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-[#EEF1FF]">
                <SelectValue placeholder="Choix du véhicule" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
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

export default VehicleTypeSelector;
