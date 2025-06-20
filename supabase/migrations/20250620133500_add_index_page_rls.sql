
-- Créer une politique pour permettre à tous les utilisateurs (y compris non authentifiés) de lire le contenu de la page d'accueil
CREATE POLICY "Anyone can view index page content" 
  ON public.page_contents 
  FOR SELECT 
  USING (page_slug = 'index' AND is_active = true);
