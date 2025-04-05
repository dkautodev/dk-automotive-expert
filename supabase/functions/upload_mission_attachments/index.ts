
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_app
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function handleUpload(req: Request) {
  try {
    // Récupération du body qui contient les données nécessaires
    const { missionId, missionNumber, fileData, fileName, originalFileName, fileType, fileSize, uploadedBy } = await req.json()
    
    if (!missionId || !fileData || !fileName || !uploadedBy || !missionNumber) {
      return new Response(
        JSON.stringify({ 
          error: 'Données manquantes pour le téléchargement',
          details: {
            missionId: !!missionId,
            missionNumber: !!missionNumber,
            fileName: !!fileName,
            fileData: !!fileData,
            uploadedBy: !!uploadedBy
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validation de l'ID de mission
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(missionId)) {
      return new Response(
        JSON.stringify({ error: 'ID de mission invalide' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Récupération des variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Configuration du serveur incomplète' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialisation du client Supabase avec la clé de service pour les autorisations complètes
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Utiliser le dossier avec le numéro de mission et le nom de fichier simplifié
    let filePath = `missions/${missionNumber}/${fileName}`;
    
    console.log("Chemin de téléchargement:", filePath);
    
    // Décodage du fichier base64
    const base64Data = fileData.split(',')[1] || fileData;
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Vérifier si le fichier existe déjà pour éviter le conflit 409
    const { data: existingFile } = await supabase.storage
      .from('mission-attachments')
      .list(`missions/${missionNumber}`, {
        search: fileName
      });
    
    if (existingFile && existingFile.length > 0) {
      console.log("Le fichier existe déjà, génération d'un nouveau nom...");
      // Ajouter un timestamp au nom du fichier pour éviter les conflits
      const timestamp = new Date().getTime();
      const fileNameParts = fileName.split('.');
      const extension = fileNameParts.pop() || '';
      const newFileName = `${fileNameParts.join('.')}_${timestamp}.${extension}`;
      filePath = `missions/${missionNumber}/${newFileName}`;
      console.log("Nouveau chemin:", filePath);
    }
    
    // Upload du fichier vers Storage avec la gestion des erreurs
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('mission-attachments')
        .upload(filePath, binaryData, {
          contentType: fileType || 'application/octet-stream',
          cacheControl: '3600',
          upsert: true // Écraser si le fichier existe déjà
        });
      
      if (storageError) {
        console.error("Erreur lors du téléchargement dans Storage:", storageError);
        throw storageError;
      }
    } catch (storageError: any) {
      // Si l'erreur est un conflit (fichier existe déjà), on continue avec l'enregistrement
      if (
        storageError.message !== "The resource already exists" && 
        !storageError.message.includes("409") && 
        !storageError.message.includes("already exists")
      ) {
        return new Response(
          JSON.stringify({ error: `Erreur lors du téléchargement: ${storageError.message}` }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      console.log("Fichier déjà existant, continuant avec l'enregistrement en base de données");
    }
    
    // Création de l'enregistrement en base de données
    const { data: dbData, error: dbError } = await supabase
      .from('mission_attachments')
      .insert({
        mission_id: missionId,
        file_name: originalFileName || fileName, // Utiliser le nom original pour l'affichage
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
        uploaded_by: uploadedBy,
        storage_provider: 'supabase'
      });
    
    if (dbError) {
      console.error("Erreur lors de l'enregistrement en BDD:", dbError);
      
      return new Response(
        JSON.stringify({ error: `Erreur lors de l'enregistrement: ${dbError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Fichier téléchargé avec succès",
        filePath
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error("Erreur:", error.message);
    return new Response(
      JSON.stringify({ error: `Erreur lors du traitement: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

Deno.serve(async (req) => {
  // Cette partie gère les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Seules les requêtes POST sont acceptées pour le téléchargement
  if (req.method === 'POST') {
    return await handleUpload(req);
  }
  
  // Toute autre méthode HTTP est refusée
  return new Response(
    JSON.stringify({ error: 'Méthode non autorisée' }),
    { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
});
