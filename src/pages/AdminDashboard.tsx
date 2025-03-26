
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHome from "@/components/admin/AdminHome";
import PricingGrids from "@/pages/PricingGrids";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const { isAuthenticated, role, isLoading } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder au tableau de bord administrateur.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      if (role !== 'admin') {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'accès au tableau de bord administrateur.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsChecking(false);
    }
  }, [isAuthenticated, isLoading, navigate, role, toast]);

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
            <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
