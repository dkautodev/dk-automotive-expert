
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { ProfileContextType, ProfileData } from "./types";
import { ProfileFormSchemaType } from "./schemas/profileFormSchema";
import { useProfileData } from "./hooks/useProfileData";
import { useProfileUpdate } from "./hooks/useProfileUpdate";
import { useLogoUpdate } from "./hooks/useLogoUpdate";
import { useFieldLocking } from "./hooks/useFieldLocking";
import { usePasswordChange } from "./hooks/usePasswordChange";

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const userId = user?.id;
  const userEmail = user?.email;
  
  console.log("Current user context:", userId, userEmail);
  
  // Use our custom hooks
  const { profile, setProfile, isLoading, error } = useProfileData(userId);
  const { submitForm } = useProfileUpdate(userId, profile, setProfile);
  const { handleLogoUpdate } = useLogoUpdate(userId, profile, setProfile);
  const { showConfirmDialog, setShowConfirmDialog, confirmLockField, handleConfirmLock } = useFieldLocking(userId, profile, setProfile);
  const { changePassword } = usePasswordChange(userEmail);

  // Use fallback from authProfile if we don't have a local profile yet
  const { profile: authProfile } = useAuthContext();
  
  useEffect(() => {
    if (!profile && authProfile) {
      console.log("Using authProfile as fallback:", authProfile);
      setProfile(authProfile);
    }
  }, [authProfile, profile, setProfile]);

  return (
    <ProfileContext.Provider value={{
      profile,
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
