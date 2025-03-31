
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import DashboardHome from "@/components/client/DashboardHome";
import OrderHistory from "@/components/client/OrderHistory";
import OngoingShipments from "./OngoingShipments";
import PendingInvoices from "./PendingInvoices";
import CompletedShipments from "./CompletedShipments";
import PendingQuotes from "./PendingQuotes";
import Profile from "@/components/client/Profile";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

const ClientDashboard = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, role } = useAuthContext();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

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
        <ClientSidebar />
        <main className="flex-1 pl-52">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="ongoing-shipments" element={<OngoingShipments />} />
            <Route path="completed-shipments" element={<CompletedShipments />} />
            <Route path="pending-invoices" element={<PendingInvoices />} />
            <Route path="pending-quotes" element={<PendingQuotes />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
