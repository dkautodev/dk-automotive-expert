
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useCookieManagement } from '@/hooks/useCookieManagement';
import { Loader2 } from 'lucide-react';

const GestionCookies = () => {
  const { cookieManagementSections, isLoading } = useCookieManagement();

  const getCookieManagementSection = (sectionKey: string) => {
    const section = cookieManagementSections.find(item => item.section_key === sectionKey);
    return section?.section_content || '';
  };

  const getSectionTitle = (sectionKey: string) => {
    const section = cookieManagementSections.find(item => item.section_key === sectionKey);
    return section?.section_title || '';
  };

  const renderSection = (sectionKey: string) => {
    const title = getSectionTitle(sectionKey);
    const content = getCookieManagementSection(sectionKey);
    
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
              <p>Chargement de la gestion des cookies...</p>
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
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Gestion des Cookies</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {renderSection('introduction')}

            <Separator />

            {renderSection('utilisation')}

            <Separator />

            {renderSection('gestion')}

            <Separator />

            {renderSection('contact')}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestionCookies;
