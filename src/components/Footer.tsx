
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return <footer className="text-white py-12 bg-[#051e83]">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <img alt="DK Automotive Logo" src="/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png" className="w-24 h-auto filter invert grayscale object-fill" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contactez-nous</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <a href="mailto:contact@dkautomotive.fr" className="hover:text-gray-300 transition">contact@dkautomotive.fr</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                <a href="tel:0601020304" className="hover:text-gray-300 transition">06-01-02-03-04</a>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                <a href="https://maps.app.goo.gl/t7JAgJJWj3pep2j97" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                  19 rue de Bresse, 93000 Bobigny
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-gray-300 transition">
                  Qui sommes-nous ?
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gray-300 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/devis" className="hover:text-gray-300 transition">
                  Demander un devis
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Mentions légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/mentions-legales" className="hover:text-gray-300 transition">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="hover:text-gray-300 transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-gray-300 transition">
                  Gestion des cookies
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-gray-300 transition">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} DK AUTOMOTIVE. 
            <a href="https://app-private.dkautomotive.fr/home" className="ml-1 hover:text-gray-300 transition" target="_blank" rel="noopener noreferrer">
              Tous droits réservés
            </a>
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
