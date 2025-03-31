
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHome from "@/components/admin/AdminHome";
import PricingGrids from "@/pages/PricingGrids";
import PendingInvoices from "@/pages/PendingInvoices";
import ProfileManagement from "@/pages/ProfileManagement";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Vous devez être connecté pour accéder au tableau de bord administrateur");
        navigate("/auth");
        return;
      }

      // Check if the email matches the admin email
      if (user?.email !== 'dkautomotive70@gmail.com') {
        toast.error("Vous n'avez pas les droits d'accès au tableau de bord administrateur");
        navigate("/");
        return;
      }

      setIsChecking(false);
    }
  }, [isAuthenticated, isLoading, navigate, user]);

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
        <AdminSidebar />
        <main className="flex-1 pl-52">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="pricing-grids" element={<PricingGrids />} />
            <Route path="pending-invoices" element={<PendingInvoices />} />
            <Route path="profile-management" element={<ProfileManagement />} />
            <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
