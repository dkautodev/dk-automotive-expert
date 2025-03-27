
import { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import ProfileConfirmDialog from "./ProfileConfirmDialog";
import { useProfileContext } from "./ProfileContext";
import { useAuthContext } from "@/context/AuthContext";

const ProfileWrapper = () => {
  const { 
    profile, 
    submitForm, 
    handleLogoUpdate, 
    confirmLockField, 
    showConfirmDialog, 
    setShowConfirmDialog, 
    handleConfirmLock 
  } = useProfileContext();
  
  const authContext = useAuthContext();
  
  useEffect(() => {
    console.log("Auth context profile:", authContext.profile);
    console.log("Profile context profile:", profile);
  }, [authContext.profile, profile]);

  return (
    <div className="p-6">
      <ProfileHeader />
      {!profile && authContext.isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : !profile ? (
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-md my-4">
          <p className="text-red-600">Impossible de charger les données du profil. Veuillez réessayer plus tard.</p>
        </div>
      ) : (
        <ProfileCard 
          profile={profile} 
          onSubmit={submitForm} 
          onLogoUpdate={handleLogoUpdate} 
          onLockField={confirmLockField} 
        />
      )}
      <ProfileConfirmDialog 
        open={showConfirmDialog} 
        onOpenChange={setShowConfirmDialog} 
        onConfirm={handleConfirmLock} 
      />
    </div>
  );
};

export default ProfileWrapper;
