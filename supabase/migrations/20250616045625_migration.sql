
-- Créer la table pour les mentions légales
CREATE TABLE public.legal_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_key TEXT NOT NULL UNIQUE,
  field_label TEXT NOT NULL,
  field_value TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter un trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_legal_mentions_updated_at
  BEFORE UPDATE ON public.legal_mentions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer les données des mentions légales basées sur l'image fournie
INSERT INTO public.legal_mentions (field_key, field_label, field_value, display_order) VALUES
('raison_sociale', 'Raison sociale', 'DK AUTOMOTIVE', 1),
('forme_juridique', 'Forme juridique', 'Association', 2),
('capital_social', 'Capital social', '', 3),
('numero_immatriculation', 'Numéro d''immatriculation', '93480596100018', 4),
('siege_social', 'Siège social', '19 RUE DE BRESSE 93000 BOBIGNY', 5),
('telephone', 'Téléphone', '', 6),
('email', 'Email', 'contact@dkautomotive.fr', 7),
('directeur_publication', 'Directeur de la publication', 'CarXprtz, 9 rue des colonnes, 75002 PARIS', 8);

-- Créer un index pour optimiser les requêtes par ordre d'affichage
CREATE INDEX idx_legal_mentions_display_order ON public.legal_mentions(display_order);
