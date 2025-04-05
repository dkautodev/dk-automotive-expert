
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

// Fonction pour obtenir un token d'accès à partir du refresh token
async function getAccessToken() {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        refresh_token: GOOGLE_REFRESH_TOKEN!,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur lors de l\'obtention du token:', errorData);
      throw new Error(`Erreur lors de l'obtention du token: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token d\'accès:', error);
    throw error;
  }
}

// Fonction pour téléverser un fichier sur Google Drive
async function uploadFileToDrive(accessToken: string, fileName: string, fileContent: Uint8Array, mimeType: string) {
  try {
    console.log(`Début du téléversement du fichier ${fileName} sur Google Drive`);
    
    // Créer les métadonnées du fichier
    const metadata = {
      name: fileName,
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
      const errorData = await response.text();
      console.error('Erreur lors du téléversement sur Google Drive:', errorData);
      throw new Error(`Erreur lors du téléversement: ${response.status} ${errorData}`);
    }

    const fileData = await response.json();
    console.log('Fichier téléversé avec succès:', fileData);
    
    return fileData;
  } catch (error) {
    console.error('Erreur lors du téléversement du fichier sur Google Drive:', error);
    throw error;
  }
}

// Gestionnaire de la requête
async function handleUploadRequest(req: Request) {
  try {
    // Vérification des identifiants
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Configuration Google Drive incomplète' }),
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
    const base64Data = fileData.split(',')[1];
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
    console.error("Erreur pendant le traitement de la requête:", error);
    return new Response(
      JSON.stringify({ error: `Erreur lors du traitement: ${error.message}` }),
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
