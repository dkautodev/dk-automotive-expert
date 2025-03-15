
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="animate-fadeIn">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url("/lovable-uploads/51603c32-87b6-4e5d-ab03-7352caca679d.png")' }}>
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay sombre pour la lisibilité */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-6 text-white">Leader du convoyage automobile professionnel</h1>
              <p className="text-xl mb-8 text-white">Votre partenaire de confiance pour le transport de véhicules depuis 2018</p>
              <Link to="/devis">
                <Button className="bg-white text-dk-navy hover:bg-gray-100 transition-colors text-lg px-8 py-6">
                  Demander mon devis sur mesure
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-dk-navy mb-16">Nos services de convoyage</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-dk-blue mb-4">Convoyage</h3>
                <p className="text-gray-600">Transport de véhicules par nos chauffeurs professionnels sur toute la France</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-dk-blue mb-4">Livraisons</h3>
                <p className="text-gray-600">Livraison de véhicules neufs ou d'occasion à vos clients</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-dk-blue mb-4">Restitutions</h3>
                <p className="text-gray-600">Récupération et restitution de véhicules de location ou de leasing</p>
              </div>
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
    </div>
  );
};

export default Index;
