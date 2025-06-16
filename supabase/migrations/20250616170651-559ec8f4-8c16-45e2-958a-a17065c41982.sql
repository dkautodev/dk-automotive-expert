
-- Create table for privacy policy content
CREATE TABLE public.privacy_policy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_title TEXT NOT NULL,
  section_content TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial data from the existing static content
INSERT INTO public.privacy_policy (section_key, section_title, section_content, display_order) VALUES
('introduction', 'Introduction', 'DK AUTOMOTIVE accorde une grande importance à la protection de la vie privée de ses utilisateurs. La présente politique de confidentialité vise à vous informer sur les données personnelles que nous collectons, la manière dont nous les utilisons et les mesures que nous prenons pour assurer leur sécurité.', 1),
('collecte_donnees', 'Collecte des données personnelles', 'Dans le cadre de l''utilisation de notre site web et de nos services, nous sommes amenés à collecter certaines données personnelles vous concernant. Ces données peuvent inclure, sans s''y limiter : Vos coordonnées (nom, prénom, adresse e-mail, numéro de téléphone, adresse postale) ; Vos informations de connexion (identifiant, mot de passe) ; Vos informations de facturation et de paiement ; Vos préférences et habitudes de navigation ; Toute autre information que vous nous fournissez volontairement.', 2),
('utilisation_donnees', 'Utilisation des données personnelles', 'Nous utilisons les données personnelles collectées pour les finalités suivantes : Gérer et exécuter vos commandes ; Répondre à vos demandes de renseignements et vous assister ; Améliorer nos services et l''expérience utilisateur ; Personnaliser le contenu du site en fonction de vos préférences ; Vous envoyer des informations commerciales et promotionnelles, si vous y avez consenti ; Réaliser des analyses et des statistiques ; Respecter nos obligations légales et réglementaires.', 3),
('partage_donnees', 'Partage des données personnelles', 'Nous nous engageons à ne pas vendre, louer ou échanger vos données personnelles avec des tiers sans votre consentement. Cependant, nous pouvons partager vos données personnelles avec des prestataires de services qui nous aident à gérer notre site web et à fournir nos services (hébergement, maintenance, paiement, etc.). Ces prestataires sont tenus de respecter la confidentialité de vos données et de les utiliser uniquement dans le cadre des services qu''ils nous fournissent.', 4),
('conservation_donnees', 'Conservation des données personnelles', 'Nous conservons vos données personnelles aussi longtemps que nécessaire pour réaliser les finalités pour lesquelles elles ont été collectées et conformément aux exigences légales et réglementaires en vigueur. Une fois ces finalités atteintes, vos données seront supprimées ou anonymisées.', 5),
('securite_donnees', 'Sécurité des données personnelles', 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l''accès non autorisé, la divulgation, la modification ou la destruction. Ces mesures incluent notamment le cryptage des données, l''utilisation de pare-feu et de systèmes de détection d''intrusion, ainsi que la formation de notre personnel aux bonnes pratiques en matière de protection des données.', 6),
('vos_droits', 'Vos droits', 'Conformément à la législation en vigueur, vous disposez de plusieurs droits concernant vos données personnelles : Le droit d''accès : vous pouvez demander à accéder à vos données personnelles ; Le droit de rectification : vous pouvez demander à corriger ou mettre à jour vos données personnelles ; Le droit à l''effacement : vous pouvez demander la suppression de vos données personnelles, dans la mesure permise par la loi ; Le droit à la limitation du traitement : vous pouvez demander à limiter le traitement de vos données personnelles ; Le droit à la portabilité : vous pouvez demander à recevoir vos données personnelles dans un format structuré, couramment utilisé et lisible par machine, ou demander leur transfert à un autre responsable de traitement, lorsque cela est techniquement possible ; Le droit d''opposition : vous pouvez vous opposer au traitement de vos données personnelles pour des raisons tenant à votre situation particulière ; Le droit de retirer votre consentement : lorsque le traitement de vos données personnelles repose sur votre consentement, vous pouvez le retirer à tout moment.', 7),
('modifications_politique', 'Modifications de la politique de confidentialité', 'Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute modification sera publiée sur notre site web avec une date d''entrée en vigueur. Nous vous invitons à consulter régulièrement cette page pour vous tenir informé des éventuelles mises à jour.', 8),
('contact', 'Contact', 'Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité, vous pouvez nous contacter à l''adresse e-mail suivante : contact@dkautomotive.com.', 9);

-- Add trigger for updated_at
CREATE TRIGGER update_privacy_policy_updated_at
  BEFORE UPDATE ON public.privacy_policy
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
