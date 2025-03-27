
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "../types";
import { toast } from "sonner";

export const useLogoUpdate = (userId: string | undefined, profile: ProfileData | null, setProfile: (profile: ProfileData | null) => void) => {
  const handleLogoUpdate = async (logoUrl: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          profile_picture: logoUrl
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local profile with new logo
      if (profile) {
        setProfile({
          ...profile,
          profile_picture: logoUrl
        });
      }
      
      toast.success("Logo mis à jour avec succès");
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du logo.");
    }
  };

  return { handleLogoUpdate };
};
