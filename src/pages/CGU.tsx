import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useCguContent } from '@/hooks/useCguContent';
import { Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';

const CGU = () => {
  const { cguContentSections, isLoading } = useCguContent();

  const getCguContentSection = (sectionKey: string) => {
    const section = cguContentSections.find(item => item.section_key === sectionKey);
    return section?.section_content || '';
  };

  const getSectionTitle = (sectionKey: string) => {
    const section = cguContentSections.find(item => item.section_key === sectionKey);
    return section?.section_title || '';
  };

  const renderSection = (sectionKey: string) => {
    const title = getSectionTitle(sectionKey);
    const content = getCguContentSection(sectionKey);
    
    if (!title && !content) return null;
    
    return (
      <section className="mb-8">
        {title && <h2 className="text-xl font-semibold text-dk-navy mb-4">{title}</h2>}
        {content && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>
        )}
      </section>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Chargement des conditions générales d'utilisation...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="CGU - Conditions Générales d'Utilisation"
        description="Consultez les conditions générales d'utilisation du site de DK Automotive. Informations sur l'accès au site, son utilisation et la propriété intellectuelle."
        canonical="https://dkautomotive.fr/cgu"
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Conditions Générales d'Utilisation</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {renderSection('introduction')}

            <Separator />

            {renderSection('acces_site')}

            <Separator />

            {renderSection('utilisation')}

            <Separator />

            {renderSection('propriete_intellectuelle')}

            <Separator />

            {renderSection('donnees_personnelles')}

            <Separator />

            {renderSection('responsabilite')}

            <Separator />

            {renderSection('modifications')}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CGU;
