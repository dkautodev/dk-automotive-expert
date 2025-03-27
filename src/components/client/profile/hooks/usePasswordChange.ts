
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordChange = (userEmail: string | undefined) => {
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!userEmail) return false;
    
    try {
      // D'abord vérifier que le mot de passe actuel est correct en tentant de se connecter
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });
      
      if (signInError) {
        toast.error("Le mot de passe actuel est incorrect.");
        return false;
      }
      
      // Changer le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast.error(error.message || "Erreur lors du changement de mot de passe.");
        return false;
      }
      
      toast.success("Votre mot de passe a été mis à jour avec succès.");
      return true;
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error("Une erreur est survenue lors du changement de mot de passe.");
      return false;
    }
  };

  return { changePassword };
};
