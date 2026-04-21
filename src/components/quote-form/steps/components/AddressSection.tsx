import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin, RefreshCcw } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../../quoteFormSchema';
import { assignRefs } from '../assignRefs';

interface AddressSectionProps {
  form: UseFormReturn<QuoteFormValues>;
  pickupInputRef: React.RefObject<HTMLInputElement>;
  deliveryInputRef: React.RefObject<HTMLInputElement>;
  pickupAuto: { error?: any };
  deliveryAuto: { error?: any };
  onSwitch: () => void;
}

const AddressSection = ({
  form,
  pickupInputRef,
  deliveryInputRef,
  pickupAuto,
  deliveryAuto,
  onSwitch
}: AddressSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Desktop Labels Row */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12">
        <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          ADRESSE DE PRISE EN CHARGE <span className="text-destructive">*</span>
        </FormLabel>
        <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          ADRESSE DE LIVRAISON <span className="text-destructive">*</span>
        </FormLabel>
      </div>
      
      {/* Mobile: Pickup Label */}
      <FormLabel className="lg:hidden text-dk-navy font-semibold flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        ADRESSE DE PRISE EN CHARGE <span className="text-destructive">*</span>
      </FormLabel>
      
      {/* Inputs and Swap Button */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr,auto,1fr] gap-3 lg:gap-2 lg:items-center">
        {/* Pickup Address Input */}
        <FormField
          control={form.control}
          name="pickup_address"
          render={({ field }: any) => (
            <FormItem className="space-y-0">
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={pickupAuto.error ? "Une erreur s'est produite" : "Saisissez l'adresse complète"}
                    className={`pl-10 bg-muted/50 border-border focus-visible:ring-dk-navy ${pickupAuto.error ? 'opacity-60 cursor-not-allowed border-destructive' : ''}`}
                    {...field}
                    ref={assignRefs(pickupInputRef, field.ref)}
                    disabled={!!pickupAuto.error}
                    onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                    autoComplete="off"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            aria-label="Échanger les adresses"
            onClick={onSwitch}
            className="bg-card border border-border rounded-full shadow-sm p-2 lg:p-2.5 flex items-center justify-center hover:bg-muted active:scale-95 transition-all"
          >
            <RefreshCcw className="w-4 h-4 text-dk-navy" />
          </button>
        </div>
        
        {/* Mobile: Delivery Label */}
        <FormLabel className="lg:hidden text-dk-navy font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          ADRESSE DE LIVRAISON <span className="text-destructive">*</span>
        </FormLabel>
        
        {/* Delivery Address Input */}
        <FormField
          control={form.control}
          name="delivery_address"
          render={({ field }: any) => (
            <FormItem className="space-y-0">
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={deliveryAuto.error ? "Une erreur s'est produite" : "Saisissez l'adresse complète"}
                    className={`pl-10 bg-muted/50 border-border focus-visible:ring-dk-navy ${deliveryAuto.error ? 'opacity-60 cursor-not-allowed border-destructive' : ''}`}
                    {...field}
                    ref={assignRefs(deliveryInputRef, field.ref)}
                    disabled={!!deliveryAuto.error}
                    onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                    autoComplete="off"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressSection;
