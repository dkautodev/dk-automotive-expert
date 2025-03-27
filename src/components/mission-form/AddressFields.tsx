
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { MissionFormValues } from "./missionFormSchema";

interface AddressFieldsProps {
  form: UseFormReturn<MissionFormValues>;
}

const AddressFields = ({ form }: AddressFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="pickup_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse de prise en charge</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="123 rue de Paris, 75001 Paris" 
                  {...field} 
                  className="pl-8"
                />
              </div>
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
            <FormLabel>Adresse de livraison</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="456 avenue des Champs-Élysées, 75008 Paris" 
                  {...field} 
                  className="pl-8"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddressFields;
