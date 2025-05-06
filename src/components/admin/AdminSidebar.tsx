
import { Home, CreditCard, Settings, CircleDollarSign, Users, List, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const AdminSidebar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Navigate to auth page directly since we're removing dashboard
      navigate("/auth");
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar className="w-52 fixed top-0 left-0 h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">
            DK Automotive Admin
          </h2>
          <p className="text-sm text-muted-foreground">
            Tableau de bord administrateur
          </p>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <NavLink 
              to="/dashboard/admin" 
              end
              className={({ isActive }) => 
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive ? 'bg-secondary' : 'hover:bg-secondary/80'
                }`
              }
            >
              <Home className="h-4 w-4" /> Accueil
            </NavLink>
            <NavLink 
              to="/dashboard/admin/pricing-grids" 
              className={({ isActive }) => 
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive ? 'bg-secondary' : 'hover:bg-secondary/80'
                }`
              }
            >
              <CreditCard className="h-4 w-4" /> Grilles tarifaires
            </NavLink>
            <NavLink 
              to="/dashboard/admin/pending-invoices" 
              className={({ isActive }) => 
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive ? 'bg-secondary' : 'hover:bg-secondary/80'
                }`
              }
            >
              <CircleDollarSign className="h-4 w-4" /> Factures en attente
            </NavLink>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;
