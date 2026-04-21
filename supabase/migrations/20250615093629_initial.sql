
-- 1. Table des administrateurs (admin_users)
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table des contenus éditables (page_contents)
CREATE TABLE public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,                     -- ex : "home", "contact", etc.
  block_key TEXT NOT NULL,                -- ex : "hero_title", "photo_1", etc.
  content_type TEXT NOT NULL,             -- ex : "text", "image", "html", "json"
  content_value TEXT,                     -- valeur stockée (texte brut, lien, json ou html)
  description TEXT,                       -- description/admin info
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by uuid REFERENCES public.admin_users(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX page_block_unique ON public.page_contents(page, block_key);

-- RLS : accès aux données seulement pour les admins loggés
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

-- RLS pour admin_users : accès en lecture uniquement à soi-même
CREATE POLICY "Self-read admin info"
  ON public.admin_users
  FOR SELECT
  USING (auth.uid()::uuid = id);

-- RLS pour page_contents : lecture/écriture seulement pour les admins loggés
CREATE POLICY "Admins can read/write all page contents"
  ON public.page_contents
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users u WHERE u.id = auth.uid()::uuid));
