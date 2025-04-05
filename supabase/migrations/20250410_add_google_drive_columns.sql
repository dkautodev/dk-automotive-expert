
-- Ajout des colonnes pour Google Drive dans la table mission_attachments
ALTER TABLE mission_attachments
ADD COLUMN IF NOT EXISTS storage_provider TEXT,
ADD COLUMN IF NOT EXISTS provider_file_id TEXT,
ADD COLUMN IF NOT EXISTS provider_view_url TEXT,
ADD COLUMN IF NOT EXISTS provider_download_url TEXT;

-- Mise à jour des enregistrements existants pour spécifier 'supabase' comme provider
UPDATE mission_attachments
SET storage_provider = 'supabase'
WHERE storage_provider IS NULL;
