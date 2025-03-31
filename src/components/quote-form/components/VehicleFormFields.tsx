
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuoteFormValues } from '../quoteFormSchema';
import { carBrands, getModelsByBrand } from '../vehicleData';
import VehicleTypeSelector from '../VehicleTypeSelector';

interface VehicleFormFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

const VehicleFormFields: React.FC<VehicleFormFieldsProps> = ({ form }) => {
  const selectedBrand = form.watch('brand');
  const models = selectedBrand ? getModelsByBrand(selectedBrand) : [];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <VehicleTypeSelector form={form} />

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
    </div>
  );
};

export default VehicleFormFields;
