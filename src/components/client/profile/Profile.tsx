
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import ProfileConfirmDialog from "./ProfileConfirmDialog";
import { ProfileFormData } from "./types";

const Profile = () => {
  const { profile } = useAuthContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldToLock, setFieldToLock] = useState<'siret' | 'vat_number' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      // Mock the database update
      console.log("Would update logo to:", logoUrl);
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
    if (!fieldToLock || !profile?.id) return;
    try {
      // Mock the database update
      console.log(`Would lock ${fieldToLock} with value ${tempValue}`);
      toast.success("Le champ a été mis à jour et verrouillé.");
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error locking field:', error);
      toast.error("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Format the billing address from the individual fields
      const formattedBillingAddress = `${data.billing_address_street}, ${data.billing_address_postal_code} ${data.billing_address_city}, ${data.billing_address_country}`;
      
      // Mock the database update
      console.log("Would update profile with:", {
        email: data.email,
        phone: data.phone,
        billing_address: formattedBillingAddress,
        siret: data.siret,
        vat_number: data.vat_number
      });
      
      toast.success("Vos informations ont été mises à jour avec succès.");
    } catch (error: any) {
      toast.error("Une erreur est survenue lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="p-6">
      <ProfileHeader />
      <ProfileCard 
        profile={profile} 
        onSubmit={onSubmit} 
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

export default Profile;
