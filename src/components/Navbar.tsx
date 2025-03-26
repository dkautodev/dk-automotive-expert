
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, UserRound, Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const isMobile = useIsMobile();

  const navLinks = [
    { to: "/devis", text: "OBTENIR MON DEVIS" },
    { to: "/about", text: "QUI SOMMES-NOUS" },
    { to: "/contact", text: "CONTACTEZ-NOUS" },
    { to: "/faq", text: "FAQ" },
  ];

  return (
    <div className="w-full sticky top-0 z-50">
      <div className="bg-dk-navy text-white py-2 px-4">
        <div className="container flex justify-between items-center mx-auto">
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
               className="hover:text-dk-blue transition-colors hover-scale">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
               className="hover:text-dk-blue transition-colors hover-scale">
              <Instagram size={20} />
            </a>
          </div>
          <p className="text-sm text-center hidden md:block font-light">
            Expert en convoyage depuis 2018 avec + 2 000 missions réalisées.
          </p>
          <div className="flex gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white/70 hover:text-white/100 transition-colors text-xs flex items-center gap-1">
                  <ShieldCheck size={14} />
                  <span className="sr-only md:not-sr-only">Admin</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/admin-auth">Espace administrateur</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <nav className="bg-white/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex-shrink-0">
              <img src="/lovable-uploads/ea18e979-d5d3-4e98-9a6b-2979a5f6ce83.png" 
                   alt="DK AUTOMOTIVE" 
                   className="h-8 md:h-12 hover-scale" />
            </Link>
            
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover-scale">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] glass-effect">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="text-dk-navy hover:text-dk-blue transition-colors py-2 text-lg font-medium hover-scale"
                      >
                        {link.text}
                      </Link>
                    ))}
                    <Button asChild className="bg-dk-navy hover:bg-dk-blue text-white transition-colors w-full mt-4 hover-scale">
                      <Link to="/auth">
                        <UserRound className="mr-2" />
                        Espace professionnel
                      </Link>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="hidden md:flex space-x-8 items-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-dk-navy hover:text-dk-blue transition-colors font-medium hover-scale"
                  >
                    {link.text}
                  </Link>
                ))}
                <Button asChild className="bg-dk-navy hover:bg-dk-blue text-white transition-colors hover-scale">
                  <Link to="/auth">
                    <UserRound className="mr-2" />
                    Espace professionnel
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
