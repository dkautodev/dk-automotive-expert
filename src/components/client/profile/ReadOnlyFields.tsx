
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileData } from "./types";
import { toUpperCase, capitalizeFirstLetter } from "@/utils/textFormatters";

interface ReadOnlyFieldsProps {
  profile: ProfileData | null;
}

const ReadOnlyFields = ({ profile }: ReadOnlyFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Nom</Label>
        <Input value={profile?.last_name ? toUpperCase(profile.last_name) : ""} disabled className="bg-gray-50" />
      </div>
      <div>
        <Label>Prénom</Label>
        <Input value={profile?.first_name ? capitalizeFirstLetter(profile.first_name) : ""} disabled className="bg-gray-50" />
      </div>
      <div>
        <Label>Société</Label>
        <Input value={profile?.company ? toUpperCase(profile.company) : ""} disabled className="bg-gray-50" />
      </div>
    </div>
  );
};

export default ReadOnlyFields;
