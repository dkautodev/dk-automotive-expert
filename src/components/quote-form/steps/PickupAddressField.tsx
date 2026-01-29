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
        <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          ADRESSE DE PRISE EN CHARGE <span className="text-destructive">*</span>
        </FormLabel>
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
            {pickupAuto.error && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-destructive">
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
