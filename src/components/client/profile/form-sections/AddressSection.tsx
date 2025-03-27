
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { ProfileFormData } from "../types";

interface AddressSectionProps {
  control: Control<ProfileFormData>;
}

const AddressSection = ({ control }: AddressSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Adresse de facturation</h3>
      
      <FormField
        control={control}
        name="billing_address_street"
        render={({ field }) => (
          <FormItem>
            <Label>Rue et numéro</Label>
            <FormControl>
              <Input {...field} placeholder="123 rue de Paris" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="billing_address_postal_code"
          render={({ field }) => (
            <FormItem>
              <Label>Code postal</Label>
              <FormControl>
                <Input {...field} placeholder="75001" maxLength={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="billing_address_city"
          render={({ field }) => (
            <FormItem>
              <Label>Ville</Label>
              <FormControl>
                <Input {...field} placeholder="Paris" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="billing_address_country"
        render={({ field }) => (
          <FormItem>
            <Label>Pays</Label>
            <FormControl>
              <Input {...field} placeholder="France" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddressSection;
