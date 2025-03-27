
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export const AdminLink = () => {
  return (
    <Link 
      to="/admin-auth" 
      className="text-white/80 hover:text-white transition-colors hover-scale inline-block flex items-center gap-1"
    >
      <ShieldCheck size={14} />
      Espace administrateur
    </Link>
  );
};
