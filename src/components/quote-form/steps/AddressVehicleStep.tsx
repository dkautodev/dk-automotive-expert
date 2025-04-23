
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import VehicleTypeSelector from '../VehicleTypeSelector';
import { Loader } from '@/components/ui/loader';

interface PriceInfo {
  distance: string | null;
  priceHT: string | null;
  priceTTC: string | null;
}

interface AddressVehicleStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
  priceInfo?: PriceInfo;
}

const AddressVehicleStep = ({ form, onNext, onPrevious, priceInfo }: AddressVehicleStepProps) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleNext = () => {
    const data = {
      pickup_address: form.getValues('pickup_address'),
      delivery_address: form.getValues('delivery_address'),
      vehicle_type: form.getValues('vehicle_type')
    };

    if (form.formState.errors.pickup_address || form.formState.errors.delivery_address || form.formState.errors.vehicle_type) {
      form.trigger(['pickup_address', 'delivery_address', 'vehicle_type']);
      return;
    }

    onNext(data);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Trigger validation of required fields
      const isValid = await form.trigger(['pickup_address', 'delivery_address', 'vehicle_type']);
      
      if (!isValid) {
        return;
      }
      
      // Form is valid, calculation will be handled in useQuoteForm hook
      // This is just to indicate the calculation is being performed
      setTimeout(() => {
        setIsCalculating(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error during calculation:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy">Adresse et véhicule</h2>
      
      <div className="space-y-4">
        <VehicleTypeSelector form={form} />
        
        <FormField
          control={form.control}
          name="pickup_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                ADRESSE DE DÉPART <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: 123 Rue de Paris, 75001 Paris"
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
          name="delivery_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                ADRESSE DE DESTINATION <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: 456 Avenue des Champs-Élysées, 75008 Paris"
                  className="bg-[#EEF1FF]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-center mt-4">
          <Button 
            type="button" 
            onClick={handleCalculate}
            disabled={isCalculating}
            variant="outline"
            className="w-full md:w-auto"
          >
            {isCalculating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                CALCUL EN COURS...
              </>
            ) : (
              'CALCULER LA DISTANCE ET LE PRIX'
            )}
          </Button>
        </div>
        
        {priceInfo?.distance && (
          <div className="bg-gray-100 p-4 rounded-md mt-6">
            <h3 className="text-lg font-semibold mb-2">Résultat du calcul</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Distance:</p>
                <p className="text-lg">{priceInfo.distance}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prix HT:</p>
                <p className="text-lg">{priceInfo.priceHT} €</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prix TTC:</p>
                <p className="text-lg">{priceInfo.priceTTC} €</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Ces tarifs sont donnés à titre indicatif et seront confirmés par notre équipe.
            </p>
          </div>
        )}
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

export default AddressVehicleStep;
