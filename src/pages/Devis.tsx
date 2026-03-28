import React from 'react';
import QuoteForm from '@/components/quote-form/QuoteForm';
import SEO from '@/components/SEO';
import { FileText, Shield, Clock } from 'lucide-react';

const Devis = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Demander un devis" 
        description="Obtenez un devis gratuit et immédiat pour le convoyage de votre véhicule. Service rapide, tarifs transparents et assurance tous risques incluse."
        canonical="https://www.dkautomotive.fr/devis"
      />
      
      <main className="flex-1 animate-fadeIn">
        {/* Hero Section */}
        <section className="relative bg-dk-navy py-12 md:py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-dk-navy via-dk-navy to-dk-blue opacity-90" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Obtenez votre devis immédiat
              </h1>
              <p className="text-white/90 text-base md:text-lg font-light leading-relaxed mb-8">
                Calculez le prix de votre convoyage en quelques clics. 
                Tarifs transparents, sans frais cachés.
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">Devis gratuit</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">Réponse immédiate</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">Assurance incluse</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-border">
                <QuoteForm />
              </div>
            </div>
          </div>
        </section>
        
        {/* Reassurance Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-dk-navy text-center mb-8">
                Pourquoi demander un devis chez DK Automotive ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <article className="text-center p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-dk-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-dk-navy" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-dk-navy mb-2">Tarifs transparents</h3>
                  <p className="text-muted-foreground text-sm">
                    Tous les frais sont inclus dans notre tarification. Aucune surprise.
                  </p>
                </article>
                
                <article className="text-center p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-dk-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-dk-navy" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-dk-navy mb-2">Prise en charge rapide</h3>
                  <p className="text-muted-foreground text-sm">
                    Votre véhicule est pris en charge sous 48h maximum.
                  </p>
                </article>
                
                <article className="text-center p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-dk-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-dk-navy" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-dk-navy mb-2">Assurance tous risques</h3>
                  <p className="text-muted-foreground text-sm">
                    Votre véhicule est couvert pendant tout le trajet.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Devis;
