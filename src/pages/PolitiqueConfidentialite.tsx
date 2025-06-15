import React from 'react';
import { Separator } from "@/components/ui/separator";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Politique de confidentialité</h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <p className="mb-4">DK AUTOMOTIVE accorde une grande importance à la protection de la vie privée de ses utilisateurs. La présente politique de confidentialité vise à vous informer sur les données personnelles que nous collectons, la manière dont nous les utilisons et les mesures que nous prenons pour assurer leur sécurité.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Collecte des données personnelles</h2>
              <p className="mb-4">Dans le cadre de l'utilisation de notre site web et de nos services, nous sommes amenés à collecter certaines données personnelles vous concernant. Ces données peuvent inclure, sans s'y limiter :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vos coordonnées (nom, prénom, adresse e-mail, numéro de téléphone, adresse postale) ;</li>
                <li>Vos informations de connexion (identifiant, mot de passe) ;</li>
                <li>Vos informations de facturation et de paiement ;</li>
                <li>Vos préférences et habitudes de navigation ;</li>
                <li>Toute autre information que vous nous fournissez volontairement.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Utilisation des données personnelles</h2>
              <p className="mb-4">Nous utilisons les données personnelles collectées pour les finalités suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gérer et exécuter vos commandes ;</li>
                <li>Répondre à vos demandes de renseignements et vous assister ;</li>
                <li>Améliorer nos services et l'expérience utilisateur ;</li>
                <li>Personnaliser le contenu du site en fonction de vos préférences ;</li>
                <li>Vous envoyer des informations commerciales et promotionnelles, si vous y avez consenti ;</li>
                <li>Réaliser des analyses et des statistiques ;</li>
                <li>Respecter nos obligations légales et réglementaires.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Partage des données personnelles</h2>
              <p>Nous nous engageons à ne pas vendre, louer ou échanger vos données personnelles avec des tiers sans votre consentement. Cependant, nous pouvons partager vos données personnelles avec des prestataires de services qui nous aident à gérer notre site web et à fournir nos services (hébergement, maintenance, paiement, etc.). Ces prestataires sont tenus de respecter la confidentialité de vos données et de les utiliser uniquement dans le cadre des services qu'ils nous fournissent.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Conservation des données personnelles</h2>
              <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour réaliser les finalités pour lesquelles elles ont été collectées et conformément aux exigences légales et réglementaires en vigueur. Une fois ces finalités atteintes, vos données seront supprimées ou anonymisées.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Sécurité des données personnelles</h2>
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, la modification ou la destruction. Ces mesures incluent notamment le cryptage des données, l'utilisation de pare-feu et de systèmes de détection d'intrusion, ainsi que la formation de notre personnel aux bonnes pratiques en matière de protection des données.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Vos droits</h2>
              <p className="mb-4">Conformément à la législation en vigueur, vous disposez de plusieurs droits concernant vos données personnelles :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Le droit d'accès : vous pouvez demander à accéder à vos données personnelles ;</li>
                <li>Le droit de rectification : vous pouvez demander à corriger ou mettre à jour vos données personnelles ;</li>
                <li>Le droit à l'effacement : vous pouvez demander la suppression de vos données personnelles, dans la mesure permise par la loi ;</li>
                <li>Le droit à la limitation du traitement : vous pouvez demander à limiter le traitement de vos données personnelles ;</li>
                <li>Le droit à la portabilité : vous pouvez demander à recevoir vos données personnelles dans un format structuré, couramment utilisé et lisible par machine, ou demander leur transfert à un autre responsable de traitement, lorsque cela est techniquement possible ;</li>
                <li>Le droit d'opposition : vous pouvez vous opposer au traitement de vos données personnelles pour des raisons tenant à votre situation particulière ;</li>
                <li>Le droit de retirer votre consentement : lorsque le traitement de vos données personnelles repose sur votre consentement, vous pouvez le retirer à tout moment.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Modifications de la politique de confidentialité</h2>
              <p>Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute modification sera publiée sur notre site web avec une date d'entrée en vigueur. Nous vous invitons à consulter régulièrement cette page pour vous tenir informé des éventuelles mises à jour.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Contact</h2>
              <p>Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité, vous pouvez nous contacter à l'adresse e-mail suivante : contact@dkautomotive.com.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;
