
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Devis from "@/pages/Devis";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import CGV from "@/pages/CGV";
import CGU from "@/pages/CGU";
import MentionsLegales from "@/pages/MentionsLegales";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite";
import GestionCookies from "@/pages/GestionCookies";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import PreCommande from "@/pages/PreCommande";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isAuthPage = location.pathname === '/auth';
  const isAboutPage = location.pathname === '/about';

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 ${!isAuthPage ? 'pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/gestion-cookies" element={<GestionCookies />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pre-commande" element={<PreCommande />} />
        </Routes>
      </main>
      {!isAdminPage && !isAuthPage && !isAboutPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
