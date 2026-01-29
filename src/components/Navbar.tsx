import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Facebook, Instagram, Linkedin, Twitter, Youtube, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfessionalSpaceSettings } from "@/hooks/useProfessionalSpaceSettings";
import { usePageContents } from "@/hooks/usePageContents";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const getIconComponent = (iconName: string | null) => {
  switch (iconName) {
    case 'facebook': return Facebook;
    case 'instagram': return Instagram;
    case 'linkedin': return Linkedin;
    case 'twitter': return Twitter;
    case 'youtube': return Youtube;
    default: return LinkIcon;
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getProfessionalSpaceUrl } = useProfessionalSpaceSettings();
  const { contents } = usePageContents('navbar');
  const { socialLinks } = useSocialLinks();

  const isActive = (path: string) => location.pathname === path;
  const professionalSpaceUrl = getProfessionalSpaceUrl();

  // Get the logo URL from page contents or use default
  const logoContent = contents.find(item => item.block_key === 'logo');
  const logoUrl = logoContent?.content_value || '/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png';
  
  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/about", label: "Qui sommes-nous ?" },
    { path: "/devis", label: "Obtenir votre devis" },
    { path: "/contact", label: "Contact" },
    { path: "/faq", label: "FAQ" }
  ];

  return (
    <>
      {/* TOPBAR */}
      <div className="fixed top-0 left-0 right-0 z-[55] bg-dk-navy h-[34px] flex items-center">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-12">
          {/* Social */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const IconComponent = getIconComponent(link.icon);
              return (
                <a 
                  key={link.id}
                  href={link.url || '#'} 
                  title={`Suivez DK Automotive sur ${link.platform_label}`} 
                  aria-label={`${link.platform_label} DK Automotive`} 
                  rel="noopener noreferrer" 
                  target="_blank" 
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>
          {/* Center text - hidden on small screens, visible on medium+ */}
          <div className="hidden sm:flex flex-1 justify-center">
            <span className="text-white text-sm font-normal">
              Expert en convoyage depuis 2018 avec + 2 000 missions réalisées.
            </span>
          </div>
          {/* Mobile text - shorter version */}
          <div className="flex sm:hidden flex-1 justify-center">
            <span className="text-white text-xs font-normal text-center">
              Expert en convoyage depuis 2018 avec + 2 000 missions réalisées.
            </span>
          </div>
          {/* espace à droite pour équilibrer */}
          <div className="w-[60px] hidden sm:block" />
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b fixed top-[34px] left-0 right-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-0 py-[5px]">
          <div className="flex justify-between h-16 px-[25px]">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img 
                  alt="DK Automotive" 
                  className="h-10 w-auto object-fill" 
                  src={logoUrl} 
                  onError={(e) => {
                    e.currentTarget.src = '/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png';
                  }} 
                />
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
                href={professionalSpaceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-dk-navy text-white rounded-lg hover:bg-dk-navy/90 transition-colors"
              >
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
                  href={professionalSpaceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium bg-dk-navy text-white rounded-lg hover:bg-dk-navy/90 transition-colors" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 text-white" />
                  Espace professionnel
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
