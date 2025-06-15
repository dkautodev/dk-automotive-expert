
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleDetailsStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
}

const fuelTypes = [{
  id: "essence",
  label: "Essence"
}, {
  id: "diesel",
  label: "Diesel"
}, {
  id: "hybride",
  label: "Hybride"
}, {
  id: "electrique",
  label: "Électrique"
}, {
  id: "gpl",
  label: "GPL"
}, {
  id: "gnv",
  label: "GNV"
}];

const VehicleDetailsStep = ({
  form,
  onNext,
  onPrevious
}: VehicleDetailsStepProps) => {
  const handleNext = () => {
    const data = {
      brand: form.getValues('brand'),
      model: form.getValues('model'),
      year: form.getValues('year'),
      fuel: form.getValues('fuel'),
      licensePlate: form.getValues('licensePlate')
    };
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Détails du véhicule</h2>
      <p className="text-gray-500 mb-4">Cette étape est facultative mais nous aidera à mieux connaître vos besoins.</p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                MARQUE
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Renault" className="bg-[#EEF1FF]" {...field} />
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
                MODÈLE
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Clio" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
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
                ANNÉE
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: 2023" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fuel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                CARBURANT
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[#EEF1FF]">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fuelTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
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
            <FormItem className="md:col-span-2">
              <FormLabel className="text-dk-navy font-semibold">
                IMMATRICULATION
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: AB-123-CD" className="bg-[#EEF1FF]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          PRÉCÉDENT
        </Button>
        <Button type="button" onClick={handleNext} className="bg-[#1a237e] hover:bg-[#3f51b5]">
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default VehicleDetailsStep;
