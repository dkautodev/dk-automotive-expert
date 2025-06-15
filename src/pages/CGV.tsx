import React from 'react';
import { Separator } from "@/components/ui/separator";

const CGV = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Conditions Générales de Vente</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">1. Objet des CGV</h2>
              <p className="mb-2">Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Le Client : Toute personne physique ou morale souhaitant bénéficier des prestations de convoyage proposées par DK AUTOMOTIVE.</li>
                <li>DK AUTOMOTIVE : Prestataire de services de convoyage, immatriculé sous le numéro 93480596100018, ayant son siège social au 19 rue de Bresse, 93000 Bobigny.</li>
              </ul>
              <p className="mt-2">En validant sa commande, le Client accepte sans réserve les présentes CGV.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">2. Services proposés</h2>
              <p className="mb-2">DK AUTOMOTIVE propose des services de convoyage de véhicules par la route, incluant :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>La prise en charge du véhicule.</li>
                <li>Le transport sécurisé jusqu'au lieu de livraison spécifié.</li>
                <li>La remise du véhicule au destinataire.</li>
              </ul>
              <p className="mt-2">Toute prestation complémentaire devra faire l'objet d'un accord écrit entre les Parties.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">3. Commande</h2>
              <p className="mb-2">Pour passer commande, le Client doit fournir les informations suivantes :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ses coordonnées complètes (nom, prénom, adresse, téléphone, email).</li>
                <li>Les informations relatives au véhicule (type, genre, immatriculation, numéro de châssis).</li>
                <li>Les détails concernant le lieu et la date de prise en charge et de livraison.</li>
                <li>Toute particularité ou donnée spécifique concernant le véhicule pouvant influencer la prestation.</li>
              </ul>
              <p className="mt-2">La validation de la commande implique l'acceptation des présentes CGV.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">4. Prix et paiement</h2>
              <p className="mb-2">Le prix du convoyage est calculé en fonction :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Du type et des caractéristiques du véhicule.</li>
                <li>De la distance entre le point de départ et d'arrivée.</li>
                <li>Des éventuels frais supplémentaires liés à des contraintes spécifiques.</li>
              </ul>
              <p className="mt-2">Le paiement est dû dès la confirmation de la prestation par DK AUTOMOTIVE. Les prix sont indiqués toutes taxes comprises (TTC).</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">5. Obligations du Client</h2>
              <p className="mb-2">Le Client s'engage à :</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Fournir des informations exactes et complètes lors de la commande.</li>
                <li>Mettre le véhicule à disposition dans les conditions convenues.</li>
                <li>Informer DK AUTOMOTIVE en cas de particularités techniques ou réglementaires liées au véhicule.</li>
              </ol>
              <p className="mt-2">En cas d'annulation après confirmation, le Client reste redevable du montant total de la prestation.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">6. Obligations du Prestataire</h2>
              <p className="mb-2">DK AUTOMOTIVE s'engage à :</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Exécuter la prestation conformément aux informations fournies par le Client.</li>
                <li>Respecter les règles de sécurité routière et adopter une conduite éco-responsable.</li>
                <li>Assumer la responsabilité du véhicule pendant toute la durée du convoyage.</li>
              </ol>
              <p className="mt-2">En cas d'empêchement lié à des conditions climatiques dangereuses ou toute autre raison indépendante de sa volonté, DK AUTOMOTIVE informera immédiatement le Client.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">7. État contradictoire du véhicule</h2>
              <p className="mb-2">Un état des lieux contradictoire est réalisé avant et après chaque convoyage :</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Avant la prise en charge : Entre le Client (ou son représentant) et DK AUTOMOTIVE.</li>
                <li>Après la livraison : Entre DK AUTOMOTIVE et le Destinataire.</li>
              </ol>
              <p className="mt-2">Ces états des lieux peuvent être réalisés sous format écrit ou digital et doivent être signés par les Parties concernées.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">8. Responsabilité</h2>
              <p className="mb-2">DK AUTOMOTIVE ne pourra être tenu responsable en cas :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>D'informations erronées fournies par le Client.</li>
                <li>De dysfonctionnements techniques non signalés préalablement (exemple : batterie défectueuse).</li>
                <li>De force majeure empêchant l'exécution normale du convoyage.</li>
              </ul>
              <p className="mt-2">Toute contravention liée à une faute directe du Prestataire sera assumée par celui-ci.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">9. Annulation ou empêchement</h2>
              <p>En cas d'annulation ou d'impossibilité d'exécuter la prestation pour des raisons imputables au Client (erreur d'information, indisponibilité, etc.), DK AUTOMOTIVE se réserve le droit de facturer l'intégralité du service ainsi que des frais supplémentaires liés aux coûts engagés.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">10. Confidentialité</h2>
              <p>DK AUTOMOTIVE s'engage à préserver la confidentialité des informations transmises par le Client dans le cadre de la prestation.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">11. Litiges</h2>
              <p>En cas de différend relatif aux présentes CGV, les Parties s'efforceront de trouver une solution amiable (médiation ou conciliation). À défaut d'accord amiable, tout litige sera soumis à la compétence exclusive des tribunaux français.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">12. Loi applicable</h2>
              <p>Les présentes CGV sont régies par les lois françaises.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">13. Acceptation</h2>
              <p>En cliquant sur "Créer la mission", le Client reconnaît avoir pris connaissance des présentes CGV et les accepte pleinement.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CGV;
