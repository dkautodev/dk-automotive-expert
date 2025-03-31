
-- Création de la table des notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('mission_status', 'document_update', 'invoice_generated', 'general')),
    read BOOLEAN DEFAULT false,
    mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS sur la table des notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour que les utilisateurs ne voient que leurs propres notifications
CREATE POLICY "Users can view their own notifications" 
    ON public.notifications 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Politique RLS pour que les utilisateurs puissent marquer leurs propres notifications comme lues
CREATE POLICY "Users can update their own notifications" 
    ON public.notifications 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Fonction pour créer une notification lorsqu'une mission change de statut
CREATE OR REPLACE FUNCTION public.notify_mission_status_change()
RETURNS TRIGGER AS $$
DECLARE
    mission_info RECORD;
    client_id UUID;
    driver_id UUID;
BEGIN
    -- Récupérer les informations de la mission
    SELECT client_id, driver_id, mission_number INTO mission_info FROM missions WHERE id = NEW.id;
    
    -- Si le statut a changé
    IF OLD.status <> NEW.status THEN
        -- Notification au client
        IF mission_info.client_id IS NOT NULL THEN
            INSERT INTO notifications (
                user_id, 
                message, 
                type, 
                mission_id
            ) VALUES (
                mission_info.client_id,
                'La mission ' || mission_info.mission_number || ' est maintenant ' || NEW.status,
                'mission_status',
                NEW.id
            );
        END IF;
        
        -- Notification au chauffeur si assigné
        IF mission_info.driver_id IS NOT NULL AND NEW.status = 'confirmé' THEN
            INSERT INTO notifications (
                user_id, 
                message, 
                type, 
                mission_id
            ) VALUES (
                mission_info.driver_id,
                'Nouvelle mission ' || mission_info.mission_number || ' vous a été assignée',
                'mission_status',
                NEW.id
            );
        END IF;
        
        -- Notification pour la génération de facture
        IF NEW.status = 'livre' AND OLD.status <> 'livre' THEN
            INSERT INTO notifications (
                user_id, 
                message, 
                type, 
                mission_id
            ) VALUES (
                mission_info.client_id,
                'Facture générée pour la mission ' || mission_info.mission_number,
                'invoice_generated',
                NEW.id
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ajouter le trigger pour les notifications
DROP TRIGGER IF EXISTS mission_status_notification_trigger ON missions;
CREATE TRIGGER mission_status_notification_trigger
    AFTER UPDATE ON missions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_mission_status_change();

-- Activer Realtime pour les notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
BEGIN;
DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
CREATE PUBLICATION supabase_realtime FOR TABLE public.notifications;
COMMIT;
