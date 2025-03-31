
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import VehicleTypeSelector from '../VehicleTypeSelector';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getVehiclesByCategory } from '@/lib/vehicleTypes';
import FuelTypeField from './fields/FuelTypeField';
import YearField from './fields/YearField';
import LicensePlateField from './fields/LicensePlateField';

interface VehicleFormFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

const VehicleFormFields: React.FC<VehicleFormFieldsProps> = ({ form }) => {
  const selectedVehicleType = form.watch('vehicleType');
  const [suggestedVehicles, setSuggestedVehicles] = useState<string[]>([]);
  
  useEffect(() => {
    if (selectedVehicleType) {
      const vehicles = getVehiclesByCategory(selectedVehicleType);
      setSuggestedVehicles(vehicles);
      
      // Reset brand and model when changing vehicle type
      form.setValue("brand", "");
      form.setValue("model", "");
    }
  }, [selectedVehicleType, form]);
  
  const handleVehicleSelection = (value: string) => {
    if (value) {
      const [brand, ...modelParts] = value.split(" ");
      const model = modelParts.join(" ");
      
      form.setValue("brand", brand);
      form.setValue("model", model);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <VehicleTypeSelector form={form} />
      
      {selectedVehicleType && suggestedVehicles.length > 0 && (
        <FormField
          control={form.control}
          name="suggested_vehicle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                VÉHICULE SUGGÉRÉ <span className="text-red-500">*</span>
              </FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleVehicleSelection(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-[#EEF1FF]">
                    <SelectValue placeholder="Sélectionner un véhicule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suggestedVehicles.map((vehicle) => (
                    <SelectItem key={vehicle} value={vehicle}>
                      {vehicle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              MARQUE DU VÉHICULE <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <input 
                {...field}
                className="w-full p-2 rounded-md border border-gray-300 bg-[#EEF1FF]"
                placeholder="Ex: Peugeot"
              />
            </FormControl>
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
            <FormControl>
              <input 
                {...field}
                className="w-full p-2 rounded-md border border-gray-300 bg-[#EEF1FF]"
                placeholder="Ex: 3008"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <YearField form={form} />
      <LicensePlateField form={form} />
      <FuelTypeField form={form} />
    </div>
  );
};

export default VehicleFormFields;
