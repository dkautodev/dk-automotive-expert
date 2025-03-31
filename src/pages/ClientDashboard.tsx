
import { useEffect, useState } from "react";
import { SidebarProvider, Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import DashboardHome from "@/components/client/DashboardHome";
import OrderHistory from "@/components/client/OrderHistory";
import OngoingShipments from "./OngoingShipments";
import PendingInvoices from "./PendingInvoices";
import CompletedShipments from "./CompletedShipments";
import PendingQuotes from "./PendingQuotes";
import MissionHistory from "./MissionHistory";
import Profile from "@/components/client/Profile";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import CreateMissionButton from "@/components/client/CreateMissionButton";

const ClientDashboard = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, role } = useAuthContext();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Vous devez être connecté pour accéder à votre tableau de bord");
        navigate("/auth");
        return;
      }

      // Si l'utilisateur est un administrateur, le rediriger vers le tableau de bord admin
      if (role === 'admin') {
        navigate("/dashboard/admin");
        return;
      }

      // Si l'utilisateur est un chauffeur, le rediriger vers le tableau de bord chauffeur
      if (role === 'chauffeur') {
        navigate("/dashboard/driver");
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
        {isMobile ? (
          <div className="fixed top-0 left-0 z-40 w-full bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">DK Automotive</h1>
            <CreateMissionButton />
          </div>
        ) : (
          <ClientSidebar />
        )}
        <main className={isMobile ? "pt-16 w-full" : "flex-1 pl-52"}>
          <div className={isMobile ? "px-4 py-6" : "px-6 py-6"}>
            {!isMobile && (
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tableau de bord</h1>
                <CreateMissionButton />
              </div>
            )}
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="ongoing-shipments" element={<OngoingShipments />} />
              <Route path="completed-shipments" element={<CompletedShipments />} />
              <Route path="pending-invoices" element={<PendingInvoices />} />
              <Route path="pending-quotes" element={<PendingQuotes />} />
              <Route path="mission-history" element={<MissionHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
