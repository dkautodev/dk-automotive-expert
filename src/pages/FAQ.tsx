import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from '@/integrations/supabase/client';
import { SEO } from '@/components/SEO';
import { HelpCircle, MessageCircle, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        const {
          data,
          error
        } = await supabase.from('faq_items').select('*').eq('is_active', true).order('display_order', {
          ascending: true
        });
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
  const trustBadges = [{
    icon: HelpCircle,
    label: "Questions fréquentes",
    sublabel: "Réponses claires"
  }, {
    icon: MessageCircle,
    label: "Support réactif",
    sublabel: "À votre écoute"
  }, {
    icon: Clock,
    label: "Disponible 24/7",
    sublabel: "Consultable à tout moment"
  }];
  return <>
      <SEO title="FAQ - Questions Fréquentes" description="Trouvez toutes les réponses à vos questions sur notre service de convoyage de véhicules. FAQ complète sur les tarifs, délais, assurances et modalités." canonical="https://dkautomotive.fr/faq" />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-dk-navy via-dk-navy to-dk-blue py-16 md:py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/20 rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <HelpCircle className="h-4 w-4 text-white" />
                <span className="text-white/90 text-sm font-medium">Centre d'aide</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Questions <span className="text-white/80">Fréquentes</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
                Trouvez toutes les réponses à vos interrogations sur notre service de convoyage de véhicules
              </p>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {trustBadges.map((badge, index) => <div key={index} className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <badge.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold text-sm">{badge.label}</p>
                      <p className="text-white/70 text-xs">{badge.sublabel}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              {isLoading ? <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="h-10 w-10 text-dk-navy animate-spin" />
                  <p className="text-muted-foreground">Chargement des FAQ...</p>
                </div> : faqItems.length === 0 ? <div className="text-center py-16">
                  <HelpCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Aucune FAQ disponible pour le moment.</p>
                </div> : <Accordion type="single" collapsible className="space-y-3">
                  {faqItems.map((item, index) => <AccordionItem key={item.id} value={`item-${item.id}`} className="bg-gradient-to-r from-dk-navy to-dk-blue rounded-xl shadow-lg border-0 overflow-hidden group">
                      <AccordionTrigger className="px-5 md:px-6 py-4 md:py-5 hover:no-underline text-left">
                        <div className="flex items-start gap-3 md:gap-4 w-full pr-4">
                          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm md:text-base">{index + 1}</span>
                          </div>
                          <span className="text-white font-medium text-sm md:text-base leading-relaxed">
                            {item.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 md:px-6 pb-5 md:pb-6">
                        <div className="pl-11 md:pl-14">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                            <p className="text-white/90 text-sm md:text-base leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>)}
                </Accordion>}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-background rounded-2xl shadow-xl p-6 md:p-10 border">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-dk-navy to-dk-blue rounded-2xl flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      Vous n'avez pas trouvé votre réponse ?
                    </h3>
                    <p className="text-muted-foreground">
                      Notre équipe est à votre disposition pour répondre à toutes vos questions.
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button asChild size="lg" className="bg-dk-navy hover:bg-dk-navy/90 text-white gap-2">
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
        
      </div>
    </>;
};
export default FAQ;