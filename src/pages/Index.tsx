import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ClipboardList, PhoneCall, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="animate-fadeIn">
        <section className="relative h-[400px] md:h-[600px] bg-cover bg-center" style={{
          backgroundImage: 'url("/lovable-uploads/51603c32-87b6-4e5d-ab03-7352caca679d.png")'
        }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-white leading-tight tracking-tight uppercase">
                Convoyage de véhicules<br />par route en France
              </h1>
              
              <div className="space-y-3 mb-6 md:mb-8">
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

              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 font-light leading-relaxed">
                Confiez-nous le convoyage de vos véhicules, pour un service sur mesure,<br className="hidden md:block" />
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
        <section className="relative bg-white py-0">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              
              
              
              <div className="mb-8">
                <h3 className="text-2xl md:text-4xl font-bold mb-4 py-[30px]">
                  FAITES CONFIANCE À DK AUTOMOTIVE
                </h3>
                <h4 className="text-xl md:text-3xl font-bold text-[#18257D] mb-4">
                  L'EXPERT DU CONVOYAGE SUR ROUTE
                </h4>
                <p className="text-sm md:text-base text-gray-600">
                  Pourquoi choisir DK AUTOMOTIVE pour vos besoins en convoyage de véhicules :
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="relative py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img alt="Voiture sur route" className="rounded-lg w-full" src="/lovable-uploads/2849f1ca-ef57-425c-8271-11ee1da479e6.jpg" />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#18257D]">
                  EXPERTISE ET DÉVOUEMENT DES CHAUFFEURS
                </h2>
                <p className="text-gray-600">
                  Chez DK AUTOMOTIVE, nos chauffeurs professionnels ont été sélectionnés pour leur expérience et leur engagement exceptionnels. Formés à des procédures strictes et à l'écoconduite, ils garantissent un convoyage sûr et écologique de votre véhicule.
                </p>
                <p className="text-gray-600">
                  Prêt à découvrir la différence avec nos services de convoyage professionnels ? <Link to="/contact" className="text-[#18257D] hover:underline">Contactez-nous</Link> sans plus tarder !
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Délais Section */}
        <section className="relative py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <h2 className="text-2xl md:text-3xl font-bold text-[#18257D]">
                  DÉLAIS DE LIVRAISON RAPIDES
                </h2>
                <p className="text-gray-600">
                  DK AUTOMOTIVE se distingue par la réduction significative des délais de livraison. Avec une garantie de prise en charge rapide sous 48h, nous offrons un service rapide et fiable partout en France.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    Réduction significative des délais
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    Prise en charge rapide sous 48h maximum
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    Service fiable et étendu
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <img alt="Voiture dans un garage" className="rounded-lg w-full" src="/lovable-uploads/38340b13-78ba-4ae6-ba15-9851924dcf27.jpg" />
              </div>
            </div>
          </div>
        </section>

        {/* Tarification Section */}
        <section className="relative py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img alt="Remise de clés" className="rounded-lg w-full" src="/lovable-uploads/e26f2a44-10f8-4ea8-bf96-6fe52fe1cf18.jpg" />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#18257D]">
                  TARIFICATION TRANSPARENTE ET PERSONNALISÉE
                </h2>
                <p className="text-gray-600">
                  Nous offrons des tarifs transparents et adaptés, incluant tous les frais, pour répondre aux besoins uniques de chaque client, avec un engagement pour un service éco-responsable.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    Tarifs transparents et adaptés
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    Service inclusif sans frais cachés
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    Engagement éco-responsable
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center mx-auto" style={{
            maxWidth: "calc(100% - 2rem)"
          }}>
              <p className="text-gray-600 mb-8 text-xl">
                Prêt à découvrir la différence avec nos services de convoyage professionnels ? Contactez-nous ou faites une demande de devis personnalisée adaptée à vos besoins de transport.
              </p>
              <Link to="/devis">
                <Button className="bg-[#18257D] hover:bg-[#18257D]/90 text-white transition-colors px-8 py-6 text-lg">
                  Obtenez votre devis !
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Engagement Section */}
        <section className="relative py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-[#18257D] mb-6">
                VOTRE CONFIANCE, NOTRE ENGAGEMENT
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mb-8">
                Chez DK Automotive, chaque parcours est une promesse de qualité et de fiabilité.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-[#18257D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#18257D] mb-3">Fiabilité</h3>
                  <p className="text-gray-600">Des services de convoyage sur lesquels vous pouvez compter à chaque instant.</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-[#18257D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#18257D] mb-3">Expertise</h3>
                  <p className="text-gray-600">Une équipe de professionnels expérimentés à votre service.</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-[#18257D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#18257D] mb-3">Satisfaction</h3>
                  <p className="text-gray-600">Votre satisfaction est notre priorité absolue.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="relative py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                COMMENT ÇA MARCHE
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-[#18257D] mb-12">
                AVEC DK AUTOMOTIVE
              </h3>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#18257D] mb-4">1. JE REMPLIS LE FORMULAIRE DE DEVIS</h4>
                  <p className="text-gray-600">Je remplis le formulaire de devis en vérifiant correctement mes informations.</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <PhoneCall className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#18257D] mb-4">2. APPEL AVEC UN CONSEILLER</h4>
                  <p className="text-gray-600">Un conseiller vous rappelle sous 24h pour voir comment concrétiser votre convoyage.</p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#18257D] mb-4">3. CONVOYAGE DE VOTRE VÉHICULE</h4>
                  <p className="text-gray-600">J'accepte mon devis et votre projet est réalisé à la date et heure convenue.</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Commencez dès maintenant !</h3>
                <Link to="/devis">
                  <Button className="bg-[#18257D] hover:bg-[#18257D]/90 text-white transition-colors px-8 py-6 text-lg">
                    Demandez votre devis gratuitement
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};

export default Index;
