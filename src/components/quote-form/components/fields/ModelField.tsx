
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
import { getModelsByBrand } from '../../vehicleData';

interface ModelFieldProps {
  form: UseFormReturn<QuoteFormValues>;
  selectedBrand: string;
}

const ModelField: React.FC<ModelFieldProps> = ({ form, selectedBrand }) => {
  const models = selectedBrand ? getModelsByBrand(selectedBrand) : [];

  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-dk-navy font-semibold">
            MODÈLE DU VÉHICULE <span className="text-red-500">*</span>
          </FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={!selectedBrand}
          >
            <FormControl>
              <SelectTrigger className="bg-[#EEF1FF]">
                <SelectValue placeholder={selectedBrand ? "Choisir un modèle" : "Choisir une marque d'abord"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
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

export default ModelField;
