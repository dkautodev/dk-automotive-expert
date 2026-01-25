-- Ajouter la colonne is_processed pour suivre si la commande a été traitée
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS is_processed boolean NOT NULL DEFAULT false;