
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { ProfileFormData } from "../types";

interface ContactSectionProps {
  control: Control<ProfileFormData>;
  emailDisabled?: boolean;
}

const ContactSection = ({ control, emailDisabled = false }: ContactSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations de contact</h3>
      
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <Label>Email</Label>
            <FormControl>
              <Input {...field} type="email" disabled={emailDisabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <Label>Numéro de téléphone</Label>
            <FormControl>
              <Input {...field} type="tel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactSection;
