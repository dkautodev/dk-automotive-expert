
import { useState } from "react";
import { ProfileData } from "../types";
import { ProfileFormSchemaType } from "../schemas/profileFormSchema";
import { toast } from "sonner";
import { mockProfileService } from "@/services/profile/mockProfileService";

export const useProfileUpdate = (userId: string | undefined, profile: ProfileData | null, setProfile: (profile: ProfileData | null) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (data: ProfileFormSchemaType) => {
    if (!userId) return;
    
    try {
      setIsSubmitting(true);
      console.log("Updating profile with data:", data);
      
      // Format the billing address for the database
      const formattedBillingAddress = `${data.billing_address_street}, ${data.billing_address_postal_code} ${data.billing_address_city}, ${data.billing_address_country}`;
      
      // Mapping from form fields to database columns
      const updateData: Record<string, any> = {
        phone: data.phone,
        billing_address_street: data.billing_address_street,
        billing_address_city: data.billing_address_city,
        billing_address_postal_code: data.billing_address_postal_code,
        billing_address_country: data.billing_address_country
      };

      // Handle locked fields
      if (!profile?.siret_locked) {
        updateData.siret = data.siret;
      }
      if (!profile?.vat_number_locked) {
        updateData.vat_number = data.vat_number;
      }

      console.log("Sending to database:", updateData);
      
      const updatedProfile = await mockProfileService.updateProfile(userId, updateData);
      
      // Update local profile
      setProfile(updatedProfile);
      
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
