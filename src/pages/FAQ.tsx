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
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-black">FAQ</span>
                <br />
                <span className="text-[#1a237e]">DK AUTOMOTIVE</span>
              </h1>
              <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
                Trouvez toutes les réponses à vos interrogations sur notre service de convoyage de véhicules
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    QU'EST-CE QUE LE CONVOYAGE DE VÉHICULES ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Le convoyage de véhicules est un service professionnel qui consiste à transporter un véhicule d'un point A à un point B avec un chauffeur qualifié qui conduit directement votre véhicule jusqu'à sa destination.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    COMMENT ÇA MARCHE ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Après avoir effectué votre demande, nous organisons la prise en charge de votre véhicule. Un chauffeur professionnel vient récupérer votre véhicule à l'adresse indiquée, effectue un état des lieux détaillé, puis conduit votre véhicule jusqu'à sa destination finale.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    LE CONVOYAGE EST-IL SÉCURISÉ POUR MON VÉHICULE ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Oui, votre véhicule est totalement assuré pendant le transport. Nous effectuons un état des lieux complet avant et après le convoyage, et nos chauffeurs sont des professionnels expérimentés et assurés.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    QUELS DOCUMENTS SONT NÉCESSAIRES POUR LE CONVOYAGE ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Les documents requis sont : la carte grise du véhicule, l'attestation d'assurance en cours de validité, et une autorisation de prise en charge que nous vous fournissons. Une pièce d'identité du propriétaire peut également être demandée.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    QUE CONTIENT LE PRIX DE LA PRESTATION ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Le prix comprend la prise en charge du véhicule, le convoyage par un chauffeur professionnel, les frais de route (carburant, péages), l'assurance durant le transport, et la livraison à l'adresse indiquée.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    QUE FAIRE SI MON VÉHICULE ARRIVE ENDOMMAGÉ ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    En cas de dommage constaté à l'arrivée, il sera noté sur l'état des lieux final. Notre assurance professionnelle prendra en charge les réparations nécessaires selon les conditions définies dans notre contrat.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline whitespace-normal text-left">
                    POURQUOI CHOISIR UN CONVOYAGE DE VÉHICULE PAR ROUTE AVEC UN CHAUFFEUR PROFESSIONNEL ET QUELS SONT LES DÉLAIS DE LIVRAISON ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Le convoyage par route avec un chauffeur professionnel offre flexibilité, sécurité et rapidité. Les délais de livraison varient selon la distance mais sont généralement de 24 à 72 heures pour la France métropolitaine.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    QUELS SONT LES TYPES DE VÉHICULES QUE VOUS POUVEZ TRANSPORTER ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Nous transportons tous types de véhicules : voitures particulières, utilitaires, camping-cars, motos, véhicules de collection, et véhicules professionnels.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    LE VÉHICULE DOIT-IL ÊTRE EN PARFAIT ÉTAT DE FONCTIONNEMENT POUR LE CONVOYAGE ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Le véhicule doit être en état de rouler de manière sécurisée. Un minimum de carburant est nécessaire, et les documents du véhicule doivent être à jour.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    COMMENT SONT FORMÉS VOS CHAUFFEURS ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    Nos chauffeurs sont des professionnels expérimentés, formés spécifiquement au convoyage de véhicules. Ils possèdent tous les permis nécessaires et suivent des formations régulières.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11" className="bg-[#1a237e] text-white rounded-lg shadow-sm">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    QUE SE PASSE-T-IL SI JE DOIS ANNULER OU MODIFIER MA RÉSERVATION ?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-white">
                    En cas d'annulation ou de modification, contactez-nous au plus tôt. Les conditions peuvent varier selon le délai de préavis. Notre équipe fera son possible pour s'adapter à vos besoins.
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
