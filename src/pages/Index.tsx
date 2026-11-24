import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, ClipboardList, PhoneCall, Truck } from 'lucide-react';
import SEO from '@/components/SEO';
import Hero from '@/components/common/Hero';
import { getIndexText as getText, getIndexImage as getImageUrl } from '@/data/siteContent';

const Index = () => {
  // Schema.org JSON-LD officiel conforme Google pour le référencement local et le Nom du Site (Site Name)
  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "DK AUTOMOTIVE",
      "alternateName": ["DK Automotive", "DK Automotive Convoyage", "DKAutomotive"],
      "url": "https://www.dkautomotive.fr/"
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "DK Automotive",
      "description": "Société de convoyage de véhicules par route en France et Île-de-France depuis 2018. Acheminement sécurisé porte-à-porte, tarifs transparents, prise en charge sous 48h.",
      "url": "https://www.dkautomotive.fr/",
      "logo": "https://www.dkautomotive.fr/upload/dk-automotive-logo.webp",
      "image": "https://www.dkautomotive.fr/upload/convoyage-automobile-france.webp",
      "telephone": "+33615606285",
      "email": "contact@dkautomotive.fr",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "19 RUE DE BRESSE",
        "addressLocality": "BOBIGNY",
        "postalCode": "93000",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.9086,
        "longitude": 2.4397
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "France"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Île-de-France"
        }
      ],
      "serviceType": [
        "Convoyage automobile",
        "Transport de véhicules par la route",
        "Acheminement de flotte automobile",
        "Livraison de voitures neuves et d'occasion"
      ],
      "priceRange": "€€",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "19:00"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Convoyage Automobile France & Île-de-France | DK Automotive"
        description="Société de convoyage de véhicules par route en France et Île-de-France depuis 2018. Acheminement sécurisé porte-à-porte, tarifs transparents, prise en charge sous 48h."
        canonical="https://www.dkautomotive.fr/"
        schema={schemaData}
      />

      <main className="animate-fadeIn">
        {/* Hero Section */}
        <Hero
          title={getText('hero_title', 'Convoyage de véhicules par route en France')}
          description={getText('hero_description', 'Confiez-nous le convoyage de vos véhicules, pour un service sur mesure, écologique et économique.')}
          backgroundImage={getImageUrl('hero_background', '/upload/convoyage-automobile-france.webp')}
          height="min-h-[550px] md:min-h-[750px]"
        >
          <div className="space-y-4 mb-10">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-base md:text-lg font-light tracking-wide">
                  {getText(`trust_point_${num}`, '')}
                </span>
              </div>
            ))}
          </div>

          <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue group">
            <Link to="/devis">
              Demander mon devis sur mesure
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </Hero>

        <section className="section-spacing bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <span className="text-dk-navy uppercase tracking-[0.2em] text-xs font-bold mb-4 border-b-2 border-dk-navy/20 pb-2">
                Expertise & Confiance
              </span>
              <h2 className="max-w-3xl mx-auto">
                {getText('trust_section_title', 'Faites confiance à DK Automotive')}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto mt-2">
                {getText('trust_section_subtitle', "L'expert du convoyage automobile sur route")}
              </p>
            </div>
          </div>
        </section>

        {/* Section 1: Expertise (Image gauche sur desktop, Image bas sur mobile) */}
        <section className="section-spacing bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="img-frame order-2 md:order-1">
                <div className="img-frame-accent" />
                <img
                  alt="Voiture sur route - DK Automotive convoyage professionnel"
                  width={1280}
                  height={720}
                  className="img-standard"
                  loading="lazy"
                  decoding="async"
                  src={getImageUrl('section_expertise_image', '/upload/convoyage-expertise-route.webp')}
                />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                  {getText('section_expertise_title', 'Expertise et dévouement des chauffeurs')}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {getText('section_expertise_content', "Chez DK AUTOMOTIVE, nos chauffeurs professionnels ont été sélectionnés pour leur expérience et leur engagement exceptionnels. Formés à des procédures strictes et à l'écoconduite, ils garantissent un convoyage sûr et écologique de votre véhicule.")}
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
            </div>
          </div>
        </section>

        {/* Section 2: Délais (Image droite sur desktop, Image bas sur mobile) */}
        <section className="section-spacing bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6 order-1">
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                  {getText('section_delais_title', 'Délais de livraison rapides')}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {getText('section_delais_content', 'DK AUTOMOTIVE se distingue par la réduction significative des délais de livraison. Avec une garantie de prise en charge rapide sous 48h, nous offrons un service rapide et fiable en France.')}
                </p>
                <ul className="space-y-3 pt-2">
                  {[1, 2, 3].map((num) => (
                    <li key={num} className="check-bullet-item">
                      <span className="check-bullet-icon">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <span>{getText(`section_delais_point_${num}`, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="img-frame order-2">
                <div className="img-frame-accent" />
                <img
                  alt="Livraison rapide et sécurisée de véhicule par chauffeur convoyeur professionnel"
                  width={1280}
                  height={720}
                  className="img-standard"
                  loading="lazy"
                  decoding="async"
                  src={getImageUrl('section_delais_image', '/upload/convoyage-delais-rapide.webp')}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Tarification (Image gauche sur desktop, Image bas sur mobile) */}
        <section className="section-spacing bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="img-frame order-2 md:order-1">
                <div className="img-frame-accent" />
                <img
                  alt="Remise des clés et protocole d'état des lieux contradictoire - DK Automotive"
                  width={1280}
                  height={720}
                  className="img-standard"
                  loading="lazy"
                  decoding="async"
                  src={getImageUrl('section_tarification_image', '/upload/convoyage-tarification-transparente.webp')}
                />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-2xl md:text-3xl font-bold text-dk-navy">
                  {getText('section_tarification_title', 'Tarification transparente et personnalisée')}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {getText('section_tarification_content', "Nous offrons des tarifs transparents et adaptés, incluant tous les frais, pour répondre aux besoins uniques de chaque client, avec un engagement pour un service éco-responsable.")}
                </p>
                <ul className="space-y-3 pt-2">
                  {[1, 2, 3].map((num) => (
                    <li key={num} className="check-bullet-item">
                      <span className="check-bullet-icon">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <span>{getText(`section_tarification_point_${num}`, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-16 text-center mx-auto max-w-2xl bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-dk-navy/5">
              <p className="text-muted-foreground mb-6 text-lg">
                {getText('section_tarification_cta_text', 'Prêt à découvrir la différence avec nos services de convoyage professionnels ?')}
              </p>
              <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue group">
                <Link to="/devis">
                  Obtenez votre devis gratuitement !
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
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
                  <h3 className="text-lg font-bold text-dk-navy mb-4">
                    {getText('step_1_title', '1. JE REMPLIS LE FORMULAIRE DE DEVIS')}
                  </h3>
                  <p className="text-muted-foreground">
                    {getText('step_1_description', 'Je remplis le formulaire de devis en vérifiant correctement mes informations.')}
                  </p>
                </article>

                <article className="text-center">
                  <div className="w-24 h-24 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PhoneCall className="w-12 h-12 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-dk-navy mb-4">
                    {getText('step_2_title', '2. APPEL AVEC UN CONSEILLER')}
                  </h3>
                  <p className="text-muted-foreground">
                    {getText('step_2_description', 'Un conseiller vous rappelle pour planifier votre convoyage.')}
                  </p>
                </article>

                <article className="text-center">
                  <div className="w-24 h-24 bg-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-12 h-12 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-dk-navy mb-4">
                    {getText('step_3_title', '3. CONVOYAGE DE VOTRE VÉHICULE')}
                  </h3>
                  <p className="text-muted-foreground">
                    {getText('step_3_description', "J'accepte mon devis et votre projet est réalisé à la date et heure convenue.")}
                  </p>
                </article>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">
                  {getText('how_it_works_cta_title', 'Commencez dès maintenant !')}
                </h3>
                <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue group">
                  <Link to="/devis">
                    {getText('how_it_works_cta_button', 'Demandez votre devis gratuitement')}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;