
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="animate-fadeIn">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-black">QUESTIONS</span>
                <br />
                <span className="text-dk-navy">FRÉQUENTES</span>
              </h1>
              <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
                Retrouvez ici les réponses aux questions les plus fréquemment posées sur nos services de convoyage.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    Comment fonctionne un convoyage de véhicule ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-gray-600">
                    Le convoyage de véhicule consiste à confier votre véhicule à un chauffeur professionnel qui se chargera de conduire votre véhicule jusqu'à destination. Nos chauffeurs sont des professionnels expérimentés, formés et assurés. Ils prennent en charge votre véhicule avec le plus grand soin et s'assurent de le livrer en parfait état à l'adresse indiquée.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    Quels types de véhicules pouvez-vous convoyer ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-gray-600">
                    Nous convoyons tous types de véhicules : voitures particulières, utilitaires, camping-cars, motos, etc. Notre équipe de chauffeurs est qualifiée pour la conduite de différents types de véhicules et s'adapte à vos besoins spécifiques.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    Quels sont les documents nécessaires pour un convoyage ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-gray-600">
                    Pour un convoyage, nous avons besoin des documents suivants : carte grise du véhicule, attestation d'assurance en cours de validité, et autorisation de prise en charge du véhicule (fournie par nos soins). Une pièce d'identité du propriétaire peut également être demandée.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    Êtes-vous assurés pour le convoyage ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-gray-600">
                    Oui, nous sommes pleinement assurés pour le convoyage de véhicules. Notre assurance professionnelle couvre tous les risques liés au transport de votre véhicule pendant toute la durée du convoyage.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    Dans quels délais pouvez-vous intervenir ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-gray-600">
                    Nous intervenons généralement sous 48h maximum après la validation de votre demande. Pour les urgences, nous pouvons également proposer une intervention plus rapide selon nos disponibilités. Contactez-nous pour en savoir plus sur nos délais d'intervention.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    Comment est calculé le prix d'un convoyage ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-gray-600">
                    Le prix du convoyage est calculé en fonction de plusieurs critères : la distance à parcourir, le type de véhicule, les conditions spécifiques de la mission (délais, urgence), et les éventuels frais annexes (péages, carburant). Nous vous fournissons un devis détaillé et transparent avant chaque mission.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    Quelles sont les zones géographiques couvertes ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-gray-600">
                    Nous intervenons sur l'ensemble du territoire français métropolitain. Nos services de convoyage sont disponibles pour toutes les régions, que ce soit pour des trajets courts ou longue distance.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
