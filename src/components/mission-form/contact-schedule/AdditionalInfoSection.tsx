
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "../missionFormSchema";
import AttachmentsField from "../AttachmentsField";

interface AdditionalInfoSectionProps {
  form: UseFormReturn<MissionFormValues>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">
        Informations supplémentaires
      </h3>
      <FormField
        control={form.control}
        name="additional_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Précisions ou instructions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Informations supplémentaires..."
                rows={4}
                className="resize-none"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Champ pour ajouter des pièces jointes */}
      <AttachmentsField
        form={form}
        name="attachments"
        label="Pièces jointes"
      />
    </div>
  );
};

export default AdditionalInfoSection;
