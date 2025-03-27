
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
      console.log("Updating profile with data:", data);
      
      // Construire l'adresse de facturation complète au format attendu par la base de données
      const formattedBillingAddress = `${data.billing_address_street}, ${data.billing_address_postal_code} ${data.billing_address_city}, ${data.billing_address_country}`;
      
      // Mapping from form fields to database columns
      const updateData: Record<string, any> = {
        phone: data.phone,
        billing_address: formattedBillingAddress
      };

      if (!profile?.siret_locked) {
        updateData.siret_number = data.siret;
      }
      if (!profile?.vat_number_locked) {
        updateData.vat_number = data.vat_number;
      }

      console.log("Sending to database:", updateData);
      console.log("User ID:", userId);

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) {
        console.error("Database update error:", error);
        throw error;
      }
      
      console.log("Database update successful");
      
      // Update local profile
      if (profile) {
        setProfile({
          ...profile,
          phone: data.phone,
          billing_address_street: data.billing_address_street,
          billing_address_city: data.billing_address_city,
          billing_address_postal_code: data.billing_address_postal_code,
          billing_address_country: data.billing_address_country,
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
