
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ClipboardList, PhoneCall, Truck } from 'lucide-react';
import { usePageContents } from '@/hooks/usePageContents';

const Index = () => {
  const { contents, isLoading } = usePageContents('index');

  // Helper function pour récupérer le contenu d'un bloc
  const getContent = (blockKey: string) => {
    const content = contents.find(c => c.block_key === blockKey);
    if (!content) return null;
    if (content.content_json) {
      return content.content_json;
    }
    return { value: content.content_value };
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="animate-fadeIn">
        <section 
          className="relative h-[400px] md:h-[600px] bg-cover bg-center" 
          style={{
            backgroundImage: `url("${getImageUrl('hero_background_image', '/lovable-uploads/51603c32-87b6-4e5d-ab03-7352caca679d.png')}")`
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-white leading-tight tracking-tight uppercase">
                {getText('hero_main_title', 'Convoyage de véhicules par route en France')}
              </h1>
              
              <div className="space-y-3 mb-6 md:mb-8">
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="text-lg font-light">{getText('hero_point_1', 'Convoyage sur mesure et économique')}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="text-lg font-light">{getText('hero_point_2', 'Engagement Éco-responsable')}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  <span className="text-lg font-light">{getText('hero_point_3', 'Livraison rapide et sécurisée')}</span>
                </div>
              </div>

              <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 font-light leading-relaxed">
                {getText('hero_description', 'Confiez-nous le convoyage de vos véhicules, pour un service sur mesure, écologique et économique.')}
              </p>
              
              <Link to="/devis">
                <Button className="text-dk-navy transition-colors px-6 py-5 text-base bg-[#18257d] text-white">
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
                  {getText('trust_section_title', 'FAITES CONFIANCE À DK AUTOMOTIVE')}
                </h3>
                <h4 className="text-xl md:text-3xl font-bold text-[#18257D] mb-4">
                  {getText('trust_section_subtitle', 'L\'EXPERT DU CONVOYAGE SUR ROUTE')}
                </h4>
                <p className="text-sm md:text-base text-gray-600">
                  {getText('trust_section_description', 'Pourquoi choisir DK AUTOMOTIVE pour vos besoins en convoyage de véhicules :')}
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
                <img alt="Voiture sur route" className="rounded-lg w-full" src={getImageUrl('section_expertise_image', '/lovable-uploads/2849f1ca-ef57-425c-8271-11ee1da479e6.jpg')} />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#18257D]">
                  {getText('section_expertise_title', 'EXPERTISE ET DÉVOUEMENT DES CHAUFFEURS')}
                </h2>
                <p className="text-gray-600">
                  {getText('section_expertise_content', 'Chez DK AUTOMOTIVE, nos chauffeurs professionnels ont été sélectionnés pour leur expérience et leur engagement exceptionnels. Formés à des procédures strictes et à l\'écoconduite, ils garantissent un convoyage sûr et écologique de votre véhicule.')}
                </p>
                <p className="text-gray-600">
                  {getText('section_expertise_subtitle', 'Prêt à découvrir la différence avec nos services de convoyage professionnels ?')} <Link to="/contact" className="text-[#18257D] hover:underline">Contactez-nous</Link> sans plus tarder !
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
                  {getText('section_delais_title', 'DÉLAIS DE LIVRAISON RAPIDES')}
                </h2>
                <p className="text-gray-600">
                  {getText('section_delais_content', 'DK AUTOMOTIVE se distingue par la réduction significative des délais de livraison. Avec une garantie de prise en charge rapide sous 48h, nous offrons un service rapide et fiable partout en France.')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    {getText('section_delais_point_1', 'Réduction significative des délais')}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    {getText('section_delais_point_2', 'Prise en charge rapide sous 48h maximum')}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    {getText('section_delais_point_3', 'Service fiable et étendu')}
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <img alt="Voiture dans un garage" className="rounded-lg w-full" src={getImageUrl('section_delais_image', '/lovable-uploads/38340b13-78ba-4ae6-ba15-9851924dcf27.jpg')} />
              </div>
            </div>
          </div>
        </section>

        {/* Tarification Section */}
        <section className="relative py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img alt="Remise de clés" className="rounded-lg w-full" src={getImageUrl('section_tarification_image', '/lovable-uploads/e26f2a44-10f8-4ea8-bf96-6fe52fe1cf18.jpg')} />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#18257D]">
                  {getText('section_tarification_title', 'TARIFICATION TRANSPARENTE ET PERSONNALISÉE')}
                </h2>
                <p className="text-gray-600">
                  {getText('section_tarification_content', 'Nous offrons des tarifs transparents et adaptés, incluant tous les frais, pour répondre aux besoins uniques de chaque client, avec un engagement pour un service éco-responsable.')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    {getText('section_tarification_point_1', 'Tarifs transparents et adaptés')}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    {getText('section_tarification_point_2', 'Service inclusif sans frais cachés')}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-[#18257D]"></span>
                    {getText('section_tarification_point_3', 'Engagement éco-responsable')}
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 text-center mx-auto" style={{
            maxWidth: "calc(100% - 2rem)"
          }}>
              <p className="text-gray-600 mb-8 text-xl">
                {getText('section_tarification_cta_text', 'Prêt à découvrir la différence avec nos services de convoyage professionnels ? Contactez-nous ou faites une demande de devis personnalisée adaptée à vos besoins de transport.')}
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
                {getText('engagement_title', 'VOTRE CONFIANCE, NOTRE ENGAGEMENT')}
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mb-8">
                {getText('engagement_subtitle', 'Chez DK AUTOMOTIVE, chaque parcours est une promesse de qualité et de fiabilité.')}
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-[#18257D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#18257D] mb-3">
                    {getText('engagement_card_1_title', 'Fiabilité')}
                  </h3>
                  <p className="text-gray-600">
                    {getText('engagement_card_1_content', 'Des services de convoyage sur lesquels vous pouvez compter à chaque instant.')}
                  </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-[#18257D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#18257D] mb-3">
                    {getText('engagement_card_2_title', 'Expertise')}
                  </h3>
                  <p className="text-gray-600">
                    {getText('engagement_card_2_content', 'Une équipe de professionnels expérimentés à votre service.')}
                  </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <div className="w-16 h-16 bg-[#18257D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#18257D] mb-3">
                    {getText('engagement_card_3_title', 'Satisfaction')}
                  </h3>
                  <p className="text-gray-600">
                    {getText('engagement_card_3_content', 'Votre satisfaction est notre priorité absolue.')}
                  </p>
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
                {getText('how_it_works_title', 'COMMENT ÇA MARCHE')}
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-[#18257D] mb-12">
                {getText('how_it_works_subtitle', 'AVEC DK AUTOMOTIVE')}
              </h3>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#18257D] mb-4">
                    {getText('step_1_title', '1. JE REMPLIS LE FORMULAIRE DE DEVIS')}
                  </h4>
                  <p className="text-gray-600">
                    {getText('step_1_description', 'Je remplis le formulaire de devis en vérifiant correctement mes informations.')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <PhoneCall className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#18257D] mb-4">
                    {getText('step_2_title', '2. APPEL AVEC UN CONSEILLER')}
                  </h4>
                  <p className="text-gray-600">
                    {getText('step_2_description', 'Un conseiller vous rappelle pour planifier votre convoyage.')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-[#4A90E2] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-[#18257D] mb-4">
                    {getText('step_3_title', '3. CONVOYAGE DE VOTRE VÉHICULE')}
                  </h4>
                  <p className="text-gray-600">
                    {getText('step_3_description', 'J\'accepte mon devis et votre projet est réalisé à la date et heure convenue.')}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">
                  {getText('how_it_works_cta_title', 'Commencez dès maintenant !')}
                </h3>
                <Link to="/devis">
                  <Button className="bg-[#18257D] hover:bg-[#18257D]/90 text-white transition-colors px-8 py-6 text-lg">
                    {getText('how_it_works_cta_button', 'Demandez votre devis gratuitement')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
