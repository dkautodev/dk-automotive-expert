
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export const AdminLink = () => {
  return (
    <Link 
      to="/admin-auth" 
      className="text-xs text-muted-foreground hover:text-dk-navy flex items-center gap-1 transition-colors"
    >
      <ShieldCheck size={14} />
      Espace administrateur
    </Link>
  );
};
