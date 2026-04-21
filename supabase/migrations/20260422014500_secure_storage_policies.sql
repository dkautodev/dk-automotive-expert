-- Sécurisation du bucket page-images : seul l'admin peut modifier le contenu
-- On commence par supprimer les anciennes politiques laxistes

DROP POLICY IF EXISTS "Authenticated users can upload page images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update page images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete page images" ON storage.objects;

-- Les visiteurs peuvent toujours voir les images
-- (La politique "Public can view page images" existe déjà et est correcte)

-- Seuls les administrateurs peuvent ajouter des images
CREATE POLICY "Only admins can upload page images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'page-images' AND public.is_admin());

-- Seuls les administrateurs peuvent modifier des images
CREATE POLICY "Only admins can update page images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'page-images' AND public.is_admin());

-- Seuls les administrateurs peuvent supprimer des images
CREATE POLICY "Only admins can delete page images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'page-images' AND public.is_admin());
