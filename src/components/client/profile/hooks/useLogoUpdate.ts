
import { ProfileData } from "../types";
import { toast } from "sonner";
import { mockProfileService } from "@/services/profile/mockProfileService";

export const useLogoUpdate = (userId: string | undefined, profile: ProfileData | null, setProfile: (profile: ProfileData | null) => void) => {
  const handleLogoUpdate = async (logoUrl: string) => {
    if (!userId) return;
    
    try {
      const updatedProfile = await mockProfileService.updateLogo(userId, logoUrl);
      
      // Update local profile
      setProfile(updatedProfile);
      
      toast.success("Logo mis à jour avec succès");
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du logo.");
    }
  };

  return { handleLogoUpdate };
};
