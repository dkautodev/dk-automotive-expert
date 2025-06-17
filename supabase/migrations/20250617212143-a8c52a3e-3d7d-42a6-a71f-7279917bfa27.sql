
-- Create table for About page content
CREATE TABLE public.about_page_contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL DEFAULT 'about',
  block_key TEXT NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('text', 'image', 'html')),
  content_value TEXT,
  content_json JSONB,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.about_page_contents ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all about content" 
  ON public.about_page_contents 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can insert about content" 
  ON public.about_page_contents 
  FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update about content" 
  ON public.about_page_contents 
  FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admins can delete about content" 
  ON public.about_page_contents 
  FOR DELETE 
  USING (public.is_admin());

-- Create trigger for updated_at
CREATE TRIGGER about_page_contents_updated_at
  BEFORE UPDATE ON public.about_page_contents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for the About page
INSERT INTO public.about_page_contents (block_key, block_type, content_json, display_order) VALUES
('hero_title', 'text', '{"title": "À propos de DK Automotive"}', 1),
('hero_subtitle', 'text', '{"subtitle": "Votre partenaire de confiance pour le convoyage automobile"}', 2),
('hero_image', 'image', '{"url": ""}', 3),
('intro_title', 'text', '{"title": "Notre expertise à votre service"}', 4),
('intro_content', 'text', '{"content": "Depuis notre création, DK Automotive s''est spécialisée dans le convoyage automobile avec une approche professionnelle et personnalisée."}', 5),
('team_title', 'text', '{"title": "Une équipe d''experts"}', 6),
('team_content', 'text', '{"content": "Nos chauffeurs expérimentés maîtrisent parfaitement les techniques de conduite et connaissent les routes françaises comme leur poche."}', 7),
('team_image', 'image', '{"url": ""}', 8),
('values_title', 'text', '{"title": "Nos valeurs"}', 9),
('value_1', 'text', '{"title": "Fiabilité", "content": "Ponctualité et respect des engagements"}', 10),
('value_2', 'text', '{"title": "Sécurité", "content": "Protection optimale de votre véhicule"}', 11),
('value_3', 'text', '{"title": "Professionnalisme", "content": "Service de qualité supérieure"}', 12),
('services_title', 'text', '{"title": "Nos services"}', 13),
('services_content', 'text', '{"content": "Convoyage particuliers, professionnels, livraison concessions, transport véhicules de luxe et collection."}', 14),
('contact_title', 'text', '{"title": "Contactez-nous"}', 15),
('contact_content', 'text', '{"content": "Prêt à confier votre véhicule à nos experts ? Demandez votre devis personnalisé dès maintenant."}', 16);
