/**
 * Contenu statique de la FAQ et des pages légales de DK Automotive.
 * Extrait directement de Supabase pour un affichage immédiat,
 * zéro latence réseau et indexation SEO complète par les moteurs de recherche.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface LegalItem {
  id: string;
  field_key: string;
  field_label: string;
  field_value: string;
  display_order: number;
}

export interface ContentSection {
  id: string;
  section_title?: string;
  section_content?: string;
  section_key?: string;
  display_order: number;
}

export const faqItems: FaqItem[] = [
  {
    "id": "9304f588-9847-4193-80e1-432d3f0f4be7",
    "question": "Qu'est-ce que le convoyage de véhicule par la route ?",
    "answer": "Le convoyage de véhicule par la route consiste à faire acheminer une voiture, un utilitaire ou une flotte automobile d'un point A à un point B par un chauffeur convoyeur professionnel. Contrairement au transport par camion, le véhicule roule par ses propres moyens, ce qui permet un transfert porte-à-porte rapide, personnalisé et sans contrainte de chargement.",
    "display_order": 1
  },
  {
    "id": "0c14810e-8b4c-41a0-a6bd-7cfb262b2084",
    "question": "Comment obtenir un devis de convoyage voiture en ligne ?",
    "answer": "Pour obtenir un devis gratuit et immédiat, rendez-vous dans notre rubrique « Obtenir votre devis ». Il vous suffit d'indiquer l'adresse de prise en charge, l'adresse de livraison ainsi que la catégorie de votre véhicule. Notre calculateur calcule instantanément votre tarif. Après validation, un conseiller commercial vous recontacte pour planifier la prise en charge.",
    "display_order": 2
  },
  {
    "id": "fa62b079-f1b0-4179-a26e-dd76d927dae1",
    "question": "Comment DK Automotive garantit-il la sécurité de mon véhicule ?",
    "answer": "La sécurité de votre véhicule est notre priorité absolue. Tous nos convoyeurs sont rigoureusement sélectionnés pour leur expérience, formés à l'éco-conduite et soumis à des procédures strictes. À chaque prise en charge et livraison, un état des lieux rigoureux (avec photos à l'appui) est réalisé. De plus, votre véhicule est couvert par notre assurance tous risques professionnelle durant l'intégralité du trajet.",
    "display_order": 3
  },
  {
    "id": "d9742870-2afc-43fa-b1a6-385c17803ccd",
    "question": "Quels documents administratives fournir pour le transfert d'un véhicule ?",
    "answer": "Pour réaliser le convoyage dans les règles de l'art, vous devez fournir la carte grise du véhicule (originale ou copie lisible), le certificat de contrôle technique à jour (si le véhicule y est soumis) ainsi qu'une attestation d'assurance en cours de validité. Lors de la prise en charge, notre chauffeur remplit le bon de convoyage et procède à l'état des lieux contradictoire.",
    "display_order": 4
  },
  {
    "id": "47d9438f-cb39-4013-a0f0-ae83c557e907",
    "question": "Quel est le prix d'un convoyage de voiture et que comprend le tarif ?",
    "answer": "Notre tarif de convoyage de véhicule par la route est 100 % transparent et tout compris. Il inclut la rémunération du chauffeur convoyeur professionnel, le carburant, les frais de péage, l'assurance tous risques pendant toute la durée du trajet, ainsi que les frais d'acheminement du convoyeur. Aucun frais caché ne vous sera facturé après la prestation. Pour obtenir une estimation exacte selon votre trajet (ex. Paris-Lyon à 480 € TTC ou Paris-Marseille à 735 € TTC), vous pouvez utiliser notre calculateur de devis immédiat en ligne.",
    "display_order": 5
  },
  {
    "id": "e4647056-2e9e-4956-b90f-0c1bf536e4ca",
    "question": "Que se passe-t-il en cas de dommage lors du convoyage automobile ?",
    "answer": "Un état des lieux précis est effectué avant le départ et à l'arrivée en votre présence (ou celle du destinataire). Si une anomalie ou un dégât est constaté à la livraison, il doit être immédiatement notifié sur le procès-verbal d'état des lieux. Notre assurance tous risques professionnelle prend alors immédiatement le relais pour gérer la prise en charge et les réparations nécessaires.",
    "display_order": 6
  },
  {
    "id": "fb7bce7a-b53a-475d-a5b3-0fbc70228e15",
    "question": "Pourquoi choisir DK Automotive pour votre convoyage de véhicule par la route ?",
    "answer": "Avec plus de 2 000 missions réalisées depuis 2018, DK Automotive allie réactivité (prise en charge sous 48h), transparence tarifaire (offres tout compris sans surprises) et haut niveau de sécurité (assurance tous risques incluse, formation à l'éco-conduite). C'est la garantie d'un partenariat fiable pour particuliers comme pour professionnels.",
    "display_order": 7
  },
  {
    "id": "ef521216-eb09-49b4-8582-08ad12f14a19",
    "question": "Quels types de véhicules et utilitaires pouvez-vous convoyer ?",
    "answer": "Nous acheminons tout type de véhicule roulant : citadines, berlines, SUV, véhicules de prestige, ainsi que les véhicules utilitaires légers (VUL) et fourgons. Que ce soit pour un véhicule thermique, hybride ou 100 % électrique, nos chauffeurs sont formés aux spécificités de chaque motorisation et à la gestion des recharges sur le parcours.",
    "display_order": 8
  },
  {
    "id": "d8d08eae-1212-4faa-a4f3-6e291a1a0b5a",
    "question": "Le véhicule doit-il être roulant et en bon état mécanique pour le convoyage ?",
    "answer": "Oui, le véhicule doit être impérativement en état de circuler en toute sécurité sur la voie publique (moteur fonctionnel, freins, pneus en bon état, éclairage conforme) et être à jour de son contrôle technique. Les véhicules en panne, accidentés ou non roulants ne peuvent pas faire l'objet d'un convoyage par la route et nécessitent un remorquage sur plateau.",
    "display_order": 9
  },
  {
    "id": "17662439-db70-4323-84b5-07e2178be895",
    "question": "Comment sont recrutés et formés vos chauffeurs convoyeurs ?",
    "answer": "Nos convoyeurs professionnels sont recrutés selon un processus exigeant : vérification des antécédents de conduite, expérience terrain et compétences relationnelles. Ils suivent une formation continue sur la réalisation des états des lieux sur application, la prise en main des nouveaux véhicules (hybrides/électriques) et les techniques d'éco-conduite pour réduire l'empreinte carbone et préserver le véhicule.",
    "display_order": 10
  },
  {
    "id": "8bbd1d52-70ee-44cf-9452-9e0d3889cd16",
    "question": "Comment modifier ou annuler une réservation de convoyage ?",
    "answer": "Vous pouvez modifier les informations de votre mission (date, heures, adresses) ou l'annuler en contactant directement notre service client par téléphone ou par email. Les conditions de modification ou d'annulation sans frais dépendent du délai restant avant la date de prise en charge prévue, conformément à nos Conditions Générales de Vente (CGV).",
    "display_order": 12
  },
  {
    "id": "aabffbcc-c041-4a9f-9611-305cb172cb28",
    "question": "Puis-je laisser des objets personnels ou du matériel dans le véhicule ?",
    "answer": "Oui, il est possible de laisser des effets personnels ou du matériel professionnel dans le coffre ou sur les sièges arrière, à condition que la visibilité du chauffeur ne soit pas obstruée et que le poids total autorisé en charge (PTAC) soit respecté. Les objets de grande valeur restent toutefois sous la responsabilité du propriétaire.",
    "display_order": 13
  },
  {
    "id": "550a240a-8b30-479d-83de-80793b616060",
    "question": "Quelle assurance couvre mon véhicule pendant le convoyage par la route ?",
    "answer": "Tous les véhicules pris en charge par DK Automotive bénéficient automatiquement d'une assurance tous risques professionnelle avec notre partenaire Generali spécifique au convoyage automobile. Dès la réalisation de l'état des lieux de départ (réalisé avec photos à l'appui lors de l'enlèvement) jusqu'à la remise des clés à destination, votre véhicule ou votre flotte automobile est intégralement couverte contre le vol, l'incendie et les dommages accidentels.",
    "display_order": 14
  },
  {
    "id": "f1541d56-0bc6-4309-95dd-cadc82c5fa88",
    "question": "Pourquoi faire appel à un convoyeur professionnel plutôt que faire le trajet soi-même ?",
    "answer": "Confier le transfert de votre véhicule à un professionnel vous fait gagner un temps précieux et vous évite la fatigue, la gestion des billets de train retour, l'usure prématurée et les risques routiers. Pour les entreprises et gestionnaires de flotte, c'est la garantie d'une prestation clé en main, assurée et livrée dans les délais sans mobiliser vos collaborateurs.",
    "display_order": 15
  },
  {
    "id": "df7e12e2-03f0-44a0-b2ad-07eac3da6834",
    "question": "Quels sont les avantages financiers et logistiques du convoyage automobile ?",
    "answer": "Vous économisez les coûts de déplacement annexes (billets de train ou d'avion pour le chauffeur, nuits d'hôtel, repas), vous supprimez la perte de journée de travail et bénéficiez d'une couverture d'assurance tous risques pro dédiée. C'est une solution rentable, sereine et optimisée d'un point de vue logistique.",
    "display_order": 16
  },
  {
    "id": "19e59e6e-5271-434c-a3b8-f61283052652",
    "question": "Qui prend en charge et conduit mon véhicule lors de la prestation ?",
    "answer": "Votre véhicule est exclusivement conduit par un chauffeur convoyeur professionnel, salarié ou partenaire indépendant sous contrat avec DK Automotive. Tous nos intervenants sont titulaires d'un permis de conduire valide depuis plusieurs années et sont habilités à la conduite de tous types de véhicules légers et utilitaires.",
    "display_order": 17
  },
  {
    "id": "ec7d11b3-71fd-4cf3-8689-9d7f8fd02285",
    "question": "Pourquoi choisir le convoyage de véhicule par la route plutôt que le transport par camion ?",
    "answer": "Le convoyage par chauffeur professionnel est plus rapide, plus flexible et souvent plus économique que le transport de véhicule par camion plateau, particulièrement pour un besoin unitaire ou urgent. Contrairement au camion porte-voiture qui nécessite de grouper les commandes et d'attendre plusieurs jours/semaines, le convoyage par la route permet une prise en charge sur mesure sous 48h maximum avec une livraison porte-à-porte directe, sans aucun risque de détérioration lors des opérations de chargement ou déchargement.",
    "display_order": 18
  },
  {
    "id": "337b73b4-4cdc-42b9-a738-9642efd59ab8",
    "question": "Comment se déroulent l'enlèvement et la livraison de mon véhicule ?",
    "answer": "Le convoyeur se présente à l'adresse et à l'heure convenues. Il effectue un état des lieux minutieux de carrosserie et d'intérieur avant de signer le bon de prise en charge avec vous. À l'arrivée, un état des lieux contradictoire de fin de mission est réalisé avec le destinataire, suivi de la remise des clés et des papiers du véhicule.",
    "display_order": 19
  },
  {
    "id": "14d8f549-e65a-42b6-abaf-e0b2d6ab6812",
    "question": "Comment suivre l'avancement du convoyage de mon véhicule en temps réel ?",
    "answer": "Oui, notre équipe reste en contact direct avec vous tout au long de la prestation. Vous recevez une confirmation dès la prise en charge du véhicule, un suivi de sa progression en cours de route et une notification dès l'arrivée à destination. Notre support client reste joignable à tout moment si vous souhaitez faire un point sur la mission.",
    "display_order": 20
  },
  {
    "id": "cf41e582-9f3a-452d-b56b-2362fa7f4f74",
    "question": "Quels sont les délais et zones de livraison pour le convoyage de voiture ?",
    "answer": "DK Automotive assure le transfert et le convoyage de véhicules sur l'ensemble de la France métropolitaine ainsi que vers les pays limitrophes (Belgique, Luxembourg, Allemagne, Suisse, Espagne, Italie). Grâce à notre réseau de convoyeurs répartis sur tout le territoire, nous garantissons une prise en charge rapide de votre voiture ou véhicule utilitaire sous 48 heures maximum après la validation de votre devis.",
    "display_order": 21
  },
  {
    "id": "1b7593e3-56da-4d32-8086-b33c343cf0d6",
    "question": "Comment est géré le niveau de carburant ou de batterie à la livraison ?",
    "answer": "De manière générale, votre véhicule vous est restitué avec un niveau de carburant ou de charge électrique au moins équivalent à celui constaté lors de la prise en charge initiale. Les consommations nécessaires au trajet sont directement gérées par notre convoyeur.\n\nOption plein / charge complète : Si vous souhaitez réceptionner votre véhicule avec le réservoir plein ou la batterie chargée à 100 %, vous pouvez en faire la demande lors de la création de votre trajet ou auprès de votre conseiller. Ce service sur-mesure est disponible moyennant une facturation supplémentaire (frais de carburant/recharge + frais de gestion).",
    "display_order": 22
  },
  {
    "id": "54e387aa-b6d2-41cb-bdc9-247420009e42",
    "question": "Qui est responsable en cas d'amende ou de PV pendant le convoyage ?",
    "answer": "DK Automotive assume l'entière responsabilité des infractions au Code de la route commises durant la mission. L'état des lieux de départ et le bon de convoyage (horodatés et géolocalisés) font foi. En cas de réception d'un procès-verbal (excès de vitesse, stationnement) survenu pendant le créneau du transfert, notre service juridique effectue les démarches de désignation pour que le procès-verbal soit immédiatement réattribué au chauffeur convoyeur.",
    "display_order": 23
  },
  {
    "id": "d227d4b9-5108-43b5-a7a3-96b6188b8f43",
    "question": "Proposez-vous la mise en main personnalisée du véhicule lors de la livraison ?",
    "answer": "Oui. Pour les concessionnaires, loueurs ou ventes à distance, nos convoyeurs peuvent effectuer une présentation explicative des fonctionnalités du véhicule (tableau de bord, connectivité, aides à la conduite, recharge électrique) directement au client final lors de la remise des clés. C'est un service idéal pour garantir un taux de satisfaction maximal dès les premiers kilomètres.",
    "display_order": 24
  },
  {
    "id": "f6ae52e6-0738-4e1a-89ef-d7e8ec1aa505",
    "question": "Que se passe-t-il si mon véhicule tombe en panne mécanique durant le trajet ?",
    "answer": "Si un voyant d'alerte s'allume ou si une panne mécanique survient (indépendamment de la conduite du chauffeur), le convoyeur s'arrête immédiatement en lieu sûr et alerte notre PC opérationnel. Nous organisons la mise en sécurité du véhicule via l'assistance et vous tenons informé en temps réel.\n\nPrise en charge par l'assurance : Si le véhicule ne peut plus poursuivre sa route, c'est l'assistance dépannage liée à notre assurance professionnelle qui prend immédiatement en charge le véhicule. Elle assure les frais de remorquage vers un garage agréé et, selon les garanties applicables, la prise en charge des réparations nécessaires. Notre priorité reste la préservation de votre véhicule et le suivi transparent de la situation jusqu'à la résolution du problème.",
    "display_order": 25
  },
  {
    "id": "a0904d6d-75fc-45f7-8296-646c2be12b85",
    "question": "Pouvez-vous récupérer ou livrer un véhicule dans une gare, un aéroport ou un parc automobile ?",
    "answer": "Absolument. Nos chauffeurs s'adaptent à vos contraintes de lieu et d'horaire : parking d'aéroport, gare SNCF, parc de stockage, concession automobile ou domicile privé. Il vous suffit de préciser l'adresse exacte lors de votre demande de devis en ligne ou d'en informer votre conseiller lors de la confirmation de la commande.",
    "display_order": 26
  },
  {
    "id": "29135b86-a9cf-4c72-a177-4db62c93e926",
    "question": "Quelle est la couverture de l'assurance pendant le transport du véhicule ?",
    "answer": "Tous nos convoyages de véhicules bénéficient d'une assurance tout risques incluse via notre partenaire Generali, garantissant chaque véhicule à hauteur de 80 000 € pendant toute la durée du convoyage. Votre voiture est ainsi intégralement protégée contre les risques d'accident, de vol ou de dommage du départ jusqu'à l'arrivée.",
    "display_order": 27
  },
  {
    "id": "76ec775c-fbe8-43ea-8390-c32ee0f7d3a6",
    "question": "Est-il possible d'organiser un convoyage de véhicule en urgence (sous 24h à 48h) ?",
    "answer": "Oui, nous proposons des prestations de convoyage express. Selon la disponibilité de nos chauffeurs et la localisation du véhicule, nous pouvons intervenir sous 24 à 48 heures pour prendre en charge et livrer votre véhicule dans les plus brefs délais.",
    "display_order": 28
  },
  {
    "id": "f898b5b7-476c-4345-925a-f043b32fa585",
    "question": "Proposez-vous le convoyage de flottes automobiles pour les entreprises ou concessions ?",
    "answer": "Oui, DK Automotive accompagne les professionnels, concessions, loueurs et gestionnaires de flottes. Nous gérons le transfert unitaire ou de multiples véhicules (mouvements de parc, transferts inter-sites, livraisons clients finaux) avec un suivi centralisé.",
    "display_order": 29
  },
  {
    "id": "c2e0622a-3ba2-4901-8d68-c000b78ceca0",
    "question": "Puis-je planifier un convoyage le week-end ou un jour férié ?",
    "answer": "Oui, nos équipes et convoyeurs peuvent effectuer des enlèvements ou des livraisons le samedi, le dimanche ou les jours fériés, sur demande préalable et selon la formule souscrite.",
    "display_order": 30
  },
  {
    "id": "57bcdbf7-eafc-4cf3-8cea-b9c173d74017",
    "question": "Proposez-vous le convoyage de véhicules neufs non immatriculés avec plaques W garage ?",
    "answer": "Oui, pour les professionnels de l'automobile, nous pouvons assurer le transfert de véhicules sous plaques W garage conformément à la réglementation en vigueur, facilitant le déplacement de véhicules neufs ou en transit administratif.",
    "display_order": 31
  },
  {
    "id": "128bbe9a-607c-4d76-b430-69a2b0f7c4cd",
    "question": "Comment se passe la livraison si le destinataire est absent lors du rendez-vous ?",
    "answer": "En cas d'imprévu, notre chauffeur prend contact avec vous ou le destinataire pour convenir d'une solution adaptée (attente, livraison à une autre adresse à proximité ou reprogrammation). Tout retard ou modification est géré en lien direct avec notre service régulation.",
    "display_order": 32
  },
  {
    "id": "f2fc6e94-09bb-478e-8dad-f158b281cc1a",
    "question": "Quels sont les moyens de paiement acceptés pour régler un convoyage ?",
    "answer": "Vous pouvez régler votre prestation en ligne de manière sécurisée par carte bancaire, par virement bancaire ou via un compte professionnel pour nos clients réguliers (facturation mensuelle disponible).",
    "display_order": 33
  },
  {
    "id": "62b7a18e-2174-4e90-a3c4-1966c38ee94f",
    "question": "En combien de temps pouvez-vous organiser un convoyage voiture depuis Paris ?",
    "answer": "Nos chauffeurs peuvent intervenir en 24h à 48h pour tout convoyage de véhicule au départ ou à destination de Paris et de sa région.",
    "display_order": 34
  }
];

export const legalMentions: LegalItem[] = [
  {
    "id": "cdb98221-4a37-4315-a8dd-7f38a4f9c77a",
    "field_key": "raison_sociale",
    "field_label": "Raison sociale",
    "field_value": "Dk Automotive",
    "display_order": 1
  },
  {
    "id": "c6b7ff4b-e693-4c5a-b661-b099cd17ee0b",
    "field_key": "forme_juridique",
    "field_label": "Forme juridique",
    "field_value": "Association",
    "display_order": 2
  },
  {
    "id": "b9fe8806-07b7-4c0e-ac1b-0f6575cf2d11",
    "field_key": "capital_social",
    "field_label": "Capital social",
    "field_value": "",
    "display_order": 3
  },
  {
    "id": "8fc35427-e8fd-4c33-a778-d4e5ffd74380",
    "field_key": "numero_immatriculation",
    "field_label": "Numéro d'immatriculation",
    "field_value": "93480596100018",
    "display_order": 4
  },
  {
    "id": "953e6dc0-4ff3-4cbb-b6dd-0d839c06d86b",
    "field_key": "siege_social",
    "field_label": "Siège social",
    "field_value": "19 RUE DE BRESSE 93000 BOBIGNY",
    "display_order": 5
  },
  {
    "id": "cdb2c60e-a443-42a0-95f9-a55e1a548b64",
    "field_key": "telephone",
    "field_label": "Téléphone",
    "field_value": "0615606285",
    "display_order": 6
  },
  {
    "id": "62b459ce-94dd-4981-aff7-5924225692c4",
    "field_key": "email",
    "field_label": "Email",
    "field_value": "contact@dkautomotive.fr",
    "display_order": 7
  },
  {
    "id": "f6171ccf-28e2-4cf5-80f6-72991a2bf3ef",
    "field_key": "directeur_publication",
    "field_label": "Directeur de la publication",
    "field_value": "Ibrahima Diakhite",
    "display_order": 8
  },
  {
    "id": "11d41b37-190a-4cf5-b27c-8d691c05c9c5",
    "field_key": "hebergement_titre",
    "field_label": "Titre - Hébergement",
    "field_value": "Hébergement du site",
    "display_order": 9
  },
  {
    "id": "778a4bc4-9c66-4a4e-8651-e945cbb84877",
    "field_key": "hebergement_contenu",
    "field_label": "Contenu - Hébergement",
    "field_value": "Le site internet de DK AUTOMOTIVE est hébergé par IONOS, dont le siège social est situé à 7, place de la Gare BP 70109 57200 Sarreguemines Cedex France et joignable par téléphone au +33 9 70 80 89 11.",
    "display_order": 10
  },
  {
    "id": "5a26b5c8-6b4e-49ca-93e9-544e1b7a814a",
    "field_key": "propriete_intellectuelle_titre",
    "field_label": "Titre - Propriété intellectuelle",
    "field_value": "Propriété intellectuelle",
    "display_order": 11
  },
  {
    "id": "c78818dd-ea9f-4a15-b3b3-16ca25177371",
    "field_key": "propriete_intellectuelle_contenu",
    "field_label": "Contenu - Propriété intellectuelle",
    "field_value": "L'ensemble des contenus du site (textes, logos, images, éléments graphiques, icônes, vidéos, etc.) sont la propriété exclusive de DK AUTOMOTIVE ou de leurs auteurs respectifs. Toute reproduction, représentation, modification, publication ou adaptation des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Dk Automotive.",
    "display_order": 12
  },
  {
    "id": "70c83655-3163-42ef-8711-6ea4da67a479",
    "field_key": "responsabilite_titre",
    "field_label": "Titre - Responsabilité",
    "field_value": "Responsabilité",
    "display_order": 13
  },
  {
    "id": "bbeef15b-093d-46ed-9c3a-7bbd27df7f76",
    "field_key": "responsabilite_contenu",
    "field_label": "Contenu - Responsabilité",
    "field_value": "Dk Automotive s'efforce de fournir des informations aussi précises que possible sur son site internet. Toutefois, la société ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour des informations fournies, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.",
    "display_order": 14
  },
  {
    "id": "4057b3bf-d433-4d33-9a70-3513c410d80c",
    "field_key": "protection_donnees_titre",
    "field_label": "Titre - Protection des données",
    "field_value": "Protection des données personnelles",
    "display_order": 15
  },
  {
    "id": "08820159-cf77-4098-96d8-dde5bd5237b6",
    "field_key": "protection_donnees_contenu",
    "field_label": "Contenu - Protection des données",
    "field_value": "Dk Automotive s'engage à préserver la confidentialité des informations fournies en ligne par l'utilisateur. Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement général sur la protection des données (RGPD), l'utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition sur ses données personnelles. Pour exercer ces droits, l'utilisateur peut contacter Dk Automotive à l'adresse email mentionnée ci-dessus.",
    "display_order": 16
  },
  {
    "id": "541aba31-c9a3-421b-a9d5-da89e58dd544",
    "field_key": "liens_hypertextes_titre",
    "field_label": "Titre - Liens hypertextes",
    "field_value": "Liens hypertextes",
    "display_order": 17
  },
  {
    "id": "2998010a-6741-4be7-8c46-f7a6539dbd3a",
    "field_key": "liens_hypertextes_contenu",
    "field_label": "Contenu - Liens hypertextes",
    "field_value": "La mise en place de liens hypertextes en direction d'autres sites internet n'engage pas la responsabilité de Dk Automotive quant au contenu de ces sites. L'établissement de liens vers le site de Dk Automotive nécessite une autorisation préalable et écrite de la société.",
    "display_order": 18
  },
  {
    "id": "26062bc0-ad9e-4cd2-a637-cf2da1f126a0",
    "field_key": "cookies_titre",
    "field_label": "Titre - Cookies",
    "field_value": "Cookies",
    "display_order": 19
  },
  {
    "id": "11e15481-a0e8-4d4e-9faf-e6550b8e6fda",
    "field_key": "cookies_contenu",
    "field_label": "Contenu - Cookies",
    "field_value": "Le site de Dk Automotive utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. En poursuivant la navigation sur le site, l'utilisateur accepte l'utilisation de cookies. L'utilisateur peut également configurer son navigateur pour refuser les cookies.",
    "display_order": 20
  }
];

export const cgvSections: ContentSection[] = [
  {
    "id": "2def0e34-fddd-470c-9fa3-3d5a8df2860d",
    "section_title": "Introduction",
    "section_content": "Les présentes Conditions Générales de Vente (CGV) régissent les ventes de prestations proposées par Dk Automotive, notamment les services de convoyage de véhicules, conclues via le site dkautomotive.fr, ses sous-domaines ou tout formulaire de commande en ligne.\nToute commande implique l’acceptation sans réserve des présentes CGV.\n",
    "display_order": 1
  },
  {
    "id": "b31a52af-3a32-4927-a334-efb84906b0fe",
    "section_title": "Description des services",
    "section_content": "Dk Automotive propose des prestations de convoyage de véhicules et services associés.\nLes caractéristiques essentielles de la prestation (lieu de départ, lieu d’arrivée, délais, tarifs) sont précisées lors de la commande via le formulaire en ligne ou par devis.\n",
    "display_order": 2
  },
  {
    "id": "47a732e0-4b9f-44d4-ad16-a7eee09f4442",
    "section_title": "Tarifs et modalités de paiement",
    "section_content": "Les prix sont exprimés en euros (€), toutes taxes comprises (TTC), sauf indication contraire.\nDk Automotive se réserve le droit de modifier ses tarifs à tout moment. Le prix applicable est celui en vigueur au jour de la commande.\n\nLes moyens de paiement acceptés sont :\n•\tCarte bancaire (CB)\n•\tPayPal\n•\tApple Pay (si disponible)\n•\tVirement bancaire \nClients professionnels\nPour les clients professionnels, le paiement intervient dans un délai de 15 jours à compter de l’envoi du devis ou de la facture, sauf conditions particulières convenues par écrit.\nLe non-paiement à l’échéance pourra entraîner :\n•\tla suspension des prestations en cours,\n•\tl’application de pénalités de retard conformément à l’article L441-10 du Code de commerce,\n•\tl’application d’une indemnité forfaitaire pour frais de recouvrement de 40 €.\nClients particuliers\nPour les clients particuliers, le paiement est exigible :\n•\tsoit au moment de la commande,\n•\tsoit avant le démarrage de la prestation,\nselon les modalités précisées lors de la commande.\nAucune prestation ne débutera sans encaissement effectif lorsque le paiement préalable est requis.\n",
    "display_order": 3
  },
  {
    "id": "d92ec4f1-c2f1-4a1a-bb07-a8ada3af6784",
    "section_title": "Responsabilité & Assurance",
    "section_content": "Dk Automotive souscrit une assurance tous risques et une assurance responsabilité civile professionnelle couvrant les dommages pouvant être causés aux véhicules transportés.\nDk Automotive est tenu à une obligation de moyens.\nSa responsabilité est strictement limitée au montant de la prestation facturée, sauf faute lourde ou intentionnelle.\n",
    "display_order": 4
  },
  {
    "id": "412dbfce-ab51-4788-ae7c-e75ebb6dce01",
    "section_title": "Annulation & Modification",
    "section_content": "Toute demande d’annulation doit être formulée par écrit.\n•\tAvant le démarrage de la prestation :\no\tDes frais d’annulation peuvent être appliqués si des démarches ont déjà été engagées.\n•\tAprès le démarrage de la prestation :\no\tAucun remboursement ne pourra être exigé.\nAucun frais n'est exigé pour une modification de la commande faite par le Client.\n",
    "display_order": 5
  },
  {
    "id": "e26eead8-8259-4df8-a062-a264579f2ee8",
    "section_title": "Règlement des litiges",
    "section_content": "En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux compétents seront ceux du ressort du siège social de Dk Automotive.",
    "display_order": 6
  },
  {
    "id": "618133a3-b84e-4485-a4fc-22716feed438",
    "section_title": "4. Commande",
    "section_content": "La commande est effectuée via un formulaire en ligne ou tout autre moyen mis à disposition par Dk Automotive.\nLa commande devient ferme et définitive dès :\n•\tla validation du formulaire,\n•\tet le paiement total ou partiel requis.\nDk Automotive se réserve le droit de refuser toute commande incomplète ou présentant un caractère anormal.\n",
    "display_order": 7
  },
  {
    "id": "afa7c028-e6ba-407f-bab7-84a5444a226c",
    "section_title": "Remboursement",
    "section_content": "Lorsqu’un remboursement est accordé :\n•\til est effectué via le moyen de paiement utilisé lors de la commande,\n•\tdans un délai maximum de 14 jours.\nAucun remboursement ne sera effectué pour une prestation intégralement réalisée.",
    "display_order": 8
  },
  {
    "id": "6d7b58eb-c09b-45ba-97bd-31ebc965395c",
    "section_title": "Obligations du client",
    "section_content": "Le client s’engage à fournir des informations exactes et complètes (coordonnées, état du véhicule, documents nécessaires).\nTout manquement pourra entraîner un report ou une annulation de la prestation sans indemnisation.",
    "display_order": 9
  },
  {
    "id": "4d9b5655-20ba-46c9-af05-138d2caf735d",
    "section_title": "Force majeure",
    "section_content": "Dk Automotive ne pourra être tenu responsable en cas d’inexécution ou de retard dû à un événement de force majeure (intempéries, accidents, pannes, grèves, etc.).",
    "display_order": 10
  },
  {
    "id": "dccd8f34-1cc0-448e-b2a4-69e089d85a73",
    "section_title": "Données personnelles",
    "section_content": "Les données personnelles collectées sont traitées conformément à la politique de confidentialité en vigueur.",
    "display_order": 11
  },
  {
    "id": "dc8ca801-8684-43f2-b7a7-019c5c175491",
    "section_title": "Droit applicable et litiges",
    "section_content": "Les présentes CGV sont soumises au droit français.\nEn cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront ceux du ressort du siège social de Dk Automotive.",
    "display_order": 12
  }
];

export const cguSections: ContentSection[] = [
  {
    "id": "54a34996-f3bf-4efa-8cd9-5103f5872b25",
    "section_title": "Introduction",
    "section_content": "Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet de définir les modalités d’accès et d’utilisation du site internet Dk Automotive, accessible à l’adresse dkautomotive.fr et à l’ensemble de ses sous-domaines.\nLe site est destiné à présenter l’activité de convoyage de véhicules de Dk Automotive auprès de clients professionnels et particuliers, ainsi qu’à permettre la prise de contact et la demande de prestations.\nToute navigation sur le site implique l’acceptation pleine et entière des présentes CGU.\n",
    "display_order": 1
  },
  {
    "id": "87ab0b92-12a7-4f04-8a7d-c4205c8f0b7d",
    "section_title": "Accès au site",
    "section_content": "L’accès au site est gratuit et ouvert à tout utilisateur disposant d’un accès à Internet.\nTous les frais liés à l’accès au site (connexion Internet, matériel informatique, logiciels, etc.) sont exclusivement à la charge de l’utilisateur.\nDk Automotive se réserve le droit de suspendre, limiter ou interrompre l’accès au site, notamment pour des raisons de maintenance, de sécurité ou de mise à jour.",
    "display_order": 2
  },
  {
    "id": "cfe3abb4-b345-40ff-8d24-fbf2b88764ed",
    "section_title": "Utilisation du site",
    "section_content": "L’utilisateur s’engage à utiliser le site de manière loyale, conforme à sa destination et à la législation en vigueur.\nIl s’interdit notamment :\n•\td’utiliser le site à des fins frauduleuses ou illicites,\n•\tde porter atteinte aux droits de tiers,\n•\tde perturber ou tenter de perturber le bon fonctionnement du site.\nLes informations présentes sur le site ont un caractère informatif et ne constituent pas, en elles-mêmes, une offre contractuelle.\n",
    "display_order": 3
  },
  {
    "id": "5deb9593-040d-4da9-811b-31914bcf628f",
    "section_title": "Propriété intellectuelle",
    "section_content": "L’ensemble des éléments composant le site (textes, images, photographies, logos, vidéos, graphismes, structure, etc.) est protégé par le droit de la propriété intellectuelle.\nToute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation écrite préalable de Dk Automotive, est strictement interdite.\n",
    "display_order": 4
  },
  {
    "id": "308bf131-9092-4d5f-bc74-c9e403b7216a",
    "section_title": "Protection des données personnelles",
    "section_content": "Les données personnelles collectées font l'objet d'un traitement conforme à notre politique de confidentialité.",
    "display_order": 5
  },
  {
    "id": "badf1dca-f9a4-4c81-aea6-95cbe0290b43",
    "section_title": "Limitation de responsabilité",
    "section_content": "Dk Automotive ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site.\nDk Automotive met en œuvre tous les moyens raisonnables pour assurer l’exactitude des informations diffusées sur le site.\nToutefois, Dk Automotive ne saurait être tenu responsable :\n•\tdes erreurs ou omissions présentes sur le site,\n•\tdes interruptions ou dysfonctionnements du site,\n•\tdes dommages directs ou indirects résultant de l’utilisation du site.\n",
    "display_order": 6
  },
  {
    "id": "1abd6a31-0523-491b-99f4-733f45aebfbe",
    "section_title": "Modifications des CGU",
    "section_content": "Dk Automotive se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site.",
    "display_order": 7
  },
  {
    "id": "1ca2b0d5-c66c-42a5-841a-d8bbe470177c",
    "section_title": "Données personnelles",
    "section_content": "Les données personnelles collectées via le site sont traitées conformément à la réglementation en vigueur et à la politique de confidentialité de Dk Automotive.\nL’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données personnelles.",
    "display_order": 8
  },
  {
    "id": "85a08fb0-098d-4399-8660-559a5142c803",
    "section_title": "Liens externes",
    "section_content": "Le site peut contenir des liens vers des sites tiers. Dk Automotive n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
    "display_order": 9
  },
  {
    "id": "05636b81-ccf5-4cee-ab7c-ea9e56f842e6",
    "section_title": "Modifications des CGU",
    "section_content": "Dk Automotive se réserve le droit de modifier les présentes CGU à tout moment.\nLes CGU applicables sont celles en vigueur au jour de la consultation du site.",
    "display_order": 10
  },
  {
    "id": "0976a936-dba5-4246-895e-7f95260876a1",
    "section_title": "Droit applicable",
    "section_content": "Les présentes CGU sont soumises au droit français.",
    "display_order": 11
  }
];

export const privacyPolicySections: ContentSection[] = [
  {
    "id": "ec0689a5-7254-4810-b3a8-b3c54c11ad0e",
    "section_key": "introduction",
    "section_title": "Introduction",
    "section_content": "Dk Automotive accorde une grande importance à la protection de la vie privée de ses utilisateurs. La présente politique de confidentialité vise à vous informer sur les données personnelles que nous collectons, la manière dont nous les utilisons et les mesures que nous prenons pour assurer leur sécurité.",
    "display_order": 1
  },
  {
    "id": "0b666132-d7e1-477b-a959-f8f419b97208",
    "section_key": "collecte_donnees",
    "section_title": "Collecte des données personnelles",
    "section_content": "Dans le cadre de l'utilisation de notre site web et de nos services, nous sommes amenés à collecter certaines données personnelles vous concernant. Ces données peuvent inclure, sans s'y limiter : Vos coordonnées (nom, prénom, adresse e-mail, numéro de téléphone, adresse postale) ; Vos informations de connexion (identifiant, mot de passe) ; Vos informations de facturation et de paiement ; Vos préférences et habitudes de navigation ; Toute autre information que vous nous fournissez volontairement.",
    "display_order": 2
  },
  {
    "id": "7b94d67f-d5f0-45fd-847a-c17db32b1d60",
    "section_key": "utilisation_donnees",
    "section_title": "Utilisation des données personnelles",
    "section_content": "Nous utilisons les données personnelles collectées pour les finalités suivantes : Gérer et exécuter vos commandes ; Répondre à vos demandes de renseignements et vous assister ; Améliorer nos services et l'expérience utilisateur ; Personnaliser le contenu du site en fonction de vos préférences ; Vous envoyer des informations commerciales et promotionnelles, si vous y avez consenti ; Réaliser des analyses et des statistiques ; Respecter nos obligations légales et réglementaires.",
    "display_order": 3
  },
  {
    "id": "4fd01288-b6e6-463f-aa0a-be3ffac7ac64",
    "section_key": "partage_donnees",
    "section_title": "Partage des données personnelles",
    "section_content": "Nous nous engageons à ne pas vendre, louer ou échanger vos données personnelles avec des tiers sans votre consentement. Cependant, nous pouvons partager vos données personnelles avec des prestataires de services qui nous aident à gérer notre site web et à fournir nos services (hébergement, maintenance, paiement, etc.). Ces prestataires sont tenus de respecter la confidentialité de vos données et de les utiliser uniquement dans le cadre des services qu'ils nous fournissent.\n\nVos données sont traitées par nos prestataires de services de confiance agissant en tant que sous-traitants :\n\nSupabase Inc. pour l'hébergement de la base de données et la gestion de l'authentification (Données stockées en Europe (West EU Paris).\n\nVercel Inc. pour l'hébergement du site et les analyses d'audience techniques.\n\nGoogle Ireland Ltd. pour l'affichage de services cartographiques (Google Maps).\n\nCertains traitements peuvent entraîner des transferts de données hors de l’Union Européenne. Ces transferts sont encadrés par des Clauses Contractuelles Types (CCT) de la Commission Européenne pour garantir un niveau de protection adéquat.",
    "display_order": 4
  },
  {
    "id": "f89cc636-c76f-4bce-9125-62d8ee057ff8",
    "section_key": "conservation_donnees",
    "section_title": "Conservation des données personnelles",
    "section_content": "Nous veillons à ne conserver vos données personnelles que pendant la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées, conformément à la réglementation en vigueur :\n\nDonnées relatives à votre compte utilisateur (Supabase) : Vos données d'identification et de profil sont conservées tant que votre compte est actif. En cas d'inactivité prolongée (absence de connexion), vos données seront supprimées. Bien entendu, vous pouvez demander la suppression de votre compte à tout moment, ce qui entraînera l'effacement immédiat de vos données d'accès.\n\nDonnées de facturation et de paiement : Conformément à l'article L123-22 du Code de commerce, les pièces justificatives relatives à vos transactions (factures, bons de commande) sont conservées pendant une durée de 10 ans à titre de preuve comptable et fiscale.\n\nDonnées de navigation et analytiques (Vercel) : Les données collectées via nos outils d'analyse sont conservées pour une durée maximale de 13 mois, après quoi elles sont supprimées ou agrégées de manière anonyme.\n\nDonnées de contact (Formulaires) : Si vous nous contactez via l'adresse e-mail de support sans avoir de compte client, vos données sont conservées pendant la durée nécessaire au traitement de votre demande, puis supprimées après un délai maximum de 2 ans après le dernier contact.",
    "display_order": 5
  },
  {
    "id": "fe77c8b8-aafe-4df0-9d42-1814df798e75",
    "section_key": "securite_donnees",
    "section_title": "Sécurité des données personnelles",
    "section_content": "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation, la modification ou la destruction. Ces mesures incluent notamment le cryptage des données, l'utilisation de pare-feu et de systèmes de détection d'intrusion, ainsi que la formation de notre personnel aux bonnes pratiques en matière de protection des données.",
    "display_order": 6
  },
  {
    "id": "45600a83-b9f2-4906-a67d-599053b7abcc",
    "section_key": "vos_droits",
    "section_title": "Vos droits",
    "section_content": "Conformément à la législation en vigueur, vous disposez de plusieurs droits concernant vos données personnelles : Le droit d'accès : vous pouvez demander à accéder à vos données personnelles ; Le droit de rectification : vous pouvez demander à corriger ou mettre à jour vos données personnelles ; Le droit à l'effacement : vous pouvez demander la suppression de vos données personnelles, dans la mesure permise par la loi ; Le droit à la limitation du traitement : vous pouvez demander à limiter le traitement de vos données personnelles ; Le droit à la portabilité : vous pouvez demander à recevoir vos données personnelles dans un format structuré, couramment utilisé et lisible par machine, ou demander leur transfert à un autre responsable de traitement, lorsque cela est techniquement possible ; Le droit d'opposition : vous pouvez vous opposer au traitement de vos données personnelles pour des raisons tenant à votre situation particulière ; Le droit de retirer votre consentement : lorsque le traitement de vos données personnelles repose sur votre consentement, vous pouvez le retirer à tout moment.",
    "display_order": 7
  },
  {
    "id": "e16497c4-3028-4648-95e5-f68c4843dfac",
    "section_key": "modifications_politique",
    "section_title": "Modifications de la politique de confidentialité",
    "section_content": "Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute modification sera publiée sur notre site web avec une date d'entrée en vigueur. Nous vous invitons à consulter régulièrement cette page pour vous tenir informé des éventuelles mises à jour.",
    "display_order": 8
  },
  {
    "id": "52df4ed6-77b6-44bf-aca7-a57b08010fb0",
    "section_key": "contact",
    "section_title": "Contact",
    "section_content": "Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité, vous pouvez nous contacter à l'adresse e-mail suivante : contact@dkautomotive.fr",
    "display_order": 9
  }
];

export const cookieManagementSections: ContentSection[] = [
  {
    "id": "26ae9d3b-9f5f-4150-a863-4835bff68d38",
    "section_key": "introduction",
    "section_title": "Qu'est-ce qu'un cookie ?",
    "section_content": "Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site Internet. Il permet de reconnaître votre navigateur et de conserver certaines informations vous concernant.",
    "display_order": 1
  },
  {
    "id": "8aedb10d-a85f-4181-8af2-1e927f409850",
    "section_key": "utilisation",
    "section_title": "Utilisation des cookies sur notre site",
    "section_content": "Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser l'utilisation de notre site. Ces cookies nous permettent de mémoriser vos préférences de navigation, analyser le trafic et l'utilisation de notre site, et améliorer nos services.\n\nNom / Fournisseur,Type,Finalité,Durée : \nsb-access-token (Supabase),Essentiel,Maintien de la session utilisateur (Auth).,Session\n_vercel_jwt (Vercel),Essentiel,Sécurité et performance de l'hébergement.,Session\nNID / SID (Google Maps),Fonctionnel,Mémorise les préférences de l'utilisateur sur la carte.,6 mois",
    "display_order": 2
  },
  {
    "id": "263aa7c5-f4cb-4ecc-b139-5db8ec45a1b1",
    "section_key": "gestion",
    "section_title": "Gestion de vos cookies",
    "section_content": "Vous pouvez à tout moment modifier vos préférences concernant les cookies via les paramètres de votre navigateur. Pour plus d'informations sur la gestion des cookies, consultez l'aide de votre navigateur.",
    "display_order": 3
  },
  {
    "id": "ef214b69-580c-43f1-a352-530d42e57023",
    "section_key": "contact",
    "section_title": "Contact",
    "section_content": "Pour toute question concernant notre politique de cookies, contactez-nous à : contact@dkautomotive.fr",
    "display_order": 4
  }
];
