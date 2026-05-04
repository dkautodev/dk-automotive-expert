import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useLegalMentions } from '@/hooks/useLegalMentions';
import { Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';

const MentionsLegales = () => {
  const { legalMentions, isLoading } = useLegalMentions();

  const getLegalMentionValue = (fieldKey: string) => {
    const mention = legalMentions.find(item => item.field_key === fieldKey);
    return mention?.field_value || '';
  };

  const renderSection = (titleKey: string, contentKey: string) => {
    const title = getLegalMentionValue(titleKey);
    const content = getLegalMentionValue(contentKey);
    
    if (!title && !content) return null;
    
    return (
      <section className="mb-8">
        {title && <h2 className="text-xl font-semibold text-dk-navy mb-4">{title}</h2>}
        {content && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{content}</p>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Mentions Légales"
        description="Consultez les mentions légales de DK Automotive. Informations sur la société, l'hébergement du site et la protection des données."
        canonical="https://www.dkautomotive.fr/mentions-legales"
      />
      {isLoading ? (
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Chargement des mentions légales...</p>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-12">Mentions Légales</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Informations légales */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Informations légales</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2"><strong>Raison sociale :</strong> {getLegalMentionValue('raison_sociale')}</p>
                    <p className="mb-2"><strong>Forme juridique :</strong> {getLegalMentionValue('forme_juridique')}</p>
                    {getLegalMentionValue('capital_social') && (
                      <p className="mb-2"><strong>Capital social :</strong> {getLegalMentionValue('capital_social')}</p>
                    )}
                    <p className="mb-2"><strong>Numéro d'immatriculation :</strong> {getLegalMentionValue('numero_immatriculation')}</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong>Siège social :</strong> {getLegalMentionValue('siege_social')}</p>
                    {getLegalMentionValue('telephone') && (
                      <p className="mb-2"><strong>Téléphone :</strong> {getLegalMentionValue('telephone')}</p>
                    )}
                    <p className="mb-2"><strong>Email :</strong> {getLegalMentionValue('email')}</p>
                    <p className="mb-2"><strong>Directeur de la publication :</strong> {getLegalMentionValue('directeur_publication')}</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Sections avec titre + contenu regroupés */}
            {renderSection('hebergement_titre', 'hebergement_contenu')}

            {renderSection('propriete_intellectuelle_titre', 'propriete_intellectuelle_contenu')}

            {renderSection('responsabilite_titre', 'responsabilite_contenu')}

            {renderSection('protection_donnees_titre', 'protection_donnees_contenu')}

            {renderSection('liens_hypertextes_titre', 'liens_hypertextes_contenu')}

            {renderSection('cookies_titre', 'cookies_contenu')}
          </div>
        </div>
      </main>
      )}
    </div>
  );
};

export default MentionsLegales;
