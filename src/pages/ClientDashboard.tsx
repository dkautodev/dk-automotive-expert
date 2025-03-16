
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import DashboardHome from "@/components/client/DashboardHome";
import Profile from "@/components/client/Profile";
import OrderHistory from "@/components/client/OrderHistory";
import OrderDetails from "./OrderDetails";
import OngoingShipments from "./OngoingShipments";
import PendingInvoices from "./PendingInvoices";
import CompletedShipments from "./CompletedShipments";
import PendingQuotes from "./PendingQuotes";

const ClientDashboard = () => {
  const location = useLocation();
  const isOrderDetails = location.pathname.includes('/order-details');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isOrderDetails && <ClientSidebar />}
        <main className={`flex-1 ${!isOrderDetails ? 'pl-52' : ''}`}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="order-details" element={<OrderDetails />} />
            <Route path="ongoing-shipments" element={<OngoingShipments />} />
            <Route path="completed-shipments" element={<CompletedShipments />} />
            <Route path="pending-invoices" element={<PendingInvoices />} />
            <Route path="pending-quotes" element={<PendingQuotes />} />
            <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
