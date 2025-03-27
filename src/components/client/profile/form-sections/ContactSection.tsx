
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { ProfileFormData } from "../types";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";

interface ContactSectionProps {
  control: Control<ProfileFormData>;
  emailDisabled?: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
}

const ContactSection = ({ 
  control, 
  emailDisabled = false, 
  isEditing, 
  onToggleEdit, 
  onSave 
}: ContactSectionProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Informations de contact</h3>
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
        name="email"
        render={({ field }) => (
          <FormItem>
            <Label>Email</Label>
            <FormControl>
              <Input {...field} type="email" disabled={emailDisabled || !isEditing} />
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
              <Input 
                {...field} 
                type="tel" 
                disabled={!isEditing}
                value={field.value || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactSection;
