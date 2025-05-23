
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { UseFormReturn } from 'react-hook-form';
import { DeliveryFormValues } from './deliveryFormSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface DeliveryDetailsSectionProps {
  form: UseFormReturn<DeliveryFormValues>;
  addressInputRef: React.RefObject<HTMLInputElement>;
}

const DeliveryDetailsSection = ({ form, addressInputRef }: DeliveryDetailsSectionProps) => {
  // Empêcher la soumission du formulaire lors de l'appui sur Entrée
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              ADRESSE <span className="text-blue-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Commencez à taper une adresse..."
                {...field}
                className="bg-[#EEF1FF]"
                onKeyDown={handleKeyDown}
                ref={(e) => {
                  // Handle the field's ref if it exists
                  if (field.ref && typeof field.ref === 'function') {
                    field.ref(e);
                  }
                  
                  // Instead of directly assigning to current (which is read-only),
                  // we use the existing ref's value which React handles internally
                  if (e && addressInputRef) {
                    // Here we let React handle setting the current property properly
                    Object.defineProperty(addressInputRef, 'current', {
                      value: e,
                      writable: true
                    });
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <h3 className="text-dk-navy font-semibold">DATE DE LIVRAISON <span className="text-blue-500">*</span></h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-[#EEF1FF]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="time"
                      placeholder="Choisir une heure" 
                      {...field} 
                      className="bg-[#EEF1FF] pl-10 w-full" 
                    />
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="additionalMessage"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel className="text-dk-navy font-semibold">
              MESSAGE COMPLÉMENTAIRE
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Ajoutez des informations complémentaires à votre demande..."
                className="bg-[#EEF1FF] min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DeliveryDetailsSection;
