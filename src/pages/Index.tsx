import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Check, ClipboardList, PhoneCall, Truck } from 'lucide-react';
import { usePageContents } from '@/hooks/usePageContents';
import SEO from '@/components/SEO';
import Hero from '@/components/common/Hero';
const Index = () => {
  const {
    contents,
    isLoading
  } = usePageContents('index');

  // Helper function pour récupérer le contenu d'un bloc
  const getContent = (blockKey: string) => {
    const content = contents.find(c => c.block_key === blockKey);
    if (!content) return null;
    if (content.content_json) {
      return content.content_json;
    }
    return {
      value: content.content_value
    };
  };

  // Helper function pour récupérer une image
  const getImageUrl = (blockKey: string, fallback: string) => {
    const content = getContent(blockKey);
    return content?.url || fallback;
  };

  // Helper function pour récupérer du texte
  const getText = (blockKey: string, fallback: string) => {
    const content = getContent(blockKey);
    return content?.title || content?.subtitle || content?.description || content?.content || content?.text || content?.value || fallback;
  };

  // Schema.org JSON-LD pour le référencement local
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "DK Automotive",
    "description": "Expert en convoyage de véhicules par route en France depuis 2018. Transport sécurisé, tarifs transparents, prise en charge sous 48h.",
    "url": "https://www.dkautomotive.fr",
    "logo": "https://www.dkautomotive.fr/upload/64b69a10-c303-48f4-9b56-7bee8e58a109.png",
    "image": "https://app-private.dkautomotive.fr/upload/4922f807-dfd8-4cf6-b440-ee35efade638.png",
    "telephone": "+33",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "serviceType": ["Convoyage automobile", "Transport de véhicules", "Livraison de voitures"],
    "priceRange": "€€",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2000"
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Accueil" 
        description="Expert en convoyage de véhicules par route en France depuis 2018. Transport sécurisé, tarifs transparents, prise en charge sous 48h. Plus de 2000 missions réalisées par des chauffeurs professionnels." 
        canonical="https://www.dkautomotive.fr/" 
      />

      {isLoading ? (
        <>
          {/* Hero Skeleton */}
          <section className="relative min-h-[500px] md:min-h-[700px] bg-muted">
            <div className="container mx-auto px-4 py-20">
              <div className="max-w-2xl space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </section>
          {/* Trust Section Skeleton */}
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Schema.org JSON-LD */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData)
          }} />

          <main className="animate-fadeIn">
      {/* Hero Section */}
      <Hero
        title={getText('hero_title', 'Convoyage de véhicules par route en France')}
        description={getText('hero_description', 'Confiez-nous le convoyage de vos véhicules, pour un service sur mesure, écologique et économique.')}
        backgroundImage={getImageUrl('hero_background', '/upload/51603c32-87b6-4e5d-ab03-7352caca679d.png')}
        height="min-h-[550px] md:min-h-[750px]"
      >
        <div className="space-y-4 mb-10">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-3 text-white/90">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-base md:text-lg font-light tracking-wide">
                {getText(`trust_point_${num}`, '')}
              </span>
            </div>
          ))}
        </div>

        <Link to="/devis">
          <Button className="btn-premium bg-dk-navy text-white hover:bg-dk-blue hover:shadow-xl px-10 py-7 text-lg group">
            Demander mon devis sur mesure
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </Hero>

      <section className="section-spacing bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-dk-navy uppercase tracking-[0.2em] text-xs font-bold mb-4 border-b-2 border-dk-navy/20 pb-2">
              Expertise & Confiance
            </span>
            <h2 className="max-w-3xl mx-auto">
              {getText('trust_section_title', 'Faites confiance à DK Automotive')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mt-4">
              {getText('trust_section_subtitle', "L'expert du convoyage automobile sur route")}
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-dk-navy/5 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500" />
              <img
                alt="Voiture sur route - DK Automotive convoyage professionnel"
                className="img-standard shadow-xl relative z-10"
                loading="lazy"
                src={getImageUrl('section_expertise_image', '/upload/2849f1ca-ef57-425c-8271-11ee1da479e6.jpg')}
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                {getText('section_expertise_title', 'Expertise et dévouement des chauffeurs')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {getText('section_expertise_content', "Chez DK AUTOMOTIVE, nos chauffeurs professionnels ont été sélectionnés pour leur expérience et leur engagement exceptionnels. Formés à des procédures strictes et à l'écoconduite, ils garantissent un convoyage sûr et écologique de votre véhicule.")}
              </p>
              <div className="pt-4">
                <Link to="/contact" className="inline-flex items-center text-dk-navy font-semibold hover:gap-2 transition-all">
                  Contactez-nous <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                {getText('section_delais_title', 'Délais de livraison rapides')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {getText('section_delais_content', 'DK AUTOMOTIVE se distingue par la réduction significative des délais de livraison. Avec une garantie de prise en charge rapide sous 48h, nous offrons un service rapide et fiable en France.')}
              </p>
              <ul className="space-y-4 pt-4">
                {[1, 2, 3].map((num) => (
                  <li key={num} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-dk-navy flex-shrink-0" aria-hidden="true" />
                    <span>{getText(`section_delais_point_${num}`, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <img
                alt="Livraison rapide de véhicules"
                className="img-standard shadow-lg"
                loading="lazy"
                src={getImageUrl('section_delais_image', '/upload/38340b13-78ba-4ae6-ba15-9851924dcf27.jpg')}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-dk-navy/5 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500" />
              <img
                alt="Remise de clés de véhicule"
                className="img-standard shadow-xl relative z-10"
                loading="lazy"
                src={getImageUrl('section_tarification_image', '/upload/e26f2a44-10f8-4ea8-bf96-6fe52fe1cf18.jpg')}
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                {getText('section_tarification_title', 'Tarification transparente et personnalisée')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {getText('section_tarification_content', "Nous offrons des tarifs transparents et adaptés, incluant tous les frais, pour répondre aux besoins uniques de chaque client, avec un engagement pour un service éco-responsable.")}
              </p>
              <ul className="space-y-4 pt-4">
                {[1, 2, 3].map((num) => (
                  <li key={num} className="flex items-center gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-dk-navy flex-shrink-0" aria-hidden="true" />
                    <span>{getText(`section_tarification_point_${num}`, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-20 text-center mx-auto max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-dk-navy/5">
            <p className="text-muted-foreground mb-8 text-lg">
              {getText('section_tarification_cta_text', 'Prêt à découvrir la différence avec nos services de convoyage professionnels ?')}
            </p>
            <Link to="/devis">
              <Button className="btn-premium bg-dk-navy text-white hover:bg-dk-blue hover:shadow-xl px-10 py-7 text-lg group">
                Obtenez votre devis gratuitement !
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-dk-navy text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-white mb-6">
              {getText('engagement_title', 'Votre confiance, notre engagement')}
            </h2>
            <p className="text-white/70 text-lg">
              {getText('engagement_subtitle', 'Chez DK AUTOMOTIVE, chaque parcours est une promesse de qualité et de fiabilité.')}
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <article className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-colors group-hover:bg-white group-hover:text-dk-navy">
                  <Check className="w-8 h-8 text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {getText('engagement_card_1_title', 'Fiabilité')}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {getText('engagement_card_1_content', 'Des services de convoyage sur lesquels vous pouvez compter à chaque instant.')}
                </p>
              </article>

              <article className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-colors group-hover:bg-white group-hover:text-dk-navy">
                  <Check className="w-8 h-8 text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {getText('engagement_card_2_title', 'Expertise')}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {getText('engagement_card_2_content', 'Une équipe de professionnels expérimentés à votre service.')}
                </p>
              </article>

              <article className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-colors group-hover:bg-white group-hover:text-dk-navy">
                  <Check className="w-8 h-8 text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {getText('engagement_card_3_title', 'Satisfaction')}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {getText('engagement_card_3_content', 'Votre satisfaction est notre priorité absolue.')}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block text-dk-navy uppercase tracking-[0.2em] text-xs font-bold mb-8 border-b-2 border-dk-navy/20 pb-2">
              Processus Simple
            </span>
            <h2 className="mb-4">
              {getText('how_it_works_title', 'Comment ça marche')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-medium mb-12">
              {getText('how_it_works_subtitle', 'Votre convoyage en 3 étapes')}
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <article className="text-center">
                <div className="w-24 h-24 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-12 h-12 text-white" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-dk-navy mb-4">
                  {getText('step_1_title', '1. JE REMPLIS LE FORMULAIRE DE DEVIS')}
                </h4>
                <p className="text-muted-foreground">
                  {getText('step_1_description', 'Je remplis le formulaire de devis en vérifiant correctement mes informations.')}
                </p>
              </article>

              <article className="text-center">
                <div className="w-24 h-24 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PhoneCall className="w-12 h-12 text-white" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-dk-navy mb-4">
                  {getText('step_2_title', '2. APPEL AVEC UN CONSEILLER')}
                </h4>
                <p className="text-muted-foreground">
                  {getText('step_2_description', 'Un conseiller vous rappelle pour planifier votre convoyage.')}
                </p>
              </article>

              <article className="text-center">
                <div className="w-24 h-24 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-12 h-12 text-white" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-dk-navy mb-4">
                  {getText('step_3_title', '3. CONVOYAGE DE VOTRE VÉHICULE')}
                </h4>
                <p className="text-muted-foreground">
                  {getText('step_3_description', "J'accepte mon devis et votre projet est réalisé à la date et heure convenue.")}
                </p>
              </article>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">
                {getText('how_it_works_cta_title', 'Commencez dès maintenant !')}
              </h3>
              <Link to="/devis">
                <Button className="btn-premium bg-dk-navy text-white hover:bg-dk-blue hover:shadow-xl px-10 py-7 text-lg group">
                  {getText('how_it_works_cta_button', 'Demandez votre devis gratuitement')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
        </main>
      </>
      )}
    </div>
  );
};

export default Index;