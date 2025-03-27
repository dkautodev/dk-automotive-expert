
import { LogoUpload } from "@/components/client/LogoUpload";
import { ProfileData } from "./types";

interface LogoSectionProps {
  profile: ProfileData | null;
  onLogoUpdate: (logoUrl: string) => Promise<void>;
}

const LogoSection = ({ profile, onLogoUpdate }: LogoSectionProps) => {
  return (
    <LogoUpload 
      currentLogo={profile?.profile_picture} 
      onUploadSuccess={onLogoUpdate} 
    />
  );
};

export default LogoSection;
