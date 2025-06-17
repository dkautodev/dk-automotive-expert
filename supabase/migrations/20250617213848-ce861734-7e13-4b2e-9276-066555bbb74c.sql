
-- Supprimer les données existantes pour éviter les doublons
DELETE FROM public.about_page_contents;

-- Réinitialiser la séquence d'ordre d'affichage et importer tout le contenu de la page About
INSERT INTO public.about_page_contents (block_key, block_type, content_json, display_order) VALUES

-- Section Hero principale
('hero_title', 'text', '{"title": "BIENVENUE CHEZ"}', 1),
('hero_main_title', 'text', '{"title": "DK AUTOMOTIVE"}', 2),
('hero_subtitle', 'text', '{"subtitle": "Votre partenaire fiable pour le convoyage de véhicules."}', 3),
('hero_description', 'text', '{"content": "Forts de plus de 5 ans d''expérience dans les métiers du convoyage et du transport en général, nous avons développé une expertise inégalée pour répondre aux besoins les plus exigeants de nos clients."}', 4),

-- Section Pourquoi choisir DK Automotive
('why_choose_image', 'image', '{"url": "/lovable-uploads/68f33641-ed3b-4ff0-b6f3-288ab97beda1.jpg"}', 5),
('why_choose_title', 'text', '{"title": "POURQUOI CHOISIR DK AUTOMOTIVE POUR VOS BESOINS EN CONVOYAGE AUTOMOBILE ?"}', 6),
('why_choose_description', 'text', '{"content": "En faisant appel à DK AUTOMOTIVE, vous bénéficiez également de la conformité de toutes les régulations européennes en matière de convoyage automobile, garantissant un transport sécurisé de votre véhicule. Pour en savoir plus sur les régulations et les bonnes pratiques en matière de transport de véhicules en Europe, consultez l''article publié par la Commission européenne."}', 7),
('why_choose_benefit_1', 'text', '{"content": "Une équipe de professionnels expérimentés pour garantir la sécurité de votre véhicule."}', 8),
('why_choose_benefit_2', 'text', '{"content": "Une couverture géographique étendue pour répondre à vos besoins de transport en France et pays limitrophes."}', 9),
('why_choose_benefit_3', 'text', '{"content": "Des services sur mesure, adaptés à vos exigences et contraintes."}', 10),
('why_choose_benefit_4', 'text', '{"content": "Des tarifs compétitifs et transparents pour un rapport qualité-prix optimal en matière de tarif convoyage voiture."}', 11),

-- Section Chauffeurs expérimentés
('drivers_title', 'text', '{"title": "CHAUFFEURS EXPÉRIMENTÉS"}', 12),
('drivers_subtitle', 'text', '{"title": "Des convoyeurs rigoureusement sélectionnés"}', 13),
('drivers_description_1', 'text', '{"content": "Nos convoyeurs expérimentés et sélectionnés avec soin sont notre atout majeur. Tous de nos convoyeurs professionnels ont été sélectionnés rigoureusement pour leur expérience du métier, leur savoir-faire et leur engagement pour la satisfaction clientèle. Chez DK AUTOMOTIVE, nous ne faisons aucun compromis pour assurer la qualité de nos services."}', 14),
('drivers_description_2', 'text', '{"content": "Nous accordons une importance primordiale à la formation continue de nos chauffeurs. En effet, nos différents sont formés aux différentes procédures indispensables pour assurer un transport sûr et respectueux de l''environnement. L''écoconduite, la connaissance technique des différents véhicules et la réalisation de mises en main véhicules font partie intégrante de leur formation."}', 15),
('drivers_image', 'image', '{"url": "/lovable-uploads/95eb9367-8ef9-4af5-b92d-805ea0cdeca3.jpg"}', 16),

-- Section Valeurs (3 colonnes bleues)
('values_section_title', 'text', '{"title": "Nos valeurs"}', 17),
('value_ecoconduite_image', 'image', '{"url": "/lovable-uploads/19f7f830-34f1-4f2b-91ed-e3517a2a87f6.jpg"}', 18),
('value_ecoconduite_title', 'text', '{"title": "ÉCOCONDUITE"}', 19),
('value_ecoconduite_content', 'text', '{"content": "Nos chauffeurs sont formés à adopter des pratiques de conduite écologique pour réduire la consommation de carburant et minimiser l''impact environnemental."}', 20),

('value_expertise_image', 'image', '{"url": "/lovable-uploads/a527220b-aca5-4730-b21e-ec6177c7b83d.jpg"}', 21),
('value_expertise_title', 'text', '{"title": "EXPERTISE TECHNIQUE"}', 22),
('value_expertise_content', 'text', '{"content": "Les chauffeurs DK AUTOMOTIVE sont experts dans la connaissance technique des différents véhicules, leur permettant de s''adapter à toutes les situations et de garantir un convoyage sécurisé."}', 23),

('value_service_image', 'image', '{"url": "/lovable-uploads/2b49a059-d379-4b8f-847a-628ff2c1a7bc.jpg"}', 24),
('value_service_title', 'text', '{"title": "SERVICE SUR-MESURE"}', 25),
('value_service_content', 'text', '{"content": "Chez DK AUTOMOTIVE, nous nous adaptons à vos besoins spécifiques en matière de convoyage, offrant des solutions personnalisées pour assurer une expérience client optimale et un convoyage de véhicules en toute sérénité."}', 26),

-- Section Expertise en convoyage
('expertise_image', 'image', '{"url": "/lovable-uploads/65f150ef-91b6-4e32-ac29-e59c718d1905.jpg"}', 27),
('expertise_title', 'text', '{"title": "EXPERTISE EN CONVOYAGE AUTOMOBILE"}', 28),
('expertise_subtitle', 'text', '{"title": "Assurez-vous d''un transport sécurisé et fiable pour vos véhicules"}', 29),
('expertise_description', 'text', '{"content": "Chez DK AUTOMOTIVE, nous comprenons que la confiance et la satisfaction de nos clients sont essentielles. C''est pourquoi, nous nous efforçons d''offrir un service transparent, professionnel et adapté aux besoins individuels de chaque client. En choisissant DK AUTOMOTIVE, vous optez pour une entreprise qui met tout en œuvre pour vous offrir un service de qualité, capable d''inspirer confiance et de rassurer ses clients."}', 30),

-- Section finale
('final_title', 'text', '{"title": "FAITES LE CHOIX DE L''EXPERTISE"}', 31),
('final_main_title', 'text', '{"title": "DK AUTOMOTIVE"}', 32),
('final_subtitle', 'text', '{"subtitle": "UN PARTENAIRE FIABLE POUR VOS BESOINS EN CONVOYAGE"}', 33),
('final_description', 'text', '{"content": "Rejoignez dès aujourd''hui notre réseau de clients satisfaits et découvrez la différence que DK AUTOMOTIVE peut apporter à votre expérience de convoyage de véhicules. En tant que professionnels de l''automobile, nous sommes impatients de travailler avec vous et de vous fournir les solutions de convoyage les plus adaptées à vos besoins."}', 34);
