import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useAboutPageContents } from '@/hooks/useAboutPageContents';
import SEO from '@/components/SEO';

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

  // Schema.org structured data for AboutPage
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "À propos de DK Automotive",
    "description": "Découvrez DK Automotive, expert en convoyage automobile en France depuis 2018. Plus de 2000 missions réalisées avec des chauffeurs professionnels certifiés.",
    "url": "https://www.dkautomotive.fr/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "DK Automotive",
      "foundingDate": "2018",
      "description": "Expert en convoyage de véhicules par route en France",
      "areaServed": "France",
      "serviceType": ["Convoyage automobile", "Transport de véhicules", "Livraison de véhicules"]
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="À propos - Expert Convoyage Automobile"
        description="Découvrez DK Automotive, expert en convoyage automobile en France depuis 2018. Plus de 2000 missions réalisées avec des chauffeurs professionnels certifiés. Service fiable et sécurisé."
        canonical="https://www.dkautomotive.fr/about"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <main className="min-h-screen bg-white animate-fadeIn">
        {/* Section Hero */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">
                {getContentValue('hero_title', 'title')}
              </h1>
              <h2 className="text-xl md:text-3xl font-bold text-dk-navy mb-6">
                {getContentValue('hero_main_title', 'title')}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                {getContentValue('hero_subtitle', 'subtitle')}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 md:mb-12">
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
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                  {getContentValue('why_choose_title', 'title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('why_choose_description')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="text-dk-navy h-5 w-5 flex-shrink-0" />
                    <span className="text-muted-foreground">{getContentValue('why_choose_benefit_1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-dk-navy h-5 w-5 flex-shrink-0" />
                    <span className="text-muted-foreground">{getContentValue('why_choose_benefit_2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-dk-navy h-5 w-5 flex-shrink-0" />
                    <span className="text-muted-foreground">{getContentValue('why_choose_benefit_3')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-dk-navy h-5 w-5 flex-shrink-0" />
                    <span className="text-muted-foreground">{getContentValue('why_choose_benefit_4')}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/devis" className="inline-block bg-dk-navy text-white px-6 py-3 rounded hover:bg-dk-navy/90 transition-colors">
                    Demander un devis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Chauffeurs Expérimentés */}
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                  {getContentValue('drivers_title', 'title')}
                </h2>
                <h3 className="text-xl md:text-2xl font-bold text-dk-navy">
                  {getContentValue('drivers_subtitle', 'title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('drivers_description_1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('drivers_description_2')}
                </p>
                <div className="pt-2">
                  <Link to="/contact" className="inline-block bg-dk-navy text-white px-6 py-3 rounded hover:bg-dk-navy/90 transition-colors">
                    Contactez-nous
                  </Link>
                </div>
              </div>
              <div>
                {getImageUrl('drivers_image') && (
                  <img 
                    alt="Chauffeurs professionnels DK Automotive pour convoyage automobile" 
                    className="rounded-lg shadow-lg w-full" 
                    src={getImageUrl('drivers_image')} 
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Valeurs */}
        <section className="py-12 md:py-16 px-4 bg-dk-navy text-white">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                {getContentValue('values_section_title', 'title')}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <article className="text-center space-y-3">
                <div className="flex justify-center">
                  {getImageUrl('value_ecoconduite_image') && (
                    <img 
                      alt="Écoconduite - Engagement environnemental DK Automotive" 
                      className="w-14 h-14 mb-3" 
                      src={getImageUrl('value_ecoconduite_image')} 
                    />
                  )}
                </div>
                <h3 className="text-lg font-bold">
                  {getContentValue('value_ecoconduite_title', 'title')}
                </h3>
                <p className="text-sm text-white/80">
                  {getContentValue('value_ecoconduite_content')}
                </p>
              </article>
              <article className="text-center space-y-3">
                <div className="flex justify-center">
                  {getImageUrl('value_expertise_image') && (
                    <img 
                      alt="Expertise technique en convoyage de véhicules" 
                      className="w-14 h-14 mb-3" 
                      src={getImageUrl('value_expertise_image')} 
                    />
                  )}
                </div>
                <h3 className="text-lg font-bold">
                  {getContentValue('value_expertise_title', 'title')}
                </h3>
                <p className="text-sm text-white/80">
                  {getContentValue('value_expertise_content')}
                </p>
              </article>
              <article className="text-center space-y-3">
                <div className="flex justify-center">
                  {getImageUrl('value_service_image') && (
                    <img 
                      alt="Service sur-mesure de transport automobile" 
                      className="w-14 h-14 mb-3" 
                      src={getImageUrl('value_service_image')} 
                    />
                  )}
                </div>
                <h3 className="text-lg font-bold">
                  {getContentValue('value_service_title', 'title')}
                </h3>
                <p className="text-sm text-white/80">
                  {getContentValue('value_service_content')}
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Section Expertise en Convoyage */}
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                {getImageUrl('expertise_image') && (
                  <img 
                    alt="Expertise en convoyage automobile France" 
                    className="rounded-lg shadow-lg w-full" 
                    src={getImageUrl('expertise_image')} 
                  />
                )}
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                  {getContentValue('expertise_title', 'title')}
                </h2>
                <h3 className="text-xl md:text-2xl font-bold">
                  {getContentValue('expertise_subtitle', 'title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('expertise_description')}
                </p>
                <div className="pt-2">
                  <Link to="/devis" className="inline-block bg-dk-navy text-white px-6 py-3 rounded hover:bg-dk-navy/90 transition-colors text-sm font-medium">
                    Réservez votre transport en toute confiance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Finale */}
        <section className="py-12 md:py-16 px-4 bg-muted/50">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {getContentValue('final_title', 'title')}
            </h2>
            <h3 className="text-xl md:text-2xl font-bold text-dk-navy mb-4">
              {getContentValue('final_main_title', 'title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {getContentValue('final_subtitle', 'subtitle')}
            </p>
            <p className="text-muted-foreground mb-8">
              {getContentValue('final_description')}
            </p>
            <Link to="/devis" className="inline-block bg-dk-navy text-white px-8 py-4 font-medium hover:bg-dk-navy/90 transition-colors">
              Demandez votre devis
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
