
import { useState } from "react";
import { toast } from "sonner";
import { extendedSupabase } from "@/integrations/supabase/extended-client";

export const usePasswordChange = (userEmail: string | undefined) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!userEmail) {
      toast.error("Vous devez être connecté pour changer votre mot de passe");
      return false;
    }

    try {
      setIsChangingPassword(true);

      // Verify the current password by trying to sign in
      const { error: signInError } = await extendedSupabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Le mot de passe actuel est incorrect");
        return false;
      }

      // Update the password
      const { error: updateError } = await extendedSupabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Mot de passe mis à jour avec succès");
      return true;
    } catch (error: any) {
      console.error("Error changing password:", error.message);
      
      let errorMessage = "Une erreur est survenue lors du changement de mot de passe";
      if (error.message.includes("Password should be")) {
        errorMessage = "Le nouveau mot de passe doit contenir au moins 6 caractères";
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return { changePassword, isChangingPassword };
};
