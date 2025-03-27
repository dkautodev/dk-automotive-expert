
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, ProfileFormData } from "../types";
import { toast } from "sonner";

export const useProfileUpdate = (userId: string | undefined, profile: ProfileData | null, setProfile: (profile: ProfileData | null) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data: ProfileFormData) => {
    if (!userId) return;
    
    try {
      setIsSubmitting(true);
      
      // Mapping from form fields to database columns
      const updateData: Record<string, any> = {
        phone: data.phone,
        billing_address: data.billing_address
      };

      if (!profile?.siret_locked) {
        updateData.siret_number = data.siret;
      }
      if (!profile?.vat_number_locked) {
        updateData.vat_number = data.vat_number;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local profile
      if (profile) {
        setProfile({
          ...profile,
          phone: data.phone,
          billing_address: data.billing_address,
          siret: !profile.siret_locked ? data.siret : profile.siret,
          vat_number: !profile.vat_number_locked ? data.vat_number : profile.vat_number
        });
      }
      
      toast.success("Vos informations ont été mises à jour avec succès.");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting };
};
