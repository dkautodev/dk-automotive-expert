
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { UseFormReturn } from 'react-hook-form';
import { PickupFormValues } from './pickupFormSchema';
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

interface PickupDetailsSectionProps {
  form: UseFormReturn<PickupFormValues>;
  addressInputRef: React.RefObject<HTMLInputElement>;
}

const PickupDetailsSection = ({ form, addressInputRef }: PickupDetailsSectionProps) => {
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
                ref={(e) => {
                  addressInputRef.current = e;
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pickupDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              DATE D'ENLÈVEMENT <span className="text-blue-500">*</span>
            </FormLabel>
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
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pickupTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold">
              HEURE D'ENLÈVEMENT <span className="text-blue-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type="time"
                  placeholder="Choisir une heure" 
                  {...field} 
                  className="bg-[#EEF1FF] pl-10" 
                />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalMessage"
        render={({ field }) => (
          <FormItem>
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

export default PickupDetailsSection;

