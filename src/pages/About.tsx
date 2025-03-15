import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
const About = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      <main className="animate-fadeIn">
        {/* Hero Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">
                BIENVENUE CHEZ
              </h1>
              <h2 className="text-5xl font-bold text-[#18257D] mb-6">
                DK AUTOMOTIVE
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Votre partenaire fiable pour le convoyage de véhicules.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-12">
                Forts de plus de 5 ans d'expérience dans les métiers du convoyage et du transport en général, nous avons développé une expertise inégalée pour répondre aux besoins les plus exigeants de nos clients.
              </p>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img alt="DK Automotive expertise" className="rounded-lg shadow-lg w-full" src="/lovable-uploads/68f33641-ed3b-4ff0-b6f3-288ab97beda1.jpg" />
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#18257D]">
                  POURQUOI CHOISIR DK AUTOMOTIVE POUR VOS BESOINS EN CONVOYAGE AUTOMOBILE ?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  En faisant appel à DK AUTOMOTIVE, vous bénéficiez également de la conformité de toutes les régulations européennes en matière de convoyage automobile, garantissant un transport sécurisé de votre véhicule. Pour en savoir plus sur les régulations et les bonnes pratiques en matière de transport de véhicules en Europe, consultez l'article publié par la Commission européenne <a href="https://transport.ec.europa.eu/index_en" target="_blank" rel="noopener noreferrer" className="text-[#18257D] underline">lien</a>.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">Une équipe de professionnels expérimentés pour garantir la sécurité de votre véhicule.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">Une couverture géographique étendue pour répondre à vos besoins de transport en France et pays limitrophes.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">Des services sur mesure, adaptés à vos exigences et contraintes.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">Des tarifs compétitifs et transparents pour un rapport qualité-prix optimal en matière de tarif convoyage voiture.</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link to="/devis" className="inline-block bg-[#18257D] text-white px-8 py-4 rounded hover:bg-[#18257D]/90 transition-colors">
                    Demander un devis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Drivers Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#18257D]">
                  CHAUFFEURS EXPÉRIMENTÉS
                </h3>
                <h3 className="text-3xl font-bold text-[#18257D]">
                  Des convoyeurs rigoureusement sélectionnés
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nos convoyeurs expérimentés et sélectionnés avec soin sont notre atout majeur. Tous de nos convoyeurs professionnels ont été sélectionnés rigoureusement pour leur expérience du métier, leur savoir-faire et leur engagement pour la satisfaction clientèle. Chez DK AUTOMOTIVE, nous ne faisons aucun compromis pour assurer la qualité de nos services.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Nous accordons une importance primordiale à la formation continue de nos chauffeurs. En effet, nos différents sont formés aux différentes procédures indispensables pour assurer un transport sûr et respectueux de l'environnement. L'écoconduite, la connaissance technique des différents véhicules et la réalisation de mises en main véhicules font partie intégrante de leur formation.
                </p>
                <div className="pt-4">
                  <Link to="/contact" className="inline-block bg-[#18257D] text-white px-8 py-4 rounded hover:bg-[#18257D]/90 transition-colors">
                    Contactez-nous
                  </Link>
                </div>
              </div>
              <div>
                <img alt="DK Automotive drivers" className="rounded-lg shadow-lg w-full" src="/lovable-uploads/95eb9367-8ef9-4af5-b92d-805ea0cdeca3.jpg" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 bg-[#18257D] text-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <img alt="Écoconduite" className="w-16 h-16 mb-4" src="/lovable-uploads/19f7f830-34f1-4f2b-91ed-e3517a2a87f6.jpg" />
                </div>
                <h4 className="text-xl font-bold">ÉCOCONDUITE</h4>
                <p className="text-sm">
                  Nos chauffeurs sont formés à adopter des pratiques de conduite écologique pour réduire la consommation de carburant et minimiser l'impact environnemental.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <img alt="Expertise technique" className="w-16 h-16 mb-4" src="/lovable-uploads/a527220b-aca5-4730-b21e-ec6177c7b83d.jpg" />
                </div>
                <h4 className="text-xl font-bold">EXPERTISE TECHNIQUE</h4>
                <p className="text-sm">
                  Les chauffeurs DK AUTOMOTIVE sont experts dans la connaissance technique des différents véhicules, leur permettant de s'adapter à toutes les situations et de garantir un convoyage sécurisé.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <img alt="Service sur-mesure" className="w-16 h-16 mb-4" src="/lovable-uploads/2b49a059-d379-4b8f-847a-628ff2c1a7bc.jpg" />
                </div>
                <h4 className="text-xl font-bold">SERVICE SUR-MESURE</h4>
                <p className="text-sm">
                  Chez DK AUTOMOTIVE, nous nous adaptons à vos besoins spécifiques en matière de convoyage, offrant des solutions personnalisées pour assurer une expérience client optimale et un convoyage de véhicules en toute sérénité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img alt="Expertise en convoyage" className="rounded-lg shadow-lg w-full" src="/lovable-uploads/65f150ef-91b6-4e32-ac29-e59c718d1905.jpg" />
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#18257D]">
                  EXPERTISE EN CONVOYAGE AUTOMOBILE
                </h3>
                <h4 className="text-2xl font-bold">
                  Assurez-vous d'un transport sécurisé et fiable pour vos véhicules
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Chez DK AUTOMOTIVE, nous comprenons que la confiance et la satisfaction de nos clients sont essentielles. C'est pourquoi, nous nous efforçons d'offrir un service transparent, professionnel et adapté aux besoins individuels de chaque client. En choisissant DK AUTOMOTIVE, vous optez pour une entreprise qui met tout en œuvre pour vous offrir un service de qualité, capable d'inspirer confiance et de rassurer ses clients.
                </p>
                <div className="pt-4">
                  <Link to="/devis" className="inline-block bg-[#18257D] text-white px-8 py-4 rounded hover:bg-[#18257D]/90 transition-colors">
                    RÉSERVEZ VOTRE TRANSPORT EN TOUTE CONFIANCE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">FAITES LE CHOIX DE L'EXPERTISE</h2>
            <h3 className="text-4xl font-bold text-[#18257D] mb-4">DK AUTOMOTIVE</h3>
            <p className="text-lg text-gray-700 mb-8">UN PARTENAIRE FIABLE POUR VOS BESOINS EN CONVOYAGE</p>
            <Link to="/devis" className="inline-block bg-[#18257D] text-white px-8 py-4 text-lg font-semibold hover:bg-[#18257D]/90 transition-colors">
              DEMANDEZ VOTRE DEVIS
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default About;