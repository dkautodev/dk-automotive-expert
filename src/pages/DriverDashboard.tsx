
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

const DriverDashboard = () => {
  const { isAuthenticated, isLoading, role } = useAuthContext();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Vous devez être connecté pour accéder au tableau de bord chauffeur");
        navigate("/driver-auth");
        return;
      }

      // Vérifier que l'utilisateur a bien le rôle de chauffeur
      if (role !== 'chauffeur') {
        toast.error("Vous n'avez pas les droits d'accès au tableau de bord chauffeur");
        // Rediriger vers le tableau de bord approprié ou la page d'accueil
        if (role === 'admin') {
          navigate("/dashboard/admin");
        } else if (role === 'client') {
          navigate("/dashboard/client");
        } else {
          navigate("/");
        }
        return;
      }

      setIsChecking(false);
    }
  }, [isAuthenticated, isLoading, navigate, role]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Contenu du tableau de bord chauffeur */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold p-6">Tableau de bord Chauffeur</h1>
          <div className="p-6">
            <p>Bienvenue sur votre espace chauffeur.</p>
            {/* Contenu à compléter selon les besoins */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DriverDashboard;
