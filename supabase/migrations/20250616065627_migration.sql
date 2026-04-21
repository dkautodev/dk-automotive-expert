
-- Ajouter la colonne updated_by à la table cookie_management
ALTER TABLE public.cookie_management 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Mettre à jour les enregistrements existants avec une valeur par défaut
UPDATE public.cookie_management 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;
