
-- Ajouter la colonne updated_by aux tables manquantes

-- Table cgu_content
ALTER TABLE public.cgu_content 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Table cgv_content
ALTER TABLE public.cgv_content 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Table faq_items
ALTER TABLE public.faq_items 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Table legal_mentions
ALTER TABLE public.legal_mentions 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Table privacy_policy
ALTER TABLE public.privacy_policy 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Table professional_space_settings
ALTER TABLE public.professional_space_settings 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Table profiles
ALTER TABLE public.profiles 
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Mettre à jour les enregistrements existants avec une valeur par défaut pour toutes les tables
UPDATE public.cgu_content 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;

UPDATE public.cgv_content 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;

UPDATE public.faq_items 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;

UPDATE public.legal_mentions 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;

UPDATE public.privacy_policy 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;

UPDATE public.professional_space_settings 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;

UPDATE public.profiles 
SET updated_by = (SELECT id FROM auth.users LIMIT 1)
WHERE updated_by IS NULL;
