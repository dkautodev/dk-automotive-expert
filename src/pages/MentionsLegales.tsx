import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";
const MentionsLegales = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Mentions Légales</h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Informations légales</h2>
              <div className="space-y-2">
                <p><strong>Raison sociale :</strong> DK AUTOMOTIVE</p>
                <p><strong>Forme juridique :</strong> Association</p>
                <p><strong>Capital social :</strong> </p>
                <p><strong>Numéro d'immatriculation :</strong> 93480596100018</p>
                <p><strong>Siège social :</strong> 19 RUE DE BRESSE 93000 BOBIGNY</p>
                <p><strong>Téléphone :</strong> </p>
                <p><strong>Email :</strong> contact@dkautomotive.fr</p>
                <p><strong>Directeur de la publication :</strong> CarXprtz, 9 rue des colonnes, 75002 PARIS</p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Hébergement du site</h2>
              <p>Le site internet de DK AUTOMOTIVE est hébergé par IONOS, dont le siège social est situé à 7, place de la Gare BP 70109 57200 Sarreguemines Cedex France et joignable par téléphone au +33 9 70 80 89 11.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Propriété intellectuelle</h2>
              <p>L'ensemble des contenus du site (textes, logos, images, éléments graphiques, icônes, vidéos, etc.) sont la propriété exclusive de DK AUTOMOTIVE ou de leurs auteurs respectifs. Toute reproduction, représentation, modification, publication ou adaptation des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de DK AUTOMOTIVE.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Responsabilité</h2>
              <p>DK AUTOMOTIVE s'efforce de fournir des informations aussi précises que possible sur son site internet. Toutefois, la société ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour des informations fournies, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Protection des données personnelles</h2>
              <p>DK AUTOMOTIVE s'engage à préserver la confidentialité des informations fournies en ligne par l'utilisateur. Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement général sur la protection des données (RGPD), l'utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition sur ses données personnelles. Pour exercer ces droits, l'utilisateur peut contacter DK AUTOMOTIVE à l'adresse email mentionnée ci-dessus.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Liens hypertextes</h2>
              <p>La mise en place de liens hypertextes en direction d'autres sites internet n'engage pas la responsabilité de DK AUTOMOTIVE quant au contenu de ces sites. L'établissement de liens vers le site de DK AUTOMOTIVE nécessite une autorisation préalable et écrite de la société.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Cookies</h2>
              <p>Le site de DK AUTOMOTIVE utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. En poursuivant la navigation sur le site, l'utilisateur accepte l'utilisation de cookies. L'utilisateur peut également configurer son navigateur pour refuser les cookies.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default MentionsLegales;