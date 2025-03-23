
import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { QuoteFormValues } from './quoteFormSchema';
import MapSection from '../pickup-form/MapSection';

interface AddressFormProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  onPrevious: () => void;
}

const AddressForm = ({ form, onNext, onPrevious }: AddressFormProps) => {
  const handleAddressSelect = (address: string) => {
    form.setValue('pickupAddress', address);
  };

  const handleNext = () => {
    const addressData = {
      pickupAddress: form.getValues('pickupAddress'),
      deliveryAddress: form.getValues('deliveryAddress'),
    };
    
    const isValid = !form.formState.errors.pickupAddress && 
                   !form.formState.errors.deliveryAddress;
                   
    if (isValid) {
      onNext(addressData);
    } else {
      form.trigger(['pickupAddress', 'deliveryAddress']);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dk-navy mb-4">Adresses de prise en charge et de livraison</h2>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="pickupAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                ADRESSE DE PRISE EN CHARGE <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adresse complète de prise en charge" 
                  className="bg-[#EEF1FF] min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-[300px] rounded-lg overflow-hidden mb-6">
          <MapSection onAddressSelect={handleAddressSelect} />
        </div>

        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dk-navy font-semibold">
                ADRESSE DE LIVRAISON <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adresse complète de livraison" 
                  className="bg-[#EEF1FF] min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
          className="bg-white"
        >
          RETOUR
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

export default AddressForm;
