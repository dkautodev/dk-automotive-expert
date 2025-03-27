
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import ProfileConfirmDialog from "./ProfileConfirmDialog";
import { useProfileContext } from "./ProfileContext";

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

  return (
    <div className="p-6">
      <ProfileHeader />
      <ProfileCard 
        profile={profile} 
        onSubmit={submitForm} 
        onLogoUpdate={handleLogoUpdate} 
        onLockField={confirmLockField} 
      />
      <ProfileConfirmDialog 
        open={showConfirmDialog} 
        onOpenChange={setShowConfirmDialog} 
        onConfirm={handleConfirmLock} 
      />
    </div>
  );
};

export default ProfileWrapper;
