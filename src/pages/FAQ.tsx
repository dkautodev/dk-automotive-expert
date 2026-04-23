import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';
import { HelpCircle, MessageCircle, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/common/Hero';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

const FAQ = () => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqItems = async () => {
      try {
        const { data, error } = await supabase
          .from('faq_items')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching FAQ items:', error);
          return;
        }

        setFaqItems(data || []);
      } catch (error) {
        console.error('Error fetching FAQ items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqItems();
  }, []);

  const trustBadges = [
    { icon: HelpCircle, label: "Réponses claires" },
    { icon: MessageCircle, label: "Support réactif" },
    { icon: Clock, label: "Disponible 24/7" },
  ];

  return (
    <>
      <SEO 
        title="FAQ - Questions Fréquentes"
        description="Trouvez toutes les réponses à vos questions sur notre service de convoyage de véhicules. FAQ complète sur les tarifs, délais, assurances et modalités."
        canonical="https://www.dkautomotive.fr/faq"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <Hero
          title="Questions Fréquentes"
          description="Trouvez toutes les réponses à vos interrogations sur notre service de convoyage de véhicules"
          backgroundImage="/upload/51603c32-87b6-4e5d-ab03-7352caca679d.png"
          height="min-h-[350px] md:min-h-[450px]"
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

        {/* Schema.org FAQPage */}
        {!isLoading && faqItems.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }} />
        )}

        {/* FAQ Content */}
        <section className="section-spacing bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-8 w-8 text-dk-navy animate-spin" />
                  <p className="text-muted-foreground text-sm">Chargement des FAQ...</p>
                </div>
              ) : faqItems.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune FAQ disponible pour le moment.</p>
                </div>
              ) : (
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
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
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
              <Button asChild className="bg-dk-navy hover:bg-dk-blue text-white px-8 py-5 text-base">
                <Link to="/devis">
                  Demander un devis gratuit
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
