
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useCgvContent } from '@/hooks/useCgvContent';
import { Loader2 } from 'lucide-react';

const CGV = () => {
  const { cgvContentSections, isLoading } = useCgvContent();

  const getCgvContentSection = (sectionKey: string) => {
    const section = cgvContentSections.find(item => item.section_key === sectionKey);
    return section?.section_content || '';
  };

  const getSectionTitle = (sectionKey: string) => {
    const section = cgvContentSections.find(item => item.section_key === sectionKey);
    return section?.section_title || '';
  };

  const renderSection = (sectionKey: string) => {
    const title = getSectionTitle(sectionKey);
    const content = getCgvContentSection(sectionKey);
    
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
              <p>Chargement des conditions générales de vente...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Conditions Générales de Vente</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {renderSection('introduction')}

            <Separator />

            {renderSection('services')}

            <Separator />

            {renderSection('tarifs')}

            <Separator />

            {renderSection('responsabilite')}

            <Separator />

            {renderSection('annulation')}

            <Separator />

            {renderSection('litiges')}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CGV;
