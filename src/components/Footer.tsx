
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return <footer className="bg-[#18257D] text-white py-[50px] my-[35px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <img src="/lovable-uploads/0569d88f-5ec1-4822-8cae-a5f0ba017d54.png" alt="DK AUTOMOTIVE" className="h-20 mb-4 mx-auto md:mx-0 brightness-0 invert hover-scale" />
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Notre entreprise spécialisée dans le convoyage de véhicules propose un service 
              sur mesure, écologique et économique pour les particuliers et les professionnels.
            </p>
            <Link 
              to="/admin-auth" 
              className="text-white/80 hover:text-white transition-colors hover-scale inline-block flex items-center gap-1 mb-4"
            >
              <ShieldCheck size={14} />
              Espace administrateur
            </Link>
          </div>

          <div className="col-span-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              A PROPOS
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors hover-scale inline-block">
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white transition-colors hover-scale inline-block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              LIENS DIRECTS
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors hover-scale inline-block">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link to="/devis" className="text-white/80 hover:text-white transition-colors hover-scale inline-block">
                  Obtenir mon devis
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              NEWSLETTER
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></span>
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Abonnez-vous et recevez nos offres exclusives et actualités sur le convoyage !
            </p>
            <form className="space-y-2" onSubmit={e => e.preventDefault()}>
              <div className="flex gap-2">
                <Input type="email" placeholder="Email *" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40" />
                <Button type="submit" variant="secondary" size="icon" className="hover-scale">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <Link to="/mentions-legales" className="text-white/60 hover:text-white transition-colors hover-scale inline-block">
                Mentions légales
              </Link>
              <span className="text-white/60">•</span>
              <Link to="/politique-confidentialite" className="text-white/60 hover:text-white transition-colors hover-scale inline-block">
                Politique de confidentialité
              </Link>
              <span className="text-white/60">•</span>
              <Link to="/cookies" className="text-white/60 hover:text-white transition-colors hover-scale inline-block">
                Cookies
              </Link>
            </div>
            <div className="text-sm text-white/60">
              © {new Date().getFullYear()} DK Automotive. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
