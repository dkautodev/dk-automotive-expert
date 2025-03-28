
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin } from "lucide-react";
import { BillingStepType } from "../schemas/signUpStepSchema";

interface BillingStepProps {
  control: Control<BillingStepType>;
}

const BillingStep = ({ control }: BillingStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Informations de facturation</h2>
      
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Société*</FormLabel>
            <FormControl>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="NOM DE LA SOCIÉTÉ" 
                  className="pl-10" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse*</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input placeholder="123 rue du Commerce" className="pl-10" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal*</FormLabel>
              <FormControl>
                <Input placeholder="75001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville*</FormLabel>
              <FormControl>
                <Input placeholder="Paris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pays*</FormLabel>
            <FormControl>
              <Input value="France" disabled {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BillingStep;
