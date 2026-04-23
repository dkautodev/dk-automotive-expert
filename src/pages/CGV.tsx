import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useCgvContent } from '@/hooks/useCgvContent';
import { Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';

const CGV = () => {
  const { cgvContentSections, isLoading } = useCgvContent();


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Chargement des conditions générales de vente...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="CGV - Conditions Générales de Vente"
        description="Consultez les conditions générales de vente de DK Automotive. Informations sur nos services de convoyage, tarifs et responsabilités."
        canonical="https://www.dkautomotive.fr/cgv"
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Conditions Générales de Vente</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {cgvContentSections.map((section, index) => (
              <React.Fragment key={section.id}>
                <section className="mb-8">
                  {section.section_title && (
                    <h2 className="text-xl font-semibold text-dk-navy mb-4">
                      {section.section_title}
                    </h2>
                  )}
                  {section.section_content && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {section.section_content}
                      </p>
                    </div>
                  )}
                </section>
                {index < cgvContentSections.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CGV;
