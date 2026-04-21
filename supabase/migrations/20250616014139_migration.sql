
-- Supprimer les politiques RLS sur admin_users
DROP POLICY IF EXISTS "Self-read admin info" ON public.admin_users;

-- Supprimer les politiques RLS sur page_contents qui référencent admin_users
DROP POLICY IF EXISTS "Admins can read/write all page contents" ON public.page_contents;

-- Supprimer la table page_contents (qui référence admin_users)
DROP TABLE IF EXISTS public.page_contents;

-- Supprimer la table admin_users
DROP TABLE IF EXISTS public.admin_users;
