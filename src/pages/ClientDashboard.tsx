
import { SidebarProvider } from "@/components/ui/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import ClientSidebar from "@/components/client/ClientSidebar";
import DashboardHome from "@/components/client/DashboardHome";
import Profile from "@/components/client/Profile";
import OrderHistory from "@/components/client/OrderHistory";
import OrderDetails from "./OrderDetails";
import PendingQuotes from "./PendingQuotes";
import QuoteDetails from "./QuoteDetails";
import OngoingShipments from "./OngoingShipments";
import PendingInvoices from "./PendingInvoices";
import CompletedShipments from "./CompletedShipments";

const ClientDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <main className="flex-1 pl-52">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="order-details" element={<OrderDetails />} />
            <Route path="pending-quotes" element={<PendingQuotes />} />
            <Route path="quotes/:id" element={<QuoteDetails />} />
            <Route path="ongoing-shipments" element={<OngoingShipments />} />
            <Route path="completed-shipments" element={<CompletedShipments />} />
            <Route path="pending-invoices" element={<PendingInvoices />} />
            <Route path="*" element={<Navigate to="/dashboard/client" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
