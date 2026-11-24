import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <SEO title="Page non trouvée" noIndex={true} />
      <div className="text-center max-w-md mx-auto">
        <span className="text-dk-navy text-6xl md:text-8xl font-extrabold tracking-tight">404</span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-3">Page introuvable</h1>
        <p className="text-muted-foreground text-base mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-gray-300">
            <Link to="/devis">
              Demander un devis
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
