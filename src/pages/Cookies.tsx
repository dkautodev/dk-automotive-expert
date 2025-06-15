import React from 'react';
import { Separator } from "@/components/ui/separator";

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center text-dk-navy mb-8">Politique de cookies</h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Qu'est-ce qu'un cookie ?</h2>
              <p>Un cookie est un petit fichier texte stocké sur le disque dur de votre ordinateur ou de votre appareil mobile par le biais de votre navigateur lorsque vous visitez certains sites web. Les cookies permettent aux sites de reconnaître votre appareil lors de vos visites ultérieures et d'améliorer votre expérience en mémorisant certaines informations, comme vos préférences de navigation ou les articles que vous avez placés dans votre panier d'achat.</p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Les cookies utilisés par DK AUTOMOTIVE</h2>
              <p className="mb-4">DK AUTOMOTIVE utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. Voici les différents types de cookies utilisés sur notre site :</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">a) Cookies fonctionnels</h3>
                  <p>Ces cookies sont nécessaires au bon fonctionnement du site et permettent, par exemple, de vous identifier lorsque vous vous connectez à votre compte client ou de mémoriser les articles que vous avez placés dans votre panier d'achat.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">b) Cookies de performance</h3>
                  <p>Ces cookies collectent des informations anonymes sur la manière dont les visiteurs utilisent le site (pages les plus visitées, durée de la visite, etc.). Ces données nous aident à améliorer notre site en identifiant les éléments qui fonctionnent bien et ceux qui nécessitent des améliorations.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">c) Cookies de personnalisation</h3>
                  <p>Ces cookies mémorisent vos préférences (choix de langue, localisation, etc.) afin d'adapter le contenu du site à vos besoins et de vous offrir une expérience de navigation personnalisée.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">d) Cookies de ciblage ou publicitaires</h3>
                  <p>Ces cookies sont utilisés pour vous présenter des publicités pertinentes en fonction de vos centres d'intérêt. Ils permettent également de limiter le nombre de fois où vous voyez une publicité et d'évaluer l'efficacité de nos campagnes publicitaires.</p>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Gestion des cookies</h2>
              <p className="mb-4">Vous pouvez gérer vos préférences en matière de cookies directement dans les paramètres de votre navigateur. Vous pouvez ainsi accepter ou refuser les cookies, ou bien choisir de supprimer ceux qui sont déjà stockés sur votre appareil. Veuillez noter que si vous choisissez de refuser les cookies, certaines fonctionnalités du site pourraient ne pas fonctionner correctement.</p>
              
              <p className="mb-4">Voici comment gérer les cookies sur les principaux navigateurs :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Chrome : Menu {">"} Paramètres {">"} Confidentialité et sécurité {">"} Cookies et autres données de site</li>
                <li>Mozilla Firefox : Menu {">"} Options {">"} Vie privée et sécurité {">"} Cookies et données de site</li>
                <li>Microsoft Edge : Menu {">"} Paramètres {">"} Confidentialité, recherche et services {">"} Cookies et données de site</li>
                <li>Apple Safari : Menu {">"} Préférences {">"} Confidentialité {">"} Cookies et données de site</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-dk-navy mb-4">Mise à jour de la politique de cookies</h2>
              <p className="mb-4">DK AUTOMOTIVE se réserve le droit de modifier la présente politique de cookies à tout moment. Nous vous invitons à consulter régulièrement cette page pour être informé des éventuelles mises à jour.</p>
              <p className="mb-4">Dernière mise à jour : 27/04/2023</p>
              <p>Si vous avez des questions concernant notre politique de cookies, n'hésitez pas à nous contacter à l'adresse email mentionnée dans nos mentions légales.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cookies;
