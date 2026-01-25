-- Ajouter les colonnes pour les heures de fin des créneaux
ALTER TABLE public.missions 
ADD COLUMN pickup_time_end text,
ADD COLUMN delivery_time_end text;

-- Renommer les colonnes existantes pour plus de clarté (optionnel, on garde la compatibilité)
COMMENT ON COLUMN public.missions.pickup_time IS 'Heure de début du créneau d''enlèvement';
COMMENT ON COLUMN public.missions.pickup_time_end IS 'Heure de fin du créneau d''enlèvement';
COMMENT ON COLUMN public.missions.delivery_time IS 'Heure de début du créneau de livraison';
COMMENT ON COLUMN public.missions.delivery_time_end IS 'Heure de fin du créneau de livraison';