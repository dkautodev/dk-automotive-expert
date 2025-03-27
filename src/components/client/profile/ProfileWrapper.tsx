import { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import ProfileConfirmDialog from "./ProfileConfirmDialog";
import { useProfileContext } from "./ProfileContext";
import { Button } from "@/components/ui/button";
import { ArrowPathIcon, RefreshCw } from "lucide-react";
import ChangePasswordSection from "./ChangePasswordSection";

const ProfileWrapper = () => {
  const { 
    profile, 
    isLoading,
    error,
    submitForm, 
    handleLogoUpdate, 
    confirmLockField, 
    showConfirmDialog, 
    setShowConfirmDialog, 
    handleConfirmLock 
  } = useProfileContext();

  // Fonction pour recharger la page
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="p-6">
      <ProfileHeader />
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-md my-4">
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={handleRetry}
            variant="outline" 
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
      ) : !profile ? (
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-md my-4">
          <p className="text-yellow-600">Aucune donnée de profil trouvée. Veuillez compléter votre profil.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <ProfileCard 
            profile={profile} 
            onSubmit={submitForm} 
            onLogoUpdate={handleLogoUpdate} 
            onLockField={confirmLockField} 
          />
          
          <ChangePasswordSection />
        </div>
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
