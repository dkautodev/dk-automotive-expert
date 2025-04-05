
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configuration CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Récupération des identifiants depuis les variables d'environnement
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const GOOGLE_REFRESH_TOKEN = Deno.env.get("GOOGLE_REFRESH_TOKEN");

/**
 * Nettoie et sanitize un nom de fichier pour le téléversement vers Google Drive
 */
const sanitizeFileName = (fileName: string): string => {
  // Pour Google Drive, on peut conserver plus de caractères, mais on évite tout de même 
  // les caractères qui pourraient poser problème
  return fileName
    .replace(/[\/\\:*?"<>|]/g, '_') // Remplacer les caractères interdits dans les noms de fichiers
    .replace(/[']/g, '') // Supprimer les apostrophes qui peuvent causer des problèmes
    .replace(/\s+/g, '_'); // Remplacer les espaces par des underscores
};

// Fonction pour obtenir un token d'accès à partir du refresh token
async function getAccessToken() {
  try {
    console.log('Début de l\'obtention du token d\'accès avec les nouveaux identifiants');
    console.log('GOOGLE_CLIENT_ID est défini:', !!GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET est défini:', !!GOOGLE_CLIENT_SECRET);
    console.log('GOOGLE_REFRESH_TOKEN est défini:', !!GOOGLE_REFRESH_TOKEN);
    
    // Vérification des identifiants avant de faire la requête
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      throw new Error('Les identifiants Google Drive sont manquants ou incomplets');
    }
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Réponse d\'erreur complète lors de l\'obtention du token:', errorText);
      
      // Log détaillé pour déboguer
      console.error(`Statut de la réponse: ${response.status} ${response.statusText}`);
      console.error('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
      
      throw new Error(`Erreur lors de l'obtention du token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Token d\'accès obtenu avec succès');
    return data.access_token;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'obtention du token d\'accès:', error);
    throw error;
  }
}

// Fonction pour téléverser un fichier sur Google Drive
async function uploadFileToDrive(accessToken: string, fileName: string, fileContent: Uint8Array, mimeType: string) {
  try {
    // Sanitize le nom du fichier pour Google Drive
    const sanitizedFileName = sanitizeFileName(fileName);
    console.log(`Début du téléversement du fichier ${sanitizedFileName} sur Google Drive`);
    
    // Créer les métadonnées du fichier
    const metadata = {
      name: sanitizedFileName,
      mimeType: mimeType,
    };

    // Créer les limites pour les données multipart
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    // Construire le corps de la requête
    const requestBody = new Uint8Array([
      ...new TextEncoder().encode(
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${mimeType}\r\n\r\n`
      ),
      ...fileContent,
      ...new TextEncoder().encode(closeDelimiter),
    ]);

    // Envoyer la requête à l'API Google Drive
    console.log('Envoi de la requête à l\'API Google Drive avec le token:', accessToken.substring(0, 5) + '...');
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': requestBody.length.toString(),
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Réponse d\'erreur complète lors du téléversement:', errorText);
      
      // Log détaillé pour déboguer
      console.error(`Statut de la réponse: ${response.status} ${response.statusText}`);
      console.error('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
      
      throw new Error(`Erreur lors du téléversement: ${response.status} ${errorText}`);
    }

    const fileData = await response.json();
    console.log('Fichier téléversé avec succès:', fileData);
    
    return fileData;
  } catch (error) {
    console.error('Erreur détaillée lors du téléversement du fichier sur Google Drive:', error);
    throw error;
  }
}

// Gestionnaire de la requête
async function handleUploadRequest(req: Request) {
  try {
    // Vérification des identifiants
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Google Drive incomplète',
          details: {
            client_id_present: !!GOOGLE_CLIENT_ID,
            client_secret_present: !!GOOGLE_CLIENT_SECRET,
            refresh_token_present: !!GOOGLE_REFRESH_TOKEN
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extraire les données de la requête
    const { missionId, fileName, fileData, fileType, fileSize, uploadedBy } = await req.json();
    
    if (!missionId || !fileName || !fileData || !uploadedBy) {
      return new Response(
        JSON.stringify({ error: 'Données manquantes pour le téléversement' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Traitement de la requête pour téléverser ${fileName} pour la mission ${missionId}`);

    // Récupérer un token d'accès
    const accessToken = await getAccessToken();
    
    // Décodage du fichier base64
    const base64Data = fileData.split(',')[1] || fileData;
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Téléverser le fichier sur Google Drive
    const folderPath = `missions/${missionId}`;
    const driveResponse = await uploadFileToDrive(
      accessToken, 
      fileName,
      binaryData,
      fileType || 'application/octet-stream'
    );
    
    // Utiliser l'ID du fichier Google Drive comme filePath
    const filePath = driveResponse.id;
    
    // Retourner la réponse
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Fichier téléversé avec succès sur Google Drive",
        fileId: driveResponse.id,
        fileName: driveResponse.name,
        webViewLink: driveResponse.webViewLink,
        webContentLink: driveResponse.webContentLink
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error("Erreur détaillée pendant le traitement de la requête:", error);
    return new Response(
      JSON.stringify({ 
        error: `Erreur lors du traitement: ${error.message}`,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Serveur principal
serve(async (req) => {
  // Cette partie gère les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Seules les requêtes POST sont acceptées pour le téléversement
  if (req.method === 'POST') {
    return await handleUploadRequest(req);
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
