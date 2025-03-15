
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
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={`item-${index + 1}`} 
                    value={`item-${index + 1}`} 
                    className={`${index === 1 ? 'bg-[#64B5F6]' : 'bg-[#1a237e]'} rounded-none shadow-sm`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline text-xl font-medium text-white">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white text-lg">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const faqItems = [
  {
    question: "QU'EST-CE QUE LE CONVOYAGE DE VÉHICULES ?",
    answer: "Le convoyage de véhicules est un service professionnel qui consiste à transporter un véhicule d'un point A à un point B avec un chauffeur qualifié qui conduit directement votre véhicule jusqu'à sa destination."
  },
  {
    question: "COMMENT ÇA MARCHE ?",
    answer: "Après avoir effectué votre demande, nous organisons la prise en charge de votre véhicule. Un chauffeur professionnel vient récupérer votre véhicule à l'adresse indiquée, effectue un état des lieux détaillé, puis conduit votre véhicule jusqu'à sa destination finale."
  },
  {
    question: "LE CONVOYAGE EST-IL SÉCURISÉ POUR MON VÉHICULE ?",
    answer: "Oui, votre véhicule est totalement assuré pendant le transport. Nous effectuons un état des lieux complet avant et après le convoyage, et nos chauffeurs sont des professionnels expérimentés et assurés."
  },
  {
    question: "QUELS DOCUMENTS SONT NÉCESSAIRES POUR LE CONVOYAGE ?",
    answer: "Les documents requis sont : la carte grise du véhicule, l'attestation d'assurance en cours de validité, et une autorisation de prise en charge que nous vous fournissons. Une pièce d'identité du propriétaire peut également être demandée."
  },
  {
    question: "QUE CONTIENT LE PRIX DE LA PRESTATION ?",
    answer: "Le prix comprend la prise en charge du véhicule, le convoyage par un chauffeur professionnel, les frais de route (carburant, péages), l'assurance durant le transport, et la livraison à l'adresse indiquée."
  },
  {
    question: "QUE FAIRE SI MON VÉHICULE ARRIVE ENDOMMAGÉ ?",
    answer: "En cas de dommage constaté à l'arrivée, il sera noté sur l'état des lieux final. Notre assurance professionnelle prendra en charge les réparations nécessaires selon les conditions définies dans notre contrat."
  },
  {
    question: "POURQUOI CHOISIR UN CONVOYAGE DE VÉHICULE PAR ROUTE AVEC UN CHAUFFEUR PROFESSIONNEL ET QUELS SONT LES DÉLAIS DE LIVRAISON ?",
    answer: "Le convoyage par route avec un chauffeur professionnel offre flexibilité, sécurité et rapidité. Les délais de livraison varient selon la distance mais sont généralement de 24 à 72 heures pour la France métropolitaine."
  },
  {
    question: "QUELS SONT LES TYPES DE VÉHICULES QUE VOUS POUVEZ TRANSPORTER ?",
    answer: "Nous transportons tous types de véhicules : voitures particulières, utilitaires, camping-cars, motos, véhicules de collection, et véhicules professionnels."
  },
  {
    question: "LE VÉHICULE DOIT-IL ÊTRE EN PARFAIT ÉTAT DE FONCTIONNEMENT POUR LE CONVOYAGE ?",
    answer: "Le véhicule doit être en état de rouler de manière sécurisée. Un minimum de carburant est nécessaire, et les documents du véhicule doivent être à jour."
  },
  {
    question: "COMMENT SONT FORMÉS VOS CHAUFFEURS ?",
    answer: "Nos chauffeurs sont des professionnels expérimentés, formés spécifiquement au convoyage de véhicules. Ils possèdent tous les permis nécessaires et suivent des formations régulières."
  },
  {
    question: "QUE SE PASSE-T-IL SI JE DOIS ANNULER OU MODIFIER MA RÉSERVATION ?",
    answer: "En cas d'annulation ou de modification, contactez-nous au plus tôt. Les conditions peuvent varier selon le délai de préavis. Notre équipe fera son possible pour s'adapter à vos besoins."
  }
];

export default FAQ;
