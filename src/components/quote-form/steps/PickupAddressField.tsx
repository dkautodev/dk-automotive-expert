
import { FC, RefObject } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { assignRefs } from './assignRefs';

interface PickupAddressFieldProps {
  form: any;
  pickupAuto: { error: string | null };
  pickupInputRef: RefObject<HTMLInputElement>;
}

export const PickupAddressField: FC<PickupAddressFieldProps> = ({ form, pickupAuto, pickupInputRef }) => (
  <FormField
    control={form.control}
    name="pickup_address"
    render={({ field }: any) => (
      <FormItem>
        <FormLabel className="text-dk-navy font-semibold">ADRESSE DE PRISE EN CHARGE *</FormLabel>
        <FormControl>
          <div className="relative">
            <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder={pickupAuto.error ? "Petit problème... Une erreur s'est produite" : "Saisissez l'adresse complète"}
              className={`pl-8 bg-[#EEF1FF] ${pickupAuto.error ? 'opacity-60 cursor-not-allowed' : ''}`}
              {...field}
              ref={assignRefs(pickupInputRef, field.ref)}
              disabled={!!pickupAuto.error}
              onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
              autoComplete="off"
            />
            {pickupAuto.error && (
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-destructive">
                {pickupAuto.error}
              </span>
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
