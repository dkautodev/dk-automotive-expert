
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Devis from "@/pages/Devis";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import CGV from "@/pages/CGV";
import MentionsLegales from "@/pages/MentionsLegales";
import GestionCookies from "@/pages/GestionCookies";
+import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/devis" element={<Devis />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/cgv" element={<CGV />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/gestion-cookies" element={<GestionCookies />} />
+             <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
