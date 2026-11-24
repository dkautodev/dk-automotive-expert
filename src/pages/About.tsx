import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Leaf, ShieldCheck, Settings2 } from 'lucide-react';
import SEO from '@/components/SEO';
import Hero from '@/components/common/Hero';
import { getAboutValue as getContentValue, getAboutImage as getImageUrl } from '@/data/siteContent';

const About = () => {

  // Schema.org structured data for AboutPage
  const schemaData = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://www.dkautomotive.fr/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "À propos",
          "item": "https://www.dkautomotive.fr/about"
        }
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="À Propos — Société de Convoyage de Véhicules par Route | DK Automotive"
        description="Découvrez DK Automotive, société experte en convoyage automobile par route depuis 2018. Plus de 2 000 missions de transfert sécurisé pour particuliers et professionnels."
        canonical="https://www.dkautomotive.fr/about"
      />
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
          backgroundImage="/upload/hero_background-1790463219069.webp"
          height="min-h-[480px] md:min-h-[560px]"
        />

        {/* Section Présentation & Histoire DK Automotive (Richesse SEO) */}
        <section className="section-spacing px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center mb-10">
                <span className="text-dk-navy uppercase tracking-[0.2em] text-xs font-bold mb-4 border-b-2 border-dk-navy/20 pb-2 inline-block">
                  Notre Histoire & Notre Mission
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy mt-4">
                  Une expertise terrain au service du convoyage automobile
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
                {getContentValue('hero_description').split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Pourquoi choisir DK Automotive */}
        <section className="section-spacing px-4 bg-gray-50/50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="img-frame order-2 md:order-1">
                <div className="img-frame-accent" />
                {getImageUrl('why_choose_image', '/upload/section_tarification_image-1776964200267.webp') && (
                  <img 
                    alt="DK Automotive expertise" 
                    width={1760}
                    height={1308}
                    className="img-standard" 
                    loading="lazy"
                    decoding="async"
                    src={getImageUrl('why_choose_image', '/upload/section_tarification_image-1776964200267.webp')} 
                  />
                )}
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                  {getContentValue('why_choose_title', 'title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {getContentValue('why_choose_description')}
                </p>
                <div className="space-y-3 pt-2">
                  <div className="check-bullet-item">
                    <span className="check-bullet-icon">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{getContentValue('why_choose_benefit_1')}</span>
                  </div>
                  <div className="check-bullet-item">
                    <span className="check-bullet-icon">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{getContentValue('why_choose_benefit_2')}</span>
                  </div>
                  <div className="check-bullet-item">
                    <span className="check-bullet-icon">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{getContentValue('why_choose_benefit_3')}</span>
                  </div>
                  <div className="check-bullet-item">
                    <span className="check-bullet-icon">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{getContentValue('why_choose_benefit_4')}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue group">
                    <Link to="/devis">
                      Demander mon devis sur mesure
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Chauffeurs Expérimentés */}
        <section className="section-spacing px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6 order-1">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-dk-navy mb-2">
                    {getContentValue('drivers_title', 'title')}
                  </h2>
                  <h3 className="text-xl md:text-2xl font-bold text-dk-navy/90">
                    {getContentValue('drivers_subtitle', 'title')}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {getContentValue('drivers_description_1')}
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {getContentValue('drivers_description_2')}
                </p>
                <div className="pt-2">
                  <Button asChild className="btn-secondary group">
                    <Link to="/contact">
                      Contactez-nous
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="img-frame order-2">
                <div className="img-frame-accent" />
                {getImageUrl('drivers_image', '/upload/value_ecoconduite_image-1776981907439.webp') && (
                  <img 
                    alt="Chauffeurs professionnels DK Automotive" 
                    width={5564}
                    height={3710}
                    className="img-standard" 
                    loading="lazy"
                    decoding="async"
                    src={getImageUrl('drivers_image', '/upload/value_ecoconduite_image-1776981907439.webp')} 
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
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="img-frame order-2 md:order-1">
                <div className="img-frame-accent" />
                {getImageUrl('expertise_image', '/upload/expertise_image-1790425483584.webp') && (
                  <img 
                    alt="Expertise en convoyage automobile" 
                    width={1448}
                    height={1086}
                    className="img-standard" 
                    loading="lazy"
                    decoding="async"
                    src={getImageUrl('expertise_image', '/upload/expertise_image-1790425483584.webp')} 
                  />
                )}
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-dk-navy mb-2">
                    {getContentValue('expertise_title', 'title')}
                  </h2>
                  <h3 className="text-xl md:text-2xl font-bold text-dk-navy/90">
                    {getContentValue('expertise_subtitle', 'title')}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {getContentValue('expertise_description')}
                </p>
                <div className="pt-2">
                  <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue group">
                    <Link to="/devis">
                      Réserver mon transport en toute confiance
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
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
            <p className="text-muted-foreground mb-8 text-base">
              {getContentValue('final_description')}
            </p>
            <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue group">
              <Link to="/devis">
                Demandez votre devis gratuitement
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
