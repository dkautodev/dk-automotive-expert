
import { FC, RefObject } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { assignRefs } from './assignRefs';

interface DeliveryAddressFieldProps {
  form: any;
  deliveryAuto: { error: string | null };
  deliveryInputRef: RefObject<HTMLInputElement>;
}

export const DeliveryAddressField: FC<DeliveryAddressFieldProps> = ({ form, deliveryAuto, deliveryInputRef }) => (
  <FormField
    control={form.control}
    name="delivery_address"
    render={({ field }: any) => (
      <FormItem>
        <FormLabel className="text-dk-navy font-semibold">ADRESSE DE LIVRAISON *</FormLabel>
        <FormControl>
          <div className="relative">
            <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder={deliveryAuto.error ? "Petit problème... Une erreur s'est produite" : "Saisissez l'adresse complète"}
              className={`pl-8 bg-[#EEF1FF] ${deliveryAuto.error ? 'opacity-60 cursor-not-allowed' : ''}`}
              {...field}
              ref={assignRefs(deliveryInputRef, field.ref)}
              disabled={!!deliveryAuto.error}
              onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
              autoComplete="off"
            />
            {deliveryAuto.error && (
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-destructive">
                {deliveryAuto.error}
              </span>
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
