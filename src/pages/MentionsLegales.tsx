
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useLegalMentions } from '@/hooks/useLegalMentions';
import { Loader2 } from 'lucide-react';

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
      <section>
        {title && <h2 className="text-xl font-semibold text-dk-navy mb-4">{title}</h2>}
        {content && <p>{content}</p>}
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
              <p>Chargement des mentions légales...</p>
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
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Mentions Légales</h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Informations légales</h2>
              <div className="space-y-2">
                <p><strong>Raison sociale :</strong> {getLegalMentionValue('raison_sociale')}</p>
                <p><strong>Forme juridique :</strong> {getLegalMentionValue('forme_juridique')}</p>
                {getLegalMentionValue('capital_social') && (
                  <p><strong>Capital social :</strong> {getLegalMentionValue('capital_social')}</p>
                )}
                <p><strong>Numéro d'immatriculation :</strong> {getLegalMentionValue('numero_immatriculation')}</p>
                <p><strong>Siège social :</strong> {getLegalMentionValue('siege_social')}</p>
                {getLegalMentionValue('telephone') && (
                  <p><strong>Téléphone :</strong> {getLegalMentionValue('telephone')}</p>
                )}
                <p><strong>Email :</strong> {getLegalMentionValue('email')}</p>
                <p><strong>Directeur de la publication :</strong> {getLegalMentionValue('directeur_publication')}</p>
              </div>
            </section>

            <Separator />

            {renderSection('hebergement_titre', 'hebergement_contenu')}

            <Separator />

            {renderSection('propriete_intellectuelle_titre', 'propriete_intellectuelle_contenu')}

            <Separator />

            {renderSection('responsabilite_titre', 'responsabilite_contenu')}

            <Separator />

            {renderSection('protection_donnees_titre', 'protection_donnees_contenu')}

            <Separator />

            {renderSection('liens_hypertextes_titre', 'liens_hypertextes_contenu')}

            <Separator />

            {renderSection('cookies_titre', 'cookies_contenu')}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentionsLegales;
