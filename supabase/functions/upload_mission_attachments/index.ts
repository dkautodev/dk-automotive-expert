
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
    const { missionId, fileData, fileName, fileType, fileSize, uploadedBy } = await req.json()
    
    if (!missionId || !fileData || !fileName || !uploadedBy) {
      return new Response(
        JSON.stringify({ error: 'Données manquantes pour le téléchargement' }),
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
    
    // Construction du chemin de fichier avec des conventions de nommage sécurisées
    const sanitizedFileName = fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_')
      .replace(/\s+/g, '_')
    
    const uniqueId = Date.now().toString()
    const filePath = `missions/${missionId}/${uniqueId}_${sanitizedFileName}`
    
    console.log("Chemin de téléchargement:", filePath)
    
    // Décodage du fichier base64
    const binaryData = Uint8Array.from(atob(fileData.split(',')[1]), c => c.charCodeAt(0))
    
    // Upload du fichier vers Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('mission-attachments')
      .upload(filePath, binaryData, {
        contentType: fileType || 'application/octet-stream',
        upsert: false
      })
    
    if (storageError) {
      console.error("Erreur lors du téléchargement dans Storage:", storageError)
      return new Response(
        JSON.stringify({ error: `Erreur lors du téléchargement: ${storageError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Création de l'enregistrement en base de données
    const { data: dbData, error: dbError } = await supabase
      .from('mission_attachments')
      .insert({
        mission_id: missionId,
        file_name: fileName,
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
        uploaded_by: uploadedBy
      })
    
    if (dbError) {
      console.error("Erreur lors de l'enregistrement en BDD:", dbError)
      // Nettoyage du fichier si l'enregistrement en BDD échoue
      await supabase.storage.from('mission-attachments').remove([filePath])
      
      return new Response(
        JSON.stringify({ error: `Erreur lors de l'enregistrement: ${dbError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
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
    )
    
  } catch (error) {
    console.error("Erreur:", error.message)
    return new Response(
      JSON.stringify({ error: `Erreur lors du traitement: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

Deno.serve(async (req) => {
  // Cette partie gère les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }
  
  // Seules les requêtes POST sont acceptées pour le téléchargement
  if (req.method === 'POST') {
    return await handleUpload(req)
  }
  
  // Toute autre méthode HTTP est refusée
  return new Response(
    JSON.stringify({ error: 'Méthode non autorisée' }),
    { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
})
