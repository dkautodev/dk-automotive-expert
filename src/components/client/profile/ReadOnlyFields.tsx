
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileData } from "./types";

interface ReadOnlyFieldsProps {
  profile: ProfileData | null;
}

const ReadOnlyFields = ({ profile }: ReadOnlyFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Nom</Label>
        <Input value={profile?.last_name || ""} disabled className="bg-gray-50" />
      </div>
      <div>
        <Label>Prénom</Label>
        <Input value={profile?.first_name || ""} disabled className="bg-gray-50" />
      </div>
      <div>
        <Label>Société</Label>
        <Input value={profile?.company || ""} disabled className="bg-gray-50" />
      </div>
    </div>
  );
};

export default ReadOnlyFields;
