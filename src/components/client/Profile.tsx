
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => (
  <div className="p-6">
    <Button variant="ghost" size="sm" asChild className="mb-4">
      <Link to="/dashboard/client">
        <ArrowLeft className="mr-2" />
        Retour au tableau de bord
      </Link>
    </Button>
    <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
    <p>Contenu du profil à venir...</p>
  </div>
);

export default Profile;

