
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Devis from "./pages/Devis";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Cookies from "./pages/Cookies";
import CGV from "./pages/CGV";
import Dashboard from "./pages/Dashboard";
import AddressBook from "./pages/AddressBook";
import Profile from "./components/dashboard/Profile";
import DashboardHome from "./components/dashboard/DashboardHome";
import UserManagement from "./components/dashboard/UserManagement";
import Settings from "./components/dashboard/Settings";
import ClientManagement from "./components/admin/ClientManagement";
import AdminHome from "./components/admin/AdminHome";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/devis" element={<Devis />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/cgv" element={<CGV />} />
              
              {/* Route d'authentification */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Routes du tableau de bord unifié */}
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="contacts" element={<AddressBook />} />
                <Route path="profile" element={<Profile />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<Settings />} />
                <Route path="admin" element={<AdminHome />} />
                <Route path="admin/users" element={<ClientManagement />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
