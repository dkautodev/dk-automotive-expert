import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Navbar = () => {
  return <div className="w-full">
      <div className="bg-dk-navy text-white py-2 px-4">
        <div className="container flex justify-between items-center mx-0">
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-dk-blue transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-dk-blue transition-colors">
              <Instagram size={20} />
            </a>
          </div>
          <p className="text-sm flex-1 text-center px-[50px]">Expert en convoyage depuis 2018 avec + 2 000 missions réalisées.</p>
          <div className="flex-1"></div>
        </div>
      </div>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex-shrink-0">
              <img src="/lovable-uploads/ea18e979-d5d3-4e98-9a6b-2979a5f6ce83.png" alt="DK AUTOMOTIVE" className="h-12" />
            </Link>
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/devis" className="text-dk-navy hover:text-dk-blue transition-colors">OBTENIR MON DEVIS</Link>
              <Link to="/about" className="text-dk-navy hover:text-dk-blue transition-colors">QUI SOMMES-NOUS</Link>
              <Link to="/contact" className="text-dk-navy hover:text-dk-blue transition-colors">CONTACTEZ-NOUS</Link>
              <Link to="/faq" className="text-dk-navy hover:text-dk-blue transition-colors">FAQ</Link>
              <Button className="bg-dk-blue hover:bg-dk-navy text-white transition-colors">
                Accès à mon espace
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>;
};
export default Navbar;