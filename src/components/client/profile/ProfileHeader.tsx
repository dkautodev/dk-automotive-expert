
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileHeader = () => {
  return (
    <Button variant="ghost" size="sm" asChild className="mb-4">
      <Link to="/dashboard/client">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au tableau de bord
      </Link>
    </Button>
  );
};

export default ProfileHeader;
