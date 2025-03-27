
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { ProfileData, ProfileFormData } from "../types";

interface BusinessSectionProps {
  control: Control<ProfileFormData>;
  profile: ProfileData | null;
  onLockField: (field: 'siret' | 'vat_number', value: string) => void;
}

const BusinessSection = ({ control, profile, onLockField }: BusinessSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations fiscales</h3>
      
      <FormField
        control={control}
        name="siret"
        render={({ field }) => (
          <FormItem>
            <Label>Numéro SIRET</Label>
            <FormControl>
              <Input
                {...field}
                disabled={profile?.siret_locked}
                placeholder="14 chiffres"
                maxLength={14}
                onBlur={() => {
                  if (field.value && !profile?.siret_locked) {
                    onLockField('siret', field.value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="vat_number"
        render={({ field }) => (
          <FormItem>
            <Label>Numéro de TVA intracommunautaire</Label>
            <FormControl>
              <Input
                {...field}
                disabled={profile?.vat_number_locked}
                placeholder="FR12345678912"
                onBlur={() => {
                  if (field.value && !profile?.vat_number_locked) {
                    onLockField('vat_number', field.value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BusinessSection;
