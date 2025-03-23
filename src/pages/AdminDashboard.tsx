
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHome from "@/components/admin/AdminHome";
import PricingGrids from "@/pages/PricingGrids";

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1">
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
