
import { ProfileData } from "../types";
import { toast } from "sonner";
import { extendedSupabase } from "@/integrations/supabase/extended-client";

export const useLogoUpdate = (userId: string | undefined, profile: ProfileData | null, setProfile: (profile: ProfileData | null) => void) => {
  const handleLogoUpdate = async (logoUrl: string) => {
    if (!userId) return;
    
    try {
      // Use the extendedSupabase client which mocks database operations
      const { error } = await extendedSupabase
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
