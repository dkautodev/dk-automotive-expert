
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewVehicleDetailsStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
}

const fuelTypes = [
  { id: "essence", name: "Essence" },
  { id: "diesel", name: "Diesel" },
  { id: "hybride", name: "Hybride" },
  { id: "electrique", name: "Électrique" },
  { id: "gpl", name: "GPL" },
  { id: "autre", name: "Autre" }
];

const NewVehicleDetailsStep = ({ form, onNext, onPrevious }: NewVehicleDetailsStepProps) => {
  const handleNext = () => {
    const data = {
      brand: form.getValues('brand'),
      model: form.getValues('model'),
      year: form.getValues('year'),
      fuel: form.getValues('fuel'),
      licensePlate: form.getValues('licensePlate'),
      vin: form.getValues('vin')
    };
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dk-navy">Étape 2: Détails du véhicule</h2>
        <p className="text-gray-600 mt-2">Cette étape est facultative mais permet un devis plus précis</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">MARQUE</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Renault, Peugeot, BMW..."
                  className="bg-[#EEF1FF]"
                  {...field}
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
              <FormLabel className="text-dk-navy font-semibold">MODÈLE</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Clio, 208, Série 3..."
                  className="bg-[#EEF1FF]"
                  {...field}
                />
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
              <FormLabel className="text-dk-navy font-semibold">ANNÉE</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: 2020"
                  className="bg-[#EEF1FF]"
                  {...field}
                />
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
              <FormLabel className="text-dk-navy font-semibold">CARBURANT</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[#EEF1FF]">
                    <SelectValue placeholder="Sélectionner le carburant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel.id} value={fuel.id}>
                      {fuel.name}
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
              <FormLabel className="text-dk-navy font-semibold">IMMATRICULATION</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: AB-123-CD"
                  className="bg-[#EEF1FF]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">NUMÉRO VIN</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Numéro d'identification du véhicule"
                  className="bg-[#EEF1FF]"
                  {...field}
                />
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
        <Button 
          type="button" 
          onClick={handleNext}
          className="bg-[#1a237e] hover:bg-[#3f51b5]"
        >
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default NewVehicleDetailsStep;
