import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navItems = [{
    path: "/",
    label: "Accueil"
  }, {
    path: "/devis",
    label: "Demande de devis"
  }, {
    path: "/contact",
    label: "Contact"
  }, {
    path: "/faq",
    label: "FAQ"
  }];
  return <>
      {/* TOPBAR */}
      <div className="fixed top-0 left-0 right-0 z-[55] bg-[#18257D] h-[34px] flex items-center">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-12">
          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="https://facebook.com/" title="Facebook" rel="noopener noreferrer" target="_blank" className="text-white hover:text-blue-300 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/" title="Instagram" rel="noopener noreferrer" target="_blank" className="text-white hover:text-blue-300 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          {/* Center text */}
          <div className="flex-1 text-center">
            <span className="text-white text-sm font-normal">
              Expert en convoyage depuis 2018 avec + 2 000 missions réalisées.
            </span>
          </div>
          {/* espace à droite pour équilibrer */}
          <div className="w-[60px] hidden sm:block"></div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b fixed top-[34px] left-0 right-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-0 py-[5px]">
          <div className="flex justify-between h-16 px-[25px]">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img alt="DK Automotive" className="h-10 w-auto object-fill" src="https://53a7f645-5239-4564-a038-600cd9086c4f.lovableproject.com/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png" />
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`px-3 py-2 text-sm font-medium transition-colors ${isActive(item.path) ? "text-dk-navy border-b-2 border-dk-navy" : "text-gray-700 hover:text-dk-navy"}`}>
                  {item.label}
                </Link>)}

              {/* Bouton Espace professionnel */}
              <a href="https://app-private.dkautomotive.fr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#18257D] text-white rounded-lg hover:bg-[#142064] transition-colors">
                <User className="w-4 h-4 text-white" />
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
          {isMenuOpen && <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                {navItems.map(item => <Link key={item.path} to={item.path} className={`block px-3 py-2 text-base font-medium transition-colors ${isActive(item.path) ? "text-dk-navy bg-dk-navy/5" : "text-gray-700 hover:text-dk-navy hover:bg-gray-50"}`} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>)}

                {/* Bouton Espace professionnel pour mobile */}
                <a href="https://app-private.dkautomotive.fr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-base font-medium bg-[#18257D] text-white rounded-lg hover:bg-[#142064] transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <User className="w-4 h-4 text-white" />
                  Espace professionnel
                </a>
              </div>
            </div>}
        </div>
      </nav>
    </>;
};
export default Navbar;