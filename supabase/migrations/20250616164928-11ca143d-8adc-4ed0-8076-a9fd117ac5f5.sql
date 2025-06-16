
-- Créer la table pour les FAQ
CREATE TABLE public.faq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter un trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer les FAQ existantes de la page FAQ
INSERT INTO public.faq_items (question, answer, display_order) VALUES
('QU''EST-CE QUE LE CONVOYAGE DE VÉHICULES ?', 'Le convoyage de véhicules consiste à déplacer un véhicule d''un point A à un point B, que ce soit pour de longues ou courtes distances. Cela peut inclure la livraison de véhicules neufs, le rapatriement de voitures d''occasion, ou le transfert de véhicules entre différentes agences ou sites.', 1),
('COMMENT ÇA MARCHE ?', 'Vous pouvez faire une demande de prise en charge notre formulaire en ligne dans la rubrique « Obtenir mon devis », ou en nous envoyant un email avec les détails de votre demande. Nous vous fournirons un devis et organiserons le transport selon vos besoins.', 2),
('LE CONVOYAGE EST-IL SÉCURISÉ POUR MON VÉHICULE ?', 'Oui, nous prenons toutes les mesures nécessaires pour assurer la sécurité de votre véhicule pendant le transport. Nos convoyeurs professionnels veillent à ce que votre voiture arrive en bon état. En outre, nous offrons des options d''assurance pour plus de tranquillité d''esprit.', 3),
('QUELS DOCUMENTS SONT NÉCESSAIRES POUR LE CONVOYAGE ?', 'Vous aurez besoin de fournir des documents tels que la carte grise du véhicule, l''assurance, et éventuellement procès verbaux de livraison et/restitution. Nous vous indiquerons les documents exacts nécessaires lors de la réservation.', 4),
('QUE CONTIENT LE PRIX DE LA PRESTATION ?', 'Le coût du convoyage dépend de plusieurs facteurs, tels que la distance, le type de véhicule, et le niveau de service choisi. Nous vous fournirons un devis détaillé avant le début du service.', 5),
('QUE FAIRE SI MON VÉHICULE ARRIVE ENDOMMAGÉ ?', 'Nous prenons des mesures pour éviter tout dommage. Si vous constatez des anomalies à la livraison de votre véhicule, veuillez nous en informer immédiatement. Nous avons une procédure en place pour traiter les réclamations et nous nous engageons à résoudre tout problème rapidement.', 6),
('POURQUOI CHOISIR UN CONVOYAGE DE VÉHICULE PAR LA ROUTE AVEC UN CHAUFFEUR PROFESSIONNEL ?', 'Le convoyage auto est une solution avantageuse qui permet de disposer de votre véhicule lors de votre arrivée. Vous n''êtes pas obligé de vous préoccuper du voyage de votre véhicule entre le lieu de départ et la destination finale. De plus, cette solution de transport permet de réduire considérablement les délais de livraison. Dès lors que votre prise en charge confirmée par nos services, DK AUTOMOTIVE s''engage à livrer votre véhicule dans un délai de 24 à 48 heures maximum, quel que soit le lieu d''enlèvement et de livraison.', 7),
('QUELS SONT LES TYPES DE VÉHICULES QUE VOUS POUVEZ TRANSPORTER ?', 'Il vous suffit de nous indiquer les adresses d''enlèvement et de livraison, la date souhaitée pour le transport et le type de véhicule à convoyer. Nous vous soumettons ensuite un devis personnalisé comprenant le transfert du véhicule entre les deux adresses, ainsi que les frais de route (péages, carburant, etc.) et les éventuels frais annexes (mise en main du véhicule, nettoyage intérieur, etc.). Le devis est gratuit et sans engagement.', 8),
('LE VÉHICULE DOIT-IL ÊTRE EN PARFAIT ÉTAT DE FONCTIONNEMENT POUR LE CONVOYAGE ?', 'Bien que nous puissions transporter des véhicules en bon état de marche, nous recommandons que le véhicule soit en état de fonctionnement pour éviter tout problème pendant le transport. Si des réparations sont nécessaires avant le convoyage, veuillez nous en informer.', 9),
('COMMENT SONT FORMÉS VOS CHAUFFEURS ?', 'Tous nos chauffeurs sont formés aux différentes procédures indispensables pour assurer un convoyage sûr et respectueux de l''environnement. Ils suivent une formation rigoureuse à l''éco-conduite, à la connaissance technique des différents véhicules et à la réalisation de mises en main de véhicules. Nous accordons une importance primordiale à la formation continue de nos chauffeurs pour garantir un service de qualité à nos clients.', 10),
('QUE SE PASSE-T-IL SI JE DOIS MODIFIER OU ANNULER MA COMMANDE ?', 'Vous pouvez modifier votre réservation en nous contactant directement. Vous pouvez annuler votre commande sans pénalités financières si l''annulation intervient jusqu''à 48h avant la date de début de disponibilité du véhicule. Si vous annulez une commande moins de 48h avant la prise en charge du véhicule, nous facturerons 50% du montant de la commande.', 11);

-- Créer un index pour optimiser les requêtes par ordre d'affichage
CREATE INDEX idx_faq_items_display_order ON public.faq_items(display_order);
