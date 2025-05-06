
import { useState } from "react";
import { toast } from "sonner";
import { mockProfileService } from "@/services/profile/mockProfileService";

export const usePasswordChange = (userEmail: string | undefined) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!userEmail) {
      toast.error("Vous devez être connecté pour changer votre mot de passe");
      return false;
    }

    try {
      setIsChangingPassword(true);
      
      const success = await mockProfileService.changePassword(userEmail, currentPassword, newPassword);
      
      if (success) {
        toast.success("Mot de passe mis à jour avec succès");
      }
      
      return success;
    } catch (error: any) {
      console.error("Error changing password:", error.message);
      
      toast.error("Une erreur est survenue lors du changement de mot de passe");
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return { changePassword, isChangingPassword };
};
