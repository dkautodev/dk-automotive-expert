
-- Insérer une entrée pour le logo dans la table page_contents
INSERT INTO public.page_contents (
  page_slug,
  block_key,
  block_type,
  content_value,
  display_order,
  is_active
) VALUES (
  'navbar',
  'logo',
  'image',
  '/upload/64b69a10-c303-48f4-9b56-7bee8e58a109.png',
  1,
  true
)
ON CONFLICT (page_slug, block_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  is_active = EXCLUDED.is_active;
