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
              <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto whitespace-nowrap">
                Trouvez toutes les réponses à vos interrogations sur notre service de convoyage de véhicules
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={`item-${index + 1}`} 
                    value={`item-${index + 1}`} 
                    className="bg-[#1a237e] rounded-none shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline text-sm font-medium text-white">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white text-base">
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
    answer: "Le convoyage de véhicules consiste à déplacer un véhicule d'un point A à un point B, que ce soit pour de longues ou courtes distances. Cela peut inclure la livraison de véhicules neufs, le rapatriement de voitures d'occasion, ou le transfert de véhicules entre différentes agences ou sites."
  },
  {
    question: "COMMENT ÇA MARCHE ?",
    answer: "Vous pouvez faire une demande de prise en charge notre formulaire en ligne dans la rubrique « Obtenir mon devis », ou en nous envoyant un email avec les détails de votre demande. Nous vous fournirons un devis et organiserons le transport selon vos besoins."
  },
  {
    question: "LE CONVOYAGE EST-IL SÉCURISÉ POUR MON VÉHICULE ?",
    answer: "Oui, nous prenons toutes les mesures nécessaires pour assurer la sécurité de votre véhicule pendant le transport. Nos convoyeurs professionnels veillent à ce que votre voiture arrive en bon état. En outre, nous offrons des options d'assurance pour plus de tranquillité d'esprit."
  },
  {
    question: "QUELS DOCUMENTS SONT NÉCESSAIRES POUR LE CONVOYAGE ?",
    answer: "Vous aurez besoin de fournir des documents tels que la carte grise du véhicule, l'assurance, et éventuellement procès verbaux de livraison et/restitution. Nous vous indiquerons les documents exacts nécessaires lors de la réservation."
  },
  {
    question: "QUE CONTIENT LE PRIX DE LA PRESTATION ?",
    answer: "Le coût du convoyage dépend de plusieurs facteurs, tels que la distance, le type de véhicule, et le niveau de service choisi. Nous vous fournirons un devis détaillé avant le début du service."
  },
  {
    question: "QUE FAIRE SI MON VÉHICULE ARRIVE ENDOMMAGÉ ?",
    answer: "Nous prenons des mesures pour éviter tout dommage. Si vous constatez des anomalies à la livraison de votre véhicule, veuillez nous en informer immédiatement. Nous avons une procédure en place pour traiter les réclamations et nous nous engageons à résoudre tout problème rapidement."
  },
  {
    question: "POURQUOI CHOISIR UN CONVOYAGE DE VÉHICULE PAR LA ROUTE AVEC UN CHAUFFEUR PROFESSIONNEL ?",
    answer: "Le convoyage auto est une solution avantageuse qui permet de disposer de votre véhicule lors de votre arrivée. Vous n'êtes pas obligé de vous préoccuper du voyage de votre véhicule entre le lieu de départ et la destination finale. De plus, cette solution de transport permet de réduire considérablement les délais de livraison. Dès lors que votre prise en charge confirmée par nos services, DK AUTOMOTIVE s'engage à livrer votre véhicule dans un délai de 24 à 48 heures maximum, quel que soit le lieu d'enlèvement et de livraison."
  },
  {
    question: "QUELS SONT LES TYPES DE VÉHICULES QUE VOUS POUVEZ TRANSPORTER ?",
    answer: "Il vous suffit de nous indiquer les adresses d'enlèvement et de livraison, la date souhaitée pour le transport et le type de véhicule à convoyer. Nous vous soumettons ensuite un devis personnalisé comprenant le transfert du véhicule entre les deux adresses, ainsi que les frais de route (péages, carburant, etc.) et les éventuels frais annexes (mise en main du véhicule, nettoyage intérieur, etc.). Le devis est gratuit et sans engagement."
  },
  {
    question: "LE VÉHICULE DOIT-IL ÊTRE EN PARFAIT ÉTAT DE FONCTIONNEMENT POUR LE CONVOYAGE ?",
    answer: "Bien que nous puissions transporter des véhicules en bon état de marche, nous recommandons que le véhicule soit en état de fonctionnement pour éviter tout problème pendant le transport. Si des réparations sont nécessaires avant le convoyage, veuillez nous en informer."
  },
  {
    question: "COMMENT SONT FORMÉS VOS CHAUFFEURS ?",
    answer: "Tous nos chauffeurs sont formés aux différentes procédures indispensables pour assurer un convoyage sûr et respectueux de l'environnement. Ils suivent une formation rigoureuse à l'éco-conduite, à la connaissance technique des différents véhicules et à la réalisation de mises en main de véhicules. Nous accordons une importance primordiale à la formation continue de nos chauffeurs pour garantir un service de qualité à nos clients."
  },
  {
    question: "QUE SE PASSE-T-IL SI JE DOIS MODIFIER OU ANNULER MA COMMANDE ?",
    answer: "Vous pouvez modifier votre réservation en nous contactant directement. Vous pouvez annuler votre commande sans pénalités financières si l'annulation intervient jusqu'à 48h avant la date de début de disponibilité du véhicule. Si vous annulez une commande moins de 48h avant la prise en charge du véhicule, nous facturerons 50% du montant de la commande."
  }
];

export default FAQ;
