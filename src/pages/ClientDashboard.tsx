
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import DashboardHome from "@/components/client/DashboardHome";
import Profile from "@/components/client/Profile";
import OrderHistory from "@/components/client/OrderHistory";
import OrderDetails from "./OrderDetails";

const ClientDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <main className="flex-1">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="order-details" element={<OrderDetails />} />
            <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
