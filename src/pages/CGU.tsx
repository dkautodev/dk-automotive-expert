
import React from 'react';

const CGU = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dk-navy mb-8 text-center">
            Conditions Générales d'Utilisation (CGU)
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Préambule</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») définissent les droits et obligations des utilisateurs et de l'éditeur du logiciel SaaS dédié à la création de missions, gestion de profils, génération de factures et devis. L'accès et l'utilisation du service impliquent l'acceptation sans réserve des présentes CGU.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                1. Objet
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le SaaS permet à ses utilisateurs de :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Créer et gérer des missions</li>
                <li>Administrer leur profil utilisateur</li>
                <li>Générer, éditer et stocker des factures et devis conformes à la réglementation en vigueur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                2. Accès au service
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>L'accès au service nécessite la création d'un compte utilisateur.</li>
                <li>L'utilisateur s'engage à fournir des informations exactes lors de l'inscription et à les maintenir à jour.</li>
                <li>L'accès peut être restreint, suspendu ou supprimé en cas de non-respect des CGU.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                3. Création et gestion de missions
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>L'utilisateur peut créer des missions, en définir les modalités et les suivre via la plateforme.</li>
                <li>La finalisation d'une mission peut entraîner la génération automatique d'une facture ou d'un devis selon les paramètres définis par l'utilisateur.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                4. Gestion de profil
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Chaque utilisateur dispose d'un espace personnel lui permettant de gérer ses informations, préférences et documents associés à son activité.</li>
                <li>L'utilisateur est responsable de la confidentialité de ses identifiants et de l'usage de son compte.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                5. Génération de factures et devis
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Le service permet la création, la personnalisation et l'édition de factures et devis conformes à la législation française (loi anti-fraude à la TVA, mentions obligatoires, etc.).</li>
                <li>Les documents générés peuvent être téléchargés, envoyés ou archivés directement depuis la plateforme.</li>
                <li>L'utilisateur est seul responsable de la vérification de la conformité des documents générés.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                6. Paiement et facturation
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Les modalités de paiement des prestations réalisées via la plateforme sont précisées lors de la création de la mission.</li>
                <li>À l'issue de la mission, une facture est émise et mise à disposition sur la plateforme.</li>
                <li>La validation de la mission par le client déclenche le paiement au prestataire, déduction faite de la commission éventuelle due à la société éditrice du SaaS.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                7. Propriété intellectuelle
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>L'éditeur conserve tous les droits de propriété intellectuelle sur la plateforme, son contenu et ses fonctionnalités.</li>
                <li>L'utilisateur s'interdit de reproduire, copier ou exploiter tout ou partie du service sans autorisation expresse.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                8. Données personnelles
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Les données collectées sont traitées conformément à la réglementation en vigueur (RGPD).</li>
                <li>L'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données personnelles.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                9. Responsabilité
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>L'éditeur s'efforce d'assurer la disponibilité et la sécurité du service, sans garantie absolue.</li>
                <li>L'utilisateur reste seul responsable des informations saisies, des documents générés et de leur usage.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                10. Modification des CGU
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>L'éditeur se réserve le droit de modifier les présentes CGU à tout moment.</li>
                <li>Toute modification sera communiquée aux utilisateurs, qui devront accepter la nouvelle version pour continuer à utiliser le service.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-dk-navy mb-4 border-b-2 border-dk-blue pb-2">
                11. Loi applicable et juridiction compétente
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Les présentes CGU sont régies par le droit français.</li>
                <li>Tout litige relatif à leur interprétation ou exécution relève de la compétence des tribunaux du siège social de l'éditeur.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGU;
