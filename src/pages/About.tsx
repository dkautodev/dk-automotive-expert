import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Loader2, ArrowRight, Leaf, ShieldCheck, Settings2 } from 'lucide-react';
import { useAboutPageContents } from '@/hooks/useAboutPageContents';
import SEO from '@/components/SEO';
import Hero from '@/components/common/Hero';

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

  return (
    <>
      <SEO 
        title="À propos - Expert Convoyage Automobile"
        description="Découvrez DK Automotive, expert en convoyage automobile en France depuis 2018. Plus de 2000 missions réalisées avec des chauffeurs professionnels certifiés. Service fiable et sécurisé."
        canonical="https://www.dkautomotive.fr/about"
      />
      {isLoading ? (
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Chargement...</span>
          </div>
        </div>
      ) : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />
          <main className="min-h-screen bg-white animate-fadeIn">
        {/* Hero Section */}
        <Hero
          title={getContentValue('hero_main_title', 'title')}
          subtitle={getContentValue('hero_title', 'title')}
          description={getContentValue('hero_subtitle', 'subtitle')}
          backgroundImage="/upload/51603c32-87b6-4e5d-ab03-7352caca679d.png"
          height="min-h-[400px] md:min-h-[500px]"
        />

        {/* Section Pourquoi choisir DK Automotive */}
        <section className="section-spacing px-4 bg-gray-50/50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                {getImageUrl('why_choose_image') && (
                  <img 
                    alt="DK Automotive expertise" 
                    className="img-standard shadow-xl" 
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
                <div className="pt-6">
                  <Link to="/devis">
                    <Button className="btn-premium bg-dk-navy text-white hover:bg-dk-blue hover:shadow-xl px-10 py-7 text-lg group">
                      Demander mon devis sur mesure
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Chauffeurs Expérimentés */}
        <section className="section-spacing px-4 bg-white">
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
                    alt="Chauffeurs professionnels DK Automotive" 
                    className="img-standard shadow-xl" 
                    src={getImageUrl('drivers_image')} 
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Valeurs */}
        <section className="py-16 md:py-24 px-4 bg-dk-navy text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4">
                {getContentValue('values_section_title', 'title')}
              </h2>
              <div className="w-24 h-1 bg-white/20 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <article className="text-center space-y-4 group">
                <div className="flex justify-center transition-transform duration-500 group-hover:scale-110">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-dk-navy transition-all duration-300">
                    <Leaf className="w-10 h-10 text-white group-hover:text-dk-navy transition-colors" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {getContentValue('value_ecoconduite_title', 'title') || 'Écoconduite'}
                </h3>
                <p className="text-base text-white/70 leading-relaxed">
                  {getContentValue('value_ecoconduite_content')}
                </p>
              </article>

              <article className="text-center space-y-4 group">
                <div className="flex justify-center transition-transform duration-500 group-hover:scale-110">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-dk-navy transition-all duration-300">
                    <ShieldCheck className="w-10 h-10 text-white group-hover:text-dk-navy transition-colors" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {getContentValue('value_expertise_title', 'title') || 'Expertise Technique'}
                </h3>
                <p className="text-base text-white/70 leading-relaxed">
                  {getContentValue('value_expertise_content')}
                </p>
              </article>

              <article className="text-center space-y-4 group">
                <div className="flex justify-center transition-transform duration-500 group-hover:scale-110">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white/10 rounded-2xl group-hover:bg-white group-hover:text-dk-navy transition-all duration-300">
                    <Settings2 className="w-10 h-10 text-white group-hover:text-dk-navy transition-colors" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {getContentValue('value_service_title', 'title') || 'Service sur-mesure'}
                </h3>
                <p className="text-base text-white/70 leading-relaxed">
                  {getContentValue('value_service_content')}
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Section Expertise en Convoyage */}
        <section className="section-spacing px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                {getImageUrl('expertise_image') && (
                  <img 
                    alt="Expertise en convoyage automobile" 
                    className="img-standard shadow-xl" 
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
                  <Link to="/devis">
                    <Button className="btn-premium bg-dk-navy text-white hover:bg-dk-blue hover:shadow-xl px-10 py-7 text-lg group">
                      Réserver mon transport en toute confiance
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Finale */}
        <section className="section-spacing px-4 bg-gray-50/50">
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
            <Link to="/devis">
              <Button className="btn-premium bg-dk-navy text-white hover:bg-dk-blue hover:shadow-xl px-10 py-7 text-lg group">
                Demandez votre devis gratuitement
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
    )}
    </>
  );
};

export default About;
