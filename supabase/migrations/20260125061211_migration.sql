-- Ajouter la colonne updated_by à la table missions
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

-- Créer un trigger pour mettre à jour automatiquement updated_at et updated_by
DROP TRIGGER IF EXISTS update_missions_updated_at ON public.missions;

CREATE TRIGGER update_missions_updated_at
BEFORE UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();