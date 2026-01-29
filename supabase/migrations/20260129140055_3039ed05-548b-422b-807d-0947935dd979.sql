-- Supprimer l'entrée redondante hero_background_image
DELETE FROM page_contents 
WHERE page_slug = 'index' 
AND block_key = 'hero_background_image';