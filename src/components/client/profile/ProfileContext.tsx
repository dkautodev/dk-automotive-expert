
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileData, ProfileFormData } from "./types";

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  submitForm: (data: ProfileFormData) => Promise<void>;
  handleLogoUpdate: (logoUrl: string) => Promise<void>;
  confirmLockField: (field: 'siret' | 'vat_number', value: string) => void;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  handleConfirmLock: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { profile: authProfile, user } = useAuthContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldToLock, setFieldToLock] = useState<'siret' | 'vat_number' | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localProfile, setLocalProfile] = useState<ProfileData | null>(null);
  
  // Récupérer le profil directement depuis Supabase au chargement
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*, users(email)')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          setError("Impossible de charger les données du profil. Veuillez réessayer plus tard.");
          return;
        }
        
        if (!data) {
          setError("Profil non trouvé.");
          return;
        }
        
        // Extraire l'email de la relation users
        const userEmail = data.users ? (data.users as any).email : '';
        
        // Créer un objet de profil formaté
        const formattedProfile: ProfileData = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: userEmail,
          phone: data.phone || '',
          company: data.company_name || '',
          profile_picture: data.profile_picture || '',
          siret: data.siret_number || '',
          vat_number: data.vat_number || '',
          siret_locked: !!data.siret_number_locked,
          vat_number_locked: !!data.vat_number_locked,
          billing_address: data.billing_address || ''
        };
        
        setLocalProfile(formattedProfile);
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setError("Une erreur est survenue lors du chargement du profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Utiliser aussi les données du contexte d'authentification comme fallback
  useEffect(() => {
    if (!localProfile && authProfile) {
      setLocalProfile(authProfile);
    }
  }, [authProfile, localProfile]);

  const handleLogoUpdate = async (logoUrl: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          profile_picture: logoUrl
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local profile with new logo
      if (localProfile) {
        setLocalProfile({
          ...localProfile,
          profile_picture: logoUrl
        });
      }
      
      toast.success("Logo mis à jour avec succès");
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du logo.");
    }
  };

  const confirmLockField = (field: 'siret' | 'vat_number', value: string) => {
    setFieldToLock(field);
    setTempValue(value);
    setShowConfirmDialog(true);
  };

  const handleConfirmLock = async () => {
    if (!fieldToLock || !user?.id) return;
    
    try {
      // Mapping between form fields and database columns
      const fieldMapping: Record<string, string> = {
        siret: 'siret_number',
        vat_number: 'vat_number'
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          [fieldMapping[fieldToLock]]: tempValue,
          [`${fieldMapping[fieldToLock]}_locked`]: true
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local profile
      if (localProfile) {
        setLocalProfile({
          ...localProfile,
          [fieldToLock]: tempValue,
          [`${fieldToLock}_locked`]: true
        });
      }
      
      toast.success("Le champ a été mis à jour et verrouillé.");
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error locking field:', error);
      toast.error("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const submitForm = async (data: ProfileFormData) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Mapping from form fields to database columns
      const updateData: Record<string, any> = {
        phone: data.phone,
        billing_address: data.billing_address
      };

      if (!localProfile?.siret_locked) {
        updateData.siret_number = data.siret;
      }
      if (!localProfile?.vat_number_locked) {
        updateData.vat_number = data.vat_number;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local profile
      if (localProfile) {
        setLocalProfile({
          ...localProfile,
          phone: data.phone,
          billing_address: data.billing_address,
          siret: !localProfile.siret_locked ? data.siret : localProfile.siret,
          vat_number: !localProfile.vat_number_locked ? data.vat_number : localProfile.vat_number
        });
      }
      
      toast.success("Vos informations ont été mises à jour avec succès.");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour changer le mot de passe
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // D'abord vérifier que le mot de passe actuel est correct en tentant de se connecter
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
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

  return (
    <ProfileContext.Provider value={{
      profile: localProfile,
      isLoading,
      error,
      submitForm,
      handleLogoUpdate,
      confirmLockField,
      showConfirmDialog,
      setShowConfirmDialog,
      handleConfirmLock,
      changePassword,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
