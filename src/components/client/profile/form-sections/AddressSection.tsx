
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { ProfileFormData } from "../types";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";

interface AddressSectionProps {
  control: Control<ProfileFormData>;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
}

const AddressSection = ({ control, isEditing, onToggleEdit, onSave }: AddressSectionProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Adresse de facturation</h3>
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
        name="billing_address_street"
        render={({ field }) => (
          <FormItem>
            <Label>Rue et numéro</Label>
            <FormControl>
              <Input {...field} placeholder="123 rue de Paris" disabled={!isEditing} />
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
                <Input {...field} placeholder="75001" maxLength={5} disabled={!isEditing} />
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
                <Input {...field} placeholder="Paris" disabled={!isEditing} />
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
              <Input {...field} placeholder="France" disabled={!isEditing} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddressSection;
