import React from 'react';
import { Separator } from "@/components/ui/separator";
import { usePrivacyPolicy } from '@/hooks/usePrivacyPolicy';
import { Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';

const PolitiqueConfidentialite = () => {
  const { privacyPolicySections, isLoading } = usePrivacyPolicy();

  const getPrivacyPolicySection = (sectionKey: string) => {
    const section = privacyPolicySections.find(item => item.section_key === sectionKey);
    return section?.section_content || '';
  };

  const getSectionTitle = (sectionKey: string) => {
    const section = privacyPolicySections.find(item => item.section_key === sectionKey);
    return section?.section_title || '';
  };

  const renderSection = (sectionKey: string) => {
    const title = getSectionTitle(sectionKey);
    const content = getPrivacyPolicySection(sectionKey);
    
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
              <p>Chargement de la politique de confidentialité...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Politique de Confidentialité"
        description="Consultez la politique de confidentialité de DK Automotive. Informations sur la collecte, l'utilisation et la protection de vos données personnelles."
        canonical="https://www.dkautomotive.fr/politique-confidentialite"
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Politique de confidentialité</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {renderSection('introduction')}

            <Separator />

            {renderSection('collecte_donnees')}

            <Separator />

            {renderSection('utilisation_donnees')}

            <Separator />

            {renderSection('partage_donnees')}

            <Separator />

            {renderSection('conservation_donnees')}

            <Separator />

            {renderSection('securite_donnees')}

            <Separator />

            {renderSection('vos_droits')}

            <Separator />

            {renderSection('modifications_politique')}

            <Separator />

            {renderSection('contact')}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;
