import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2, Shield, Award, Users, Leaf, Wrench, Heart, Calculator, ArrowRight } from 'lucide-react';
import { useAboutPageContents } from '@/hooks/useAboutPageContents';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin mr-2 text-primary" />
          <span className="text-muted-foreground">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="À Propos - Qui sommes-nous ?"
        description="Découvrez DK Automotive, expert en convoyage automobile en France depuis 2018. Plus de 2000 missions réalisées avec professionnalisme et fiabilité."
        canonical="https://dkautomotive.fr/about"
      />

      <main className="animate-fadeIn">
        {/* Hero Section with Gradient */}
        <section className="relative bg-gradient-to-br from-dk-navy via-dk-navy to-dk-blue py-16 md:py-24 overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
            <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/20 rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Users className="w-4 h-4 text-dk-gold" />
                <span className="text-white/90 text-sm font-medium">Notre Histoire</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {getContentValue('hero_title', 'title') || 'Qui sommes-nous ?'}
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-dk-gold mb-6">
                {getContentValue('hero_main_title', 'title') || 'DK Automotive'}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                {getContentValue('hero_subtitle', 'subtitle') || 'Expert en convoyage automobile depuis 2018'}
              </p>
              <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
                {getContentValue('hero_description')}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-12 h-12 bg-dk-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-dk-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold">+2000 missions</p>
                  <p className="text-white/60 text-sm">réalisées avec succès</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-12 h-12 bg-dk-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-dk-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold">Depuis 2018</p>
                  <p className="text-white/60 text-sm">expertise reconnue</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-12 h-12 bg-dk-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-dk-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold">100% France</p>
                  <p className="text-white/60 text-sm">couverture nationale</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Pourquoi choisir DK Automotive */}
        <section className="py-16 md:py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                {getImageUrl('why_choose_image') && (
                  <div className="relative">
                    <img 
                      alt="DK Automotive expertise" 
                      className="rounded-2xl shadow-xl w-full object-cover" 
                      src={getImageUrl('why_choose_image')} 
                    />
                    <div className="absolute -bottom-4 -right-4 bg-dk-gold text-dk-navy px-6 py-3 rounded-xl font-bold shadow-lg hidden md:block">
                      +2000 missions
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">Nos Engagements</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {getContentValue('why_choose_title', 'title') || 'Pourquoi choisir DK Automotive ?'}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('why_choose_description')}
                </p>
                <div className="space-y-3">
                  {[
                    getContentValue('why_choose_benefit_1'),
                    getContentValue('why_choose_benefit_2'),
                    getContentValue('why_choose_benefit_3'),
                    getContentValue('why_choose_benefit_4'),
                  ].filter(Boolean).map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 bg-background p-3 rounded-lg border border-border/50">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="text-green-600 h-4 w-4" />
                      </div>
                      <p className="text-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/devis">
                      Demander un devis
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Chauffeurs Expérimentés */}
        <section className="py-16 md:py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">Notre Équipe</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {getContentValue('drivers_title', 'title') || 'Des chauffeurs expérimentés'}
                </h3>
                <h4 className="text-xl md:text-2xl font-semibold text-primary">
                  {getContentValue('drivers_subtitle', 'title')}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('drivers_description_1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('drivers_description_2')}
                </p>
                <div className="pt-4">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/contact">
                      Contactez-nous
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div>
                {getImageUrl('drivers_image') && (
                  <img 
                    alt="DK Automotive drivers" 
                    className="rounded-2xl shadow-xl w-full object-cover" 
                    src={getImageUrl('drivers_image')} 
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section Nos Valeurs */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-dk-navy via-dk-navy to-dk-blue text-white relative overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-40 h-40 border border-white/20 rounded-full" />
            <div className="absolute bottom-10 left-20 w-32 h-32 border border-white/20 rounded-full" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Heart className="w-4 h-4 text-dk-gold" />
                <span className="text-white/90 text-sm font-medium">Ce qui nous anime</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                {getContentValue('values_section_title', 'title') || 'Nos Valeurs'}
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/10 text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    {getImageUrl('value_ecoconduite_image') ? (
                      <img 
                        alt="Écoconduite" 
                        className="w-16 h-16" 
                        src={getImageUrl('value_ecoconduite_image')} 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-dk-gold/20 rounded-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-dk-gold" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {getContentValue('value_ecoconduite_title', 'title') || 'Écoconduite'}
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {getContentValue('value_ecoconduite_content')}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/10 text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    {getImageUrl('value_expertise_image') ? (
                      <img 
                        alt="Expertise technique" 
                        className="w-16 h-16" 
                        src={getImageUrl('value_expertise_image')} 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-dk-gold/20 rounded-full flex items-center justify-center">
                        <Wrench className="w-8 h-8 text-dk-gold" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {getContentValue('value_expertise_title', 'title') || 'Expertise Technique'}
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {getContentValue('value_expertise_content')}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/10 text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    {getImageUrl('value_service_image') ? (
                      <img 
                        alt="Service sur-mesure" 
                        className="w-16 h-16" 
                        src={getImageUrl('value_service_image')} 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-dk-gold/20 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-dk-gold" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    {getContentValue('value_service_title', 'title') || 'Service Sur-Mesure'}
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {getContentValue('value_service_content')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Expertise en Convoyage */}
        <section className="py-16 md:py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                {getImageUrl('expertise_image') && (
                  <img 
                    alt="Expertise en convoyage" 
                    className="rounded-2xl shadow-xl w-full object-cover" 
                    src={getImageUrl('expertise_image')} 
                  />
                )}
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">Notre Savoir-Faire</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {getContentValue('expertise_title', 'title') || 'Expertise en Convoyage'}
                </h3>
                <h4 className="text-xl md:text-2xl font-semibold text-primary">
                  {getContentValue('expertise_subtitle', 'title')}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {getContentValue('expertise_description')}
                </p>
                <div className="pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/devis">
                      Réservez votre transport
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA Finale */}
        <section className="py-16 md:py-20 px-4 bg-background">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-br from-dk-navy via-dk-navy to-dk-blue border-0 overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-dk-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-dk-blue/20 rounded-full blur-2xl" />

              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                    {getContentValue('final_title', 'title') || 'Prêt à nous confier votre véhicule ?'}
                  </h2>
                  <h3 className="text-xl md:text-3xl font-bold text-dk-gold mb-6">
                    {getContentValue('final_main_title', 'title') || 'Faites confiance à DK Automotive'}
                  </h3>
                  <p className="text-lg text-white/80 mb-4">
                    {getContentValue('final_subtitle', 'subtitle')}
                  </p>
                  <p className="text-white/70 mb-8">
                    {getContentValue('final_description')}
                  </p>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { icon: Shield, text: 'Transport sécurisé' },
                      { icon: Award, text: 'Tarifs transparents' },
                      { icon: Users, text: 'Équipe qualifiée' },
                      { icon: Calculator, text: 'Devis gratuit' },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 text-white/80">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-dk-gold" />
                        </div>
                        <span className="text-xs md:text-sm text-center">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild size="lg" className="bg-dk-gold hover:bg-dk-gold/90 text-dk-navy font-semibold px-8">
                    <Link to="/devis">
                      <Calculator className="mr-2 w-5 h-5" />
                      Demandez votre devis gratuit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
