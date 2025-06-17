
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, Shield, Star, ArrowRight, Phone, MapPin, Mail } from 'lucide-react';
import { usePageContents } from '@/hooks/usePageContents';

const Index = () => {
  const { contents, isLoading } = usePageContents('index');
  const missionRef = useRef<HTMLElement>(null);

  // Helper function to get content by block key
  const getContent = (blockKey: string) => {
    const content = contents.find(c => c.block_key === blockKey);
    if (!content) return null;
    
    if (content.content_json) {
      return content.content_json;
    }
    return { value: content.content_value };
  };

  // Helper function to get image URL
  const getImageUrl = (blockKey: string, fallbackUrl: string = '/placeholder.svg') => {
    const content = getContent(blockKey);
    return content?.url || fallbackUrl;
  };

  const scrollToMission = () => {
    missionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Move useEffect before the conditional return to maintain hook order
  useEffect(() => {
    if (missionRef.current) {
      missionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [missionRef]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dk-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dk-navy via-dk-blue to-dk-navy text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              {getContent('hero_title')?.title || 'Transport Automobile Professionnel'}
            </h1>
            <p className="text-xl md:text-2xl text-dk-cream mb-8 animate-fade-in-delay">
              {getContent('hero_subtitle')?.subtitle || 'Solutions de transport sur mesure pour particuliers et professionnels'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Button 
                size="lg" 
                className="bg-dk-gold hover:bg-dk-gold/90 text-dk-navy font-semibold px-8 py-4 text-lg"
                onClick={scrollToMission}
              >
                {getContent('hero_cta')?.text || 'Demander un devis'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-dk-navy px-8 py-4 text-lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dk-navy mb-4">
              {getContent('trust_section_title')?.title || 'Faites confiance à DK Automotive'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getContent('trust_section_subtitle')?.subtitle || 'Votre partenaire de confiance pour tous vos besoins de transport automobile'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((num) => (
              <div key={num} className="text-center p-6">
                <div className="bg-dk-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-dk-gold" />
                </div>
                <p className="text-lg font-medium text-gray-800">
                  {getContent(`trust_point_${num}`)?.text || `Point de confiance ${num}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Expertise Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <img 
                    src={getImageUrl('section_expertise_image', '/lovable-uploads/68f33641-ed3b-4ff0-b6f3-288ab97beda1.jpg')} 
                    alt="Expertise DK Automotive" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-dk-navy mb-4">
                  {getContent('section_expertise_title')?.title || 'Notre Expertise'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {getContent('section_expertise_content')?.content || 'Des années d\'expérience au service de votre mobilité'}
                </p>
                <ul className="space-y-3 text-gray-600">
                  {[1, 2, 3].map((num) => (
                    <li key={num} className="flex items-start">
                      <Check className="h-5 w-5 text-dk-gold mr-3 mt-0.5 flex-shrink-0" />
                      <span>{getContent(`section_expertise_point_${num}`)?.text || `Point expertise ${num}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Délais Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <img 
                    src={getImageUrl('section_delais_image', '/lovable-uploads/2b49a059-d379-4b8f-847a-628ff2c1a7bc.jpg')} 
                    alt="Respect des délais" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-dk-navy mb-4">
                  {getContent('section_delais_title')?.title || 'Respect des Délais'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {getContent('section_delais_content')?.content || 'Ponctualité et fiabilité garanties'}
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-4 text-dk-navy">
                  <Clock className="h-8 w-8" />
                  <div>
                    <div className="text-2xl font-bold">24h/7j</div>
                    <div className="text-sm text-gray-600">Service disponible</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarification Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <img 
                    src={getImageUrl('section_tarification_image', '/lovable-uploads/95eb9367-8ef9-4af5-b92d-805ea0cdeca3.jpg')} 
                    alt="Tarification transparente" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-dk-navy mb-4">
                  {getContent('section_tarification_title')?.title || 'Tarification Transparente'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {getContent('section_tarification_content')?.content || 'Des prix clairs et compétitifs'}
                </p>
                <Button 
                  className="bg-dk-navy hover:bg-dk-blue text-white w-full lg:w-auto"
                  onClick={scrollToMission}
                >
                  {getContent('section_tarification_cta')?.text || 'Obtenir un devis'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Section */}
      <section className="py-20 bg-gradient-to-br from-dk-navy to-dk-blue text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {getContent('engagement_title')?.title || 'Votre confiance, notre engagement'}
            </h2>
            <p className="text-xl text-dk-cream max-w-3xl mx-auto">
              {getContent('engagement_subtitle')?.subtitle || 'Nous nous engageons à vous offrir un service de qualité supérieure'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: getContent('engagement_card_1_title')?.title || 'Fiabilité', desc: getContent('engagement_card_1_content')?.content || 'Service fiable et sécurisé' },
              { icon: Star, title: getContent('engagement_card_2_title')?.title || 'Expertise', desc: getContent('engagement_card_2_content')?.content || 'Équipe expérimentée' },
              { icon: Check, title: getContent('engagement_card_3_title')?.title || 'Satisfaction', desc: getContent('engagement_card_3_content')?.content || 'Clients satisfaits' }
            ].map((item, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-center p-8">
                <CardContent className="p-0">
                  <item.icon className="h-12 w-12 text-dk-gold mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-dk-cream">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dk-navy mb-4">
              {getContent('how_it_works_title')?.title || 'Comment ça marche ?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getContent('how_it_works_subtitle')?.subtitle || 'Un processus simple et efficace'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="bg-dk-navy text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-dk-navy mb-4">
                  {getContent(`step_${step}_title`)?.title || `Étape ${step}`}
                </h3>
                <p className="text-gray-600">
                  {getContent(`step_${step}_description`)?.description || `Description de l'étape ${step}`}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-dk-navy mb-4">
              {getContent('how_it_works_cta_title')?.title || 'Prêt à commencer ?'}
            </h3>
            <Button 
              size="lg" 
              className="bg-dk-gold hover:bg-dk-blue text-white px-8 py-4"
              onClick={scrollToMission}
            >
              {getContent('how_it_works_cta_button')?.text || 'Demander votre devis'}
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-dk-navy mb-4">Demandez votre devis</h2>
              <p className="text-xl text-gray-600">Obtenez une estimation personnalisée en quelques clics</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-dk-navy text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-dk-navy mb-2">Adresses</h3>
                  <p className="text-sm text-gray-600">Renseignez vos adresses de départ et d'arrivée</p>
                </div>
                <div className="text-center">
                  <div className="bg-dk-navy text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-dk-navy mb-2">Véhicule</h3>
                  <p className="text-sm text-gray-600">Décrivez votre véhicule et vos besoins</p>
                </div>
                <div className="text-center">
                  <div className="bg-dk-navy text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-dk-navy mb-2">Devis</h3>
                  <p className="text-sm text-gray-600">Recevez votre devis personnalisé</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-dk-navy hover:bg-dk-blue text-white px-8 py-4"
                  onClick={() => window.location.href = '/devis'}
                >
                  Commencer mon devis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
