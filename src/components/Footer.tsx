
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#18257D] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <img 
              src="/lovable-uploads/0569d88f-5ec1-4822-8cae-a5f0ba017d54.png" 
              alt="DK AUTOMOTIVE"
              className="h-20 mb-4 mx-auto md:mx-0"
            />
            <p className="text-sm text-white/80 leading-relaxed">
              Notre entreprise spécialisée dans le convoyage de véhicules propose un service sur mesure, écologique et économique pour les particuliers et les professionnels.
            </p>
          </div>

          {/* A Propos */}
          <div className="col-span-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">A PROPOS</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contactez-nous</Link></li>
              <li><Link to="/faq" className="text-white/80 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Liens Directs */}
          <div className="col-span-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">LIENS DIRECTS</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">Qui sommes-nous</Link></li>
              <li><Link to="/devis" className="text-white/80 hover:text-white transition-colors">Obtenir mon devis</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">NEWSLETTER</h3>
            <p className="text-sm text-white/80 mb-4">
              Abonnez-vous et recevez nos offres exclusives et actualités sur le convoyage !
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Email *" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button type="submit" variant="secondary" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
