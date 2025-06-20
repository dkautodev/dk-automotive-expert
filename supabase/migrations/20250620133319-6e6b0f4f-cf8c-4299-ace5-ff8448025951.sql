
-- Ajouter le contenu manquant pour la section hero de la page d'accueil
INSERT INTO public.page_contents (page_slug, block_key, block_type, content_json, display_order) VALUES
-- Section Hero principale avec le contenu de l'image
('index', 'hero_main_title', 'text', '{"title": "CONVOYAGE DE VÉHICULES PAR ROUTE EN FRANCE"}', 1),
('index', 'hero_point_1', 'text', '{"text": "Convoyage sur mesure et économique"}', 2),
('index', 'hero_point_2', 'text', '{"text": "Engagement Éco-responsable"}', 3),
('index', 'hero_point_3', 'text', '{"text": "Livraison rapide et sécurisée"}', 4),
('index', 'hero_description', 'text', '{"content": "Confiez-nous le convoyage de vos véhicules, pour un service sur mesure, écologique et économique."}', 5),
('index', 'hero_background_image', 'image', '{"url": "/lovable-uploads/9b842de2-bbc7-4b55-9e95-7820cb3f7e87.png"}', 6)

ON CONFLICT (page_slug, block_key) DO UPDATE SET
  content_json = EXCLUDED.content_json,
  display_order = EXCLUDED.display_order,
  updated_at = now();
