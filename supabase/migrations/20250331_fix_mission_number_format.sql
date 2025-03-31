
-- Mettre à jour la fonction de génération des numéros de mission pour respecter le format demandé
CREATE OR REPLACE FUNCTION public.generate_mission_number(mission_type text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    mission_count INTEGER;
    prefix TEXT;
    new_mission_number TEXT;
BEGIN
    -- Set the prefix based on mission type
    IF mission_type = 'livraison' THEN
        prefix := 'DK-LIV-';
    ELSE
        prefix := 'DK-REST-';
    END IF;
    
    -- Count existing missions of this type
    SELECT COUNT(*) + 100 INTO mission_count 
    FROM missions 
    WHERE mission_type = $1;
    
    -- Generate the mission number with the correct format
    new_mission_number := prefix || LPAD(mission_count::TEXT, 8, '0');
    
    RETURN new_mission_number;
END;
$function$;

-- Créer une fonction pour générer automatiquement les numéros de facture
CREATE OR REPLACE FUNCTION public.generate_invoice_number(mission_number text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN 'FACTURE-' || mission_number;
END;
$function$;

-- Créer un trigger pour générer automatiquement le numéro de facture quand une mission passe au statut "livré"
CREATE OR REPLACE FUNCTION public.set_invoice_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.status = 'livre' AND OLD.status != 'livre' THEN
        NEW.invoice_number := public.generate_invoice_number(NEW.mission_number);
    END IF;
    RETURN NEW;
END;
$function$;

-- Ajouter le trigger à la table des missions
DROP TRIGGER IF EXISTS set_invoice_number_trigger ON missions;
CREATE TRIGGER set_invoice_number_trigger
    BEFORE UPDATE ON missions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_invoice_number();

-- Ajouter une colonne pour stocker le numéro de facture si elle n'existe pas déjà
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'missions' 
                  AND column_name = 'invoice_number') THEN
        ALTER TABLE missions ADD COLUMN invoice_number text;
    END IF;
END $$;

-- Ajouter une colonne pour les notifications si elle n'existe pas déjà
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'missions' 
                  AND column_name = 'has_notifications') THEN
        ALTER TABLE missions ADD COLUMN has_notifications boolean DEFAULT false;
    END IF;
END $$;
