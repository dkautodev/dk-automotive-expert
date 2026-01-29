import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Info } from 'lucide-react';

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
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-dk-navy/10 rounded-lg flex items-center justify-center">
          <Car className="w-5 h-5 text-dk-navy" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-dk-navy">Détails du véhicule</h2>
          <p className="text-sm text-muted-foreground">Informations facultatives pour un devis plus précis</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-dk-navy flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Cette étape est <span className="font-medium text-foreground">facultative</span> mais permet d'obtenir un devis plus précis et de préparer votre mission de convoyage.
        </p>
      </div>
      
      {/* Form Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">MARQUE</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Renault, Peugeot, BMW..."
                  className="bg-muted/50 border-border focus-visible:ring-dk-navy"
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
                  className="bg-muted/50 border-border focus-visible:ring-dk-navy"
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
                  className="bg-muted/50 border-border focus-visible:ring-dk-navy"
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
                  <SelectTrigger className="bg-muted/50 border-border focus:ring-dk-navy">
                    <SelectValue placeholder="Sélectionner le carburant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover border-border">
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
                  className="bg-muted/50 border-border focus-visible:ring-dk-navy uppercase"
                  {...field}
                  onChange={e => field.onChange(e.target.value.toUpperCase())}
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
                  className="bg-muted/50 border-border focus-visible:ring-dk-navy"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="border-border hover:bg-muted"
        >
          PRÉCÉDENT
        </Button>
        <Button 
          type="button" 
          onClick={handleNext}
          className="bg-dk-navy hover:bg-dk-blue text-white px-8"
        >
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default NewVehicleDetailsStep;
