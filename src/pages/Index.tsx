import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';

const Index = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="animate-fadeIn">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-cover bg-center" style={{
        backgroundImage: 'url("/lovable-uploads/51603c32-87b6-4e5d-ab03-7352caca679d.png")'
      }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-8 text-white leading-tight tracking-tight uppercase">
                Convoyage de véhicules<br />par route en France
              </h1>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="text-lg font-light">Convoyage sur mesure et économique</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="text-lg font-light">Engagement Éco-responsable</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="text-lg font-light">Livraison rapide et sécurisée</span>
                </div>
              </div>

              <p className="text-xl text-white/90 mb-8 font-light leading-relaxed">
                Confiez-nous le convoyage de vos véhicules, pour un service sur mesure,<br />
                écologique et économique.
              </p>
              
              <Link to="/devis">
                <Button className="bg-white text-dk-navy hover:bg-gray-100 transition-colors px-6 py-5 text-base">
                  Demander mon devis sur mesure
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="relative py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-dk-blue mb-3 tracking-wide">
                VOTRE CONFIANCE, NOTRE ENGAGEMENT
              </h2>
              <p className="text-sm md:text-base text-gray-600 font-light italic mb-10">
                Chez DK Automotive, chaque parcours est une promesse de qualité et de fiabilité.
              </p>
              <Separator className="max-w-xs mx-auto bg-gray-300" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-dk-navy mb-8">Prêt à simplifier vos déplacements de véhicules ?</h2>
            <Link to="/devis">
              <Button className="bg-dk-blue hover:bg-dk-navy text-white transition-colors text-lg px-8 py-6">
                Demander mon devis sur mesure
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>;
};

export default Index;
