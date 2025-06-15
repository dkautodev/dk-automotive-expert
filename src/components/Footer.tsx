
import React from 'react';
import { Link } from 'react-router-dom';
import { AtSign, Copyright } from 'lucide-react';

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
              <AtSign className="mr-2 h-5 w-5" />
              <Link to="/contact" className="hover:text-gray-300 transition">
                Formulaire de contact
              </Link>
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
            <li>
              <a
                href="https://app-private.dkautomotive.fr/home"
                className="hover:text-gray-300 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Espace professionnel
              </a>
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
        <Link 
          to="/admin"
          className="inline-flex items-center justify-center space-x-2 text-inherit hover:underline focus:outline-none focus:ring-2 focus:ring-white/60 transition"
          title="Accéder à l'administration"
        >
          <Copyright size={18} className="inline mr-1 mb-0.5" />
          <span>
            {`© ${new Date().getFullYear()} DK AUTOMOTIVE. Tous droits réservés`}
          </span>
        </Link>
      </div>
    </div>
  </footer>;
};

export default Footer;

