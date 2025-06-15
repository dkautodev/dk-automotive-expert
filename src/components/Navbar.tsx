
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    {
      path: "/",
      label: "Accueil"
    }, 
    {
      path: "/devis",
      label: "Demande de devis"
    }, 
    {
      path: "/contact",
      label: "Contact"
    }, 
    {
      path: "/faq",
      label: "FAQ"
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[20px] py-[5px]">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-10 w-auto" src="/lovable-uploads/15aa1e07-0fa4-487b-b0c1-3c631f4385b6.png" alt="DK Automotive" />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path) 
                    ? "text-dk-navy border-b-2 border-dk-navy" 
                    : "text-gray-700 hover:text-dk-navy"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Bouton Espace professionnel */}
            <a 
              href="https://app-private.dkautomotive.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <User className="w-4 h-4" />
              Espace professionnel
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActive(item.path) 
                      ? "text-dk-navy bg-dk-navy/5" 
                      : "text-gray-700 hover:text-dk-navy hover:bg-gray-50"
                  }`} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Bouton Espace professionnel pour mobile */}
              <a 
                href="https://app-private.dkautomotive.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                Espace professionnel
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
