import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import { CookieConsent } from "@/components/common/CookieConsent";
import { ConsentManagedScripts } from "@/components/common/ConsentManagedScripts";

// Code-splitting : chargement à la demande des routes secondaires et privées
const About = lazy(() => import("@/pages/About"));
const Devis = lazy(() => import("@/pages/Devis"));
const Contact = lazy(() => import("@/pages/Contact"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const CGV = lazy(() => import("@/pages/CGV"));
const CGU = lazy(() => import("@/pages/CGU"));
const MentionsLegales = lazy(() => import("@/pages/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("@/pages/PolitiqueConfidentialite"));
const GestionCookies = lazy(() => import("@/pages/GestionCookies"));
const Auth = lazy(() => import("@/pages/Auth"));
const PreCommande = lazy(() => import("@/pages/PreCommande"));
const Pilote = lazy(() => import("@/pages/Pilote"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/pilote';
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/payment-success';

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <div className="flex-1 pt-[98px]">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center" />}>
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
            <Route path="/admin" element={<Navigate to="/pilote" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pre-commande" element={<PreCommande />} />
            <Route path="/pilote" element={<Pilote />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {!isAdminPage && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
            <Toaster />
            <CookieConsent />
            <ConsentManagedScripts />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
