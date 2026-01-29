import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Qui sommes-nous ?', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' },
  ];

  const serviceLinks = [
    { label: 'Demander un devis', to: '/devis' },
    { label: 'Espace professionnel', href: 'https://app-private.dkautomotive.fr/home', external: true },
  ];

  const legalLinks = [
    { label: 'Mentions légales', to: '/mentions-legales' },
    { label: 'Politique de confidentialité', to: '/politique-confidentialite' },
    { label: 'Gestion des cookies', to: '/gestion-cookies' },
    { label: 'CGU', to: '/cgu' },
    { label: 'CGV', to: '/cgv' },
  ];

  return (
    <footer className="bg-dk-navy text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img 
                alt="DK Automotive Logo" 
                src="/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png" 
                className="h-12 w-auto filter invert grayscale" 
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Votre partenaire de confiance pour le convoyage de véhicules partout en France.
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:contact@dkautomotive.fr" 
                className="flex items-center gap-3 text-sm text-white/80 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                contact@dkautomotive.fr
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">
              À propos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/70 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">
              Nos services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ) : (
                    <Link 
                      to={link.to!} 
                      className="text-white/70 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">
              Informations légales
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-white/70 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} DK Automotive. Tous droits réservés.
            </p>
            <p className="text-white/40 text-xs">
              Convoyage de véhicules partout en France
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
