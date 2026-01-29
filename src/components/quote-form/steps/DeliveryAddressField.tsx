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
        <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          ADRESSE DE LIVRAISON <span className="text-destructive">*</span>
        </FormLabel>
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
            {deliveryAuto.error && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-destructive">
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
