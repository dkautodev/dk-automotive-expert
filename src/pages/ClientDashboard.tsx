
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import DashboardHome from "@/components/client/DashboardHome";
import Profile from "@/components/client/Profile";
import OrderHistory from "@/components/client/OrderHistory";
import OngoingShipments from "./OngoingShipments";
import PendingInvoices from "./PendingInvoices";
import CompletedShipments from "./CompletedShipments";
import PendingQuotes from "./PendingQuotes";
import CreateQuote from "./CreateQuote";

const ClientDashboard = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <main className="flex-1 pl-52">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="ongoing-shipments" element={<OngoingShipments />} />
            <Route path="completed-shipments" element={<CompletedShipments />} />
            <Route path="pending-invoices" element={<PendingInvoices />} />
            <Route path="pending-quotes" element={<PendingQuotes />} />
            <Route path="create-quote" element={<CreateQuote />} />
            <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
