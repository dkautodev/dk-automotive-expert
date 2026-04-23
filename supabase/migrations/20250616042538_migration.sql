
-- Table pour stocker les contenus modifiables des pages
CREATE TABLE public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL, -- 'index', 'contact', etc.
  block_key text NOT NULL, -- identifiant unique du bloc
  block_type text NOT NULL, -- 'text', 'image', 'html'
  content_value text, -- contenu texte ou URL d'image
  content_json jsonb, -- pour contenus complexes (titre + description, etc.)
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Index unique pour éviter les doublons
CREATE UNIQUE INDEX idx_page_block_unique ON public.page_contents(page_slug, block_key);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_page_contents_page_slug ON public.page_contents(page_slug);
CREATE INDEX idx_page_contents_active ON public.page_contents(is_active);

-- Activer RLS
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique (pour afficher le contenu sur le site)
CREATE POLICY "Public can read active page contents" 
ON public.page_contents 
FOR SELECT 
USING (is_active = true);

-- Politique pour les admins (lecture/écriture complète)
-- Note: nécessitera une table admin_users ou un système de rôles
CREATE POLICY "Authenticated users can manage page contents" 
ON public.page_contents 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour auto-update
CREATE TRIGGER update_page_contents_updated_at 
    BEFORE UPDATE ON public.page_contents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Créer le bucket pour les images de la page d'accueil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('page-images', 'page-images', true);

-- Politique de lecture publique pour le bucket
CREATE POLICY "Public can view page images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'page-images');

-- Politique d'upload pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload page images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'page-images' AND auth.role() = 'authenticated');

-- Politique de mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update page images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'page-images' AND auth.role() = 'authenticated');

-- Politique de suppression pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete page images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'page-images' AND auth.role() = 'authenticated');

-- Insérer les blocs par défaut de la page d'accueil
INSERT INTO public.page_contents (page_slug, block_key, block_type, content_json) VALUES
('index', 'hero_title', 'text', '{"title": "Convoyage de véhicules par route en France"}'),
('index', 'hero_description', 'text', '{"description": "Confiez-nous le convoyage de vos véhicules, pour un service sur mesure, écologique et économique."}'),
('index', 'hero_background', 'image', '{"url": "/upload/51603c32-87b6-4e5d-ab03-7352caca679d.png"}'),
('index', 'trust_point_1', 'text', '{"text": "Convoyage sur mesure et économique"}'),
('index', 'trust_point_2', 'text', '{"text": "Engagement Éco-responsable"}'),
('index', 'trust_point_3', 'text', '{"text": "Livraison rapide et sécurisée"}'),
('index', 'section_expertise_title', 'text', '{"title": "EXPERTISE ET DÉVOUEMENT DES CHAUFFEURS"}'),
('index', 'section_expertise_content', 'text', '{"content": "Chez DK AUTOMOTIVE, nos chauffeurs professionnels ont été sélectionnés pour leur expérience et leur engagement exceptionnels. Formés à des procédures strictes et à l''écoconduite, ils garantissent un convoyage sûr et écologique de votre véhicule."}'),
('index', 'section_expertise_image', 'image', '{"url": "/upload/2849f1ca-ef57-425c-8271-11ee1da479e6.jpg"}'),
('index', 'section_delais_title', 'text', '{"title": "DÉLAIS DE LIVRAISON RAPIDES"}'),
('index', 'section_delais_content', 'text', '{"content": "DK AUTOMOTIVE se distingue par la réduction significative des délais de livraison. Avec une garantie de prise en charge rapide sous 48h, nous offrons un service rapide et fiable en France."}'),
('index', 'section_delais_image', 'image', '{"url": "/upload/38340b13-78ba-4ae6-ba15-9851924dcf27.jpg"}'),
('index', 'section_tarification_title', 'text', '{"title": "TARIFICATION TRANSPARENTE ET PERSONNALISÉE"}'),
('index', 'section_tarification_content', 'text', '{"content": "Nous offrons des tarifs transparents et adaptés, incluant tous les frais, pour répondre aux besoins uniques de chaque client, avec un engagement pour un service éco-responsable."}'),
('index', 'section_tarification_image', 'image', '{"url": "/upload/e26f2a44-10f8-4ea8-bf96-6fe52fe1cf18.jpg"}'),
('index', 'step_1_title', 'text', '{"title": "JE REMPLIS LE FORMULAIRE DE DEVIS"}'),
('index', 'step_1_description', 'text', '{"description": "Je remplis le formulaire de devis en vérifiant correctement mes informations."}'),
('index', 'step_2_title', 'text', '{"title": "APPEL AVEC UN CONSEILLER"}'),
('index', 'step_2_description', 'text', '{"description": "Un conseiller vous rappelle pour planifier votre convoyage."}'),
('index', 'step_3_title', 'text', '{"title": "CONVOYAGE DE VOTRE VÉHICULE"}'),
('index', 'step_3_description', 'text', '{"description": "J''accepte mon devis et votre projet est réalisé à la date et heure convenue."}'
);
