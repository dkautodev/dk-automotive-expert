
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useAboutPageContents } from '@/hooks/useAboutPageContents';

const About = () => {
  const { contents, isLoading } = useAboutPageContents();

  const getContentByKey = (key: string) => {
    const content = contents.find(c => c.block_key === key);
    return content?.content_json || {};
  };

  const getContentValue = (key: string, field: string = 'content') => {
    const contentData = getContentByKey(key);
    return contentData[field] || '';
  };

  const getImageUrl = (key: string) => {
    const contentData = getContentByKey(key);
    return contentData.url || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Chargement...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="animate-fadeIn">
        {/* Section Hero */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {getContentValue('hero_title', 'title')}
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-[#18257D] mb-6">
                {getContentValue('hero_main_title', 'title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8">
                {getContentValue('hero_subtitle', 'subtitle')}
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 md:mb-12">
                {getContentValue('hero_description')}
              </p>
            </div>
          </div>
        </section>

        {/* Section Pourquoi choisir DK Automotive */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                {getImageUrl('why_choose_image') && (
                  <img 
                    alt="DK Automotive expertise" 
                    className="rounded-lg shadow-lg w-full" 
                    src={getImageUrl('why_choose_image')} 
                  />
                )}
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#18257D]">
                  {getContentValue('why_choose_title', 'title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {getContentValue('why_choose_description')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">{getContentValue('why_choose_benefit_1')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">{getContentValue('why_choose_benefit_2')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">{getContentValue('why_choose_benefit_3')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#18257D] h-6 w-6 flex-shrink-0" />
                    <p className="text-gray-600">{getContentValue('why_choose_benefit_4')}</p>
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

        {/* Section Chauffeurs Expérimentés */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#18257D]">
                  {getContentValue('drivers_title', 'title')}
                </h3>
                <h3 className="text-3xl font-bold text-[#18257D]">
                  {getContentValue('drivers_subtitle', 'title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {getContentValue('drivers_description_1')}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {getContentValue('drivers_description_2')}
                </p>
                <div className="pt-4">
                  <Link to="/contact" className="inline-block bg-[#18257D] text-white px-8 py-4 rounded hover:bg-[#18257D]/90 transition-colors">
                    Contactez-nous
                  </Link>
                </div>
              </div>
              <div>
                {getImageUrl('drivers_image') && (
                  <img 
                    alt="DK Automotive drivers" 
                    className="rounded-lg shadow-lg w-full" 
                    src={getImageUrl('drivers_image')} 
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Valeurs */}
        <section className="py-16 px-4 bg-[#18257D] text-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold">
                {getContentValue('values_section_title', 'title')}
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {getImageUrl('value_ecoconduite_image') && (
                    <img 
                      alt="Écoconduite" 
                      className="w-16 h-16 mb-4" 
                      src={getImageUrl('value_ecoconduite_image')} 
                    />
                  )}
                </div>
                <h4 className="text-xl font-bold">
                  {getContentValue('value_ecoconduite_title', 'title')}
                </h4>
                <p className="text-sm">
                  {getContentValue('value_ecoconduite_content')}
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {getImageUrl('value_expertise_image') && (
                    <img 
                      alt="Expertise technique" 
                      className="w-16 h-16 mb-4" 
                      src={getImageUrl('value_expertise_image')} 
                    />
                  )}
                </div>
                <h4 className="text-xl font-bold">
                  {getContentValue('value_expertise_title', 'title')}
                </h4>
                <p className="text-sm">
                  {getContentValue('value_expertise_content')}
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {getImageUrl('value_service_image') && (
                    <img 
                      alt="Service sur-mesure" 
                      className="w-16 h-16 mb-4" 
                      src={getImageUrl('value_service_image')} 
                    />
                  )}
                </div>
                <h4 className="text-xl font-bold">
                  {getContentValue('value_service_title', 'title')}
                </h4>
                <p className="text-sm">
                  {getContentValue('value_service_content')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Expertise en Convoyage */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {getImageUrl('expertise_image') && (
                  <img 
                    alt="Expertise en convoyage" 
                    className="rounded-lg shadow-lg w-full" 
                    src={getImageUrl('expertise_image')} 
                  />
                )}
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#18257D]">
                  {getContentValue('expertise_title', 'title')}
                </h3>
                <h4 className="text-2xl font-bold">
                  {getContentValue('expertise_subtitle', 'title')}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {getContentValue('expertise_description')}
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

        {/* Section Finale */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              {getContentValue('final_title', 'title')}
            </h2>
            <h3 className="text-4xl font-bold text-[#18257D] mb-4">
              {getContentValue('final_main_title', 'title')}
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              {getContentValue('final_subtitle', 'subtitle')}
            </p>
            <p className="text-lg text-gray-700 mb-8">
              {getContentValue('final_description')}
            </p>
            <Link to="/devis" className="inline-block bg-[#18257D] text-white px-8 py-4 text-lg font-semibold hover:bg-[#18257D]/90 transition-colors">
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
