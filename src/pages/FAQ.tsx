
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from '@/integrations/supabase/client';

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

  return (
    <div className="min-h-screen bg-white">
      <main className="animate-fadeIn">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-black">FAQ</span>
                <br />
                <span className="text-[#1a237e]">DK AUTOMOTIVE</span>
              </h1>
              <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto whitespace-nowrap">
                Trouvez toutes les réponses à vos interrogations sur notre service de convoyage de véhicules
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Chargement des FAQ...</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {faqItems.map((item, index) => (
                    <AccordionItem 
                      key={item.id} 
                      value={`item-${item.id}`} 
                      className="bg-[#1a237e] rounded-none shadow-sm"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline text-sm font-medium text-white">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-white text-base">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">FAITES LE CHOIX DE L'EXPERTISE</h2>
            <h3 className="text-4xl font-bold text-[#1a237e] mb-4">DK AUTOMOTIVE</h3>
            <p className="text-lg text-gray-700 mb-4">UN PARTENAIRE FIABLE POUR VOS BESOINS EN CONVOYAGE</p>
            <p className="text-base text-gray-600 max-w-4xl mx-auto mb-8">
              Rejoignez dès aujourd'hui notre réseau de clients satisfaits et découvrez la différence que DK AUTOMOTIVE peut apporter à votre expérience de transport de véhicules. En tant que professionnels de l'automobile, nous sommes impatients de travailler avec vous et de vous fournir les solutions de convoyage les plus adaptées à vos besoins.
            </p>
            <Link 
              to="/devis" 
              className="inline-block bg-[#1a237e] text-white px-8 py-4 text-lg font-semibold hover:bg-[#1a237e]/90 transition-colors"
            >
              DEMANDEZ VOTRE DEVIS
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQ;
