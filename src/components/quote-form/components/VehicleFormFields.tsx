
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import VehicleTypeSelector from '../VehicleTypeSelector';
import BrandField from './fields/BrandField';
import ModelField from './fields/ModelField';
import YearField from './fields/YearField';
import LicensePlateField from './fields/LicensePlateField';
import FuelTypeField from './fields/FuelTypeField';

interface VehicleFormFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

const VehicleFormFields: React.FC<VehicleFormFieldsProps> = ({ form }) => {
  const selectedBrand = form.watch('brand');

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <VehicleTypeSelector form={form} />
      <BrandField form={form} />
      <ModelField form={form} selectedBrand={selectedBrand} />
      <YearField form={form} />
      <LicensePlateField form={form} />
      <FuelTypeField form={form} />
    </div>
  );
};

export default VehicleFormFields;
