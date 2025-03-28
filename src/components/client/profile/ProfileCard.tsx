
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileData } from "./types";
import { ProfileFormSchemaType } from "./schemas/profileFormSchema";
import LogoSection from "./LogoSection";
import ReadOnlyFields from "./ReadOnlyFields";
import ProfileForm from "./ProfileForm";

interface ProfileCardProps {
  profile: ProfileData | null;
  onSubmit: (data: ProfileFormSchemaType) => Promise<void>;
  onLogoUpdate: (logoUrl: string) => Promise<void>;
  onLockField: (field: 'siret' | 'vat_number', value: string) => void;
}

const ProfileCard = ({ profile, onSubmit, onLogoUpdate, onLockField }: ProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <LogoSection profile={profile} onLogoUpdate={onLogoUpdate} />
        <ReadOnlyFields profile={profile} />
        <ProfileForm 
          profile={profile} 
          onSubmit={onSubmit} 
          onLockField={onLockField} 
        />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
