
-- Ajouter les contenus manquants pour les sections
INSERT INTO public.page_contents (page_slug, block_key, block_type, content_json, display_order) VALUES
-- Section expertise - contenu additionnel
('index', 'section_expertise_subtitle', 'text', '{"subtitle": "Prêt à découvrir la différence avec nos services de convoyage professionnels ? Contactez-nous sans plus tarder !"}', 9),

-- Section délais - points détaillés
('index', 'section_delais_point_1', 'text', '{"text": "Réduction significative des délais"}', 11),
('index', 'section_delais_point_2', 'text', '{"text": "Prise en charge rapide sous 48h maximum"}', 12),
('index', 'section_delais_point_3', 'text', '{"text": "Service fiable et étendu"}', 13),

-- Section tarification - points détaillés
('index', 'section_tarification_point_1', 'text', '{"text": "Tarifs transparents et adaptés"}', 15),
('index', 'section_tarification_point_2', 'text', '{"text": "Service inclusif sans frais cachés"}', 16),
('index', 'section_tarification_point_3', 'text', '{"text": "Engagement éco-responsable"}', 17),

-- Section CTA après tarification
('index', 'section_tarification_cta_text', 'text', '{"text": "Prêt à découvrir la différence avec nos services de convoyage professionnels ? Contactez-nous ou faites une demande de devis personnalisée adaptée à vos besoins de transport."}', 18),

-- Section confiance
('index', 'trust_section_title', 'text', '{"title": "FAITES CONFIANCE À DK AUTOMOTIVE"}', 19),
('index', 'trust_section_subtitle', 'text', '{"subtitle": "L''EXPERT DU CONVOYAGE SUR ROUTE"}', 20),
('index', 'trust_section_description', 'text', '{"description": "Pourquoi choisir DK AUTOMOTIVE pour vos besoins en convoyage de véhicules :"}', 21),

-- Section engagement
('index', 'engagement_title', 'text', '{"title": "VOTRE CONFIANCE, NOTRE ENGAGEMENT"}', 22),
('index', 'engagement_subtitle', 'text', '{"subtitle": "Chez DK AUTOMOTIVE, chaque parcours est une promesse de qualité et de fiabilité."}', 23),
('index', 'engagement_card_1_title', 'text', '{"title": "Fiabilité"}', 24),
('index', 'engagement_card_1_content', 'text', '{"content": "Des services de convoyage sur lesquels vous pouvez compter à chaque instant."}', 25),
('index', 'engagement_card_2_title', 'text', '{"title": "Expertise"}', 26),
('index', 'engagement_card_2_content', 'text', '{"content": "Une équipe de professionnels expérimentés à votre service."}', 27),
('index', 'engagement_card_3_title', 'text', '{"title": "Satisfaction"}', 28),
('index', 'engagement_card_3_content', 'text', '{"content": "Votre satisfaction est notre priorité absolue."}', 29),

-- Section comment ça marche
('index', 'how_it_works_title', 'text', '{"title": "COMMENT ÇA MARCHE"}', 30),
('index', 'how_it_works_subtitle', 'text', '{"subtitle": "AVEC DK AUTOMOTIVE"}', 31),
('index', 'how_it_works_cta_title', 'text', '{"title": "Commencez dès maintenant !"}', 32),
('index', 'how_it_works_cta_button', 'text', '{"text": "Demandez votre devis gratuitement"}', 33)

ON CONFLICT (page_slug, block_key) DO UPDATE SET
  content_json = EXCLUDED.content_json,
  display_order = EXCLUDED.display_order,
  updated_at = now();
