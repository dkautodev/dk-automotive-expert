
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
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
                <img 
                  src="/lovable-uploads/36e10c4a-a023-4147-a0b0-adc05679ea46.png" 
                  alt="DK Automotive expertise" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#18257D]">
                  NOTRE EXPERTISE
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Notre engagement envers l'excellence et notre compréhension approfondie du secteur du transport nous permettent de fournir des solutions sur mesure pour chaque client. Notre équipe expérimentée assure un service professionnel et fiable, adapté à vos besoins spécifiques.
                </p>
                <div className="pt-4">
                  <Link 
                    to="/devis" 
                    className="inline-block bg-[#18257D] text-white px-8 py-4 rounded hover:bg-[#18257D]/90 transition-colors"
                  >
                    Demander un devis
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
            <Link 
              to="/devis" 
              className="inline-block bg-[#18257D] text-white px-8 py-4 text-lg font-semibold hover:bg-[#18257D]/90 transition-colors"
            >
              DEMANDEZ VOTRE DEVIS
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
