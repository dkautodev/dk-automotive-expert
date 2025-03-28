
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { ProfileData } from "../types";
import { ProfileFormSchemaType } from "../schemas/profileFormSchema";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";

interface BusinessSectionProps {
  control: Control<ProfileFormSchemaType>;
  profile: ProfileData | null;
  onLockField: (field: 'siret' | 'vat_number', value: string) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
}

const BusinessSection = ({ 
  control, 
  profile, 
  onLockField,
  isEditing,
  onToggleEdit,
  onSave
}: BusinessSectionProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Informations fiscales</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onToggleEdit}>
              <X className="h-4 w-4 mr-1" /> Annuler
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-1" /> Enregistrer
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={onToggleEdit}>
            <Pencil className="h-4 w-4 mr-1" /> Modifier
          </Button>
        )}
      </div>
      
      <FormField
        control={control}
        name="siret"
        render={({ field }) => (
          <FormItem>
            <Label>Numéro SIRET</Label>
            <FormControl>
              <Input
                {...field}
                disabled={profile?.siret_locked || !isEditing}
                placeholder="14 chiffres"
                maxLength={14}
                onBlur={() => {
                  if (field.value && !profile?.siret_locked && isEditing) {
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
                disabled={profile?.vat_number_locked || !isEditing}
                placeholder="FR12345678912"
                onBlur={() => {
                  if (field.value && !profile?.vat_number_locked && isEditing) {
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
