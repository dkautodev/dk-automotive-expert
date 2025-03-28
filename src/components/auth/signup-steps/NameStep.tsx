
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { NameStepType } from "../schemas/signUpStepSchema";

interface NameStepProps {
  control: Control<NameStepType>;
}

const NameStep = ({ control }: NameStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Identité</h2>
      
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom*</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="NOM" 
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
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prénom*</FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Prénom" 
                  className="pl-10" 
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                      field.onChange(formattedValue);
                    } else {
                      field.onChange(value);
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NameStep;
