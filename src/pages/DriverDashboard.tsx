
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import DriverSidebar from "@/components/driver/DriverSidebar";
import DriverHome from "@/components/driver/DriverHome";
import DriverMissions from "@/components/driver/DriverMissions";
import DriverProfile from "@/components/driver/DriverProfile";
import DriverDocuments from "@/components/driver/DriverDocuments";
import DriverEarnings from "@/components/driver/DriverEarnings";
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
        <DriverSidebar />
        <main className="flex-1 pl-52">
          <Routes>
            <Route index element={<DriverHome />} />
            <Route path="missions" element={<DriverMissions />} />
            <Route path="profile" element={<DriverProfile />} />
            <Route path="documents" element={<DriverDocuments />} />
            <Route path="earnings" element={<DriverEarnings />} />
            <Route path="*" element={<Navigate to="/dashboard/driver" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DriverDashboard;
