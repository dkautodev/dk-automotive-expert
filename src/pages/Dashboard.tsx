
import { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import AppSidebar from "@/components/dashboard/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { isAuthenticated, isLoading, user, role } = useAuthContext();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Vous devez être connecté pour accéder au tableau de bord");
        navigate("/auth");
        return;
      }

      setIsChecking(false);
    }
  }, [isAuthenticated, isLoading, navigate]);

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
        <AppSidebar />
        <main className={isMobile ? "pt-16 w-full" : "flex-1 pl-52"}>
          <div className={isMobile ? "px-4 py-6" : "px-6 py-6"}>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
