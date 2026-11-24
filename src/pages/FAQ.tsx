import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEO } from '@/components/SEO';
import { HelpCircle, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/common/Hero';
import { faqItems } from '@/data/faqAndLegalContent';

const FAQ = () => {
  const trustBadges = [
    { icon: HelpCircle, label: "Réponses claires" },
    { icon: MessageCircle, label: "Support réactif" },
    { icon: Clock, label: "Disponible 24/7" },
  ];

  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
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
          "name": "FAQ",
          "item": "https://www.dkautomotive.fr/faq"
        }
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="FAQ - Questions Fréquentes"
        description="Trouvez toutes les réponses à vos questions sur notre service de convoyage de véhicules. FAQ complète sur les tarifs, délais, assurances et modalités."
        canonical="https://www.dkautomotive.fr/faq"
      />
      
      {/* Schema.org FAQPage pré-généré immédiatement pour Googlebot */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData)
      }} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <Hero
          title="Questions Fréquentes"
          description="Trouvez toutes les réponses à vos interrogations sur notre service de convoyage de véhicules"
          backgroundImage="/upload/hero_background-1790463219069.webp"
          height="min-h-[440px] md:min-h-[520px]"
        >
          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 md:gap-8 mt-8">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                  <badge.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium tracking-wide uppercase">{badge.label}</span>
              </div>
            ))}
          </div>
        </Hero>

        {/* FAQ Content */}
        <section className="section-spacing bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={item.id} 
                    value={`item-${item.id}`} 
                    className="premium-card mb-4 border-none overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline text-left hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 w-full pr-2">
                        <div className="flex-shrink-0 w-7 h-7 bg-dk-navy/10 rounded-md flex items-center justify-center">
                          <span className="text-dk-navy font-semibold text-xs">{index + 1}</span>
                        </div>
                        <span className="text-foreground font-medium text-sm leading-relaxed">
                          {item.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="pl-10">
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {item.answer}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-spacing bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-xl shadow-lg p-5 md:p-6 border border-border">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-dk-navy/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-dk-navy" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-dk-navy mb-1">
                      Vous n'avez pas trouvé votre réponse ?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Notre équipe est à votre disposition pour répondre à toutes vos questions.
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button asChild className="bg-dk-navy hover:bg-dk-blue text-white gap-2">
                      <Link to="/contact">
                        Nous contacter
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-spacing bg-gray-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold text-dk-navy mb-4">
                Besoin d'un devis rapidement ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Utilisez notre calculateur en ligne pour obtenir un tarif instantané.
              </p>
              <Button asChild className="btn-premium bg-dk-navy text-white hover:bg-dk-blue group">
                <Link to="/devis">
                  Demander un devis gratuit
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;
