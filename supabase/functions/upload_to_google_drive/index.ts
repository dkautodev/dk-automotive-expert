
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
 * Génère un nom de fichier simplifié pour éviter tout problème
 * Format: fichier01, fichier02, etc. avec l'extension du fichier original
 */
const generateSimpleFileName = (originalFileName: string, index: number = 1): string => {
  // Extraire l'extension du fichier original
  const extension = originalFileName.split('.').pop() || '';
  // Générer un nouveau nom avec le format fichierXX
  const paddedIndex = index.toString().padStart(2, '0');
  const newFileName = `fichier${paddedIndex}${extension ? `.${extension}` : ''}`;
  
  console.log(`Nom de fichier original: ${originalFileName} => Nouveau nom: ${newFileName}`);
  return newFileName;
};

// Fonction pour obtenir un token d'accès à partir du refresh token
async function getAccessToken() {
  try {
    console.log('Début de l\'obtention du token d\'accès');
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
      console.error(`Statut de la réponse: ${response.status} ${response.statusText}`);
      console.error('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Erreur lors de l'obtention du token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Token d\'accès obtenu avec succès', { token_type: data.token_type, expires_in: data.expires_in });
    return data.access_token;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'obtention du token d\'accès:', error);
    throw error;
  }
}

// Fonction pour créer un dossier sur Google Drive
async function createFolder(accessToken: string, folderName: string, parentFolderId = null) {
  try {
    console.log(`Création du dossier '${folderName}' sur Google Drive`);
    
    // Métadonnées du dossier
    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentFolderId && { parents: [parentFolderId] })
    };
    
    // Envoi de la requête à l'API Google Drive
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur lors de la création du dossier: ${response.status} ${errorText}`);
      throw new Error(`Erreur lors de la création du dossier: ${errorText}`);
    }
    
    const folderData = await response.json();
    console.log(`Dossier créé avec succès, ID: ${folderData.id}`);
    return folderData;
  } catch (error) {
    console.error('Erreur détaillée lors de la création du dossier:', error);
    throw error;
  }
}

// Fonction pour vérifier si un dossier existe déjà
async function findFolder(accessToken: string, folderName: string) {
  try {
    console.log(`Recherche du dossier '${folderName}' sur Google Drive`);
    
    // Construire la requête de recherche pour le dossier
    const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur lors de la recherche du dossier: ${response.status} ${errorText}`);
      throw new Error(`Erreur lors de la recherche du dossier: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Résultat de la recherche:`, data);
    
    if (data.files && data.files.length > 0) {
      console.log(`Dossier trouvé, ID: ${data.files[0].id}`);
      return data.files[0];
    }
    
    console.log(`Dossier '${folderName}' non trouvé`);
    return null;
  } catch (error) {
    console.error('Erreur détaillée lors de la recherche du dossier:', error);
    throw error;
  }
}

// Fonction pour trouver ou créer un dossier
async function findOrCreateFolder(accessToken: string, folderName: string) {
  try {
    // Vérifier si le dossier existe déjà
    const existingFolder = await findFolder(accessToken, folderName);
    if (existingFolder) {
      return existingFolder;
    }
    
    // Si le dossier n'existe pas, le créer
    return await createFolder(accessToken, folderName);
  } catch (error) {
    console.error(`Erreur lors de la recherche ou création du dossier '${folderName}':`, error);
    throw error;
  }
}

// Fonction pour définir des permissions publiques sur un fichier
async function setPublicPermissions(accessToken: string, fileId: string) {
  try {
    console.log(`Définition des permissions pour le fichier ID: ${fileId}`);
    
    // Créer une permission de lecture pour "anyone"
    const permission = {
      role: 'reader',
      type: 'anyone',
    };
    
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permission),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur lors de la définition des permissions: ${response.status} ${errorText}`);
      throw new Error(`Erreur lors de la définition des permissions: ${errorText}`);
    }
    
    const permissionData = await response.json();
    console.log('Permissions définies avec succès:', permissionData);
    return permissionData;
  } catch (error) {
    console.error('Erreur lors de la définition des permissions:', error);
    throw error;
  }
}

// Fonction pour téléverser un fichier sur Google Drive dans un dossier spécifique
async function uploadFileToDrive(accessToken: string, fileName: string, fileContent: Uint8Array, mimeType: string, missionNumber: string, fileIndex: number = 1) {
  try {
    // Générer un nom de fichier simplifié
    const simpleFileName = generateSimpleFileName(fileName, fileIndex);
    console.log(`Début du téléversement du fichier renommé ${simpleFileName} sur Google Drive pour la mission ${missionNumber}`);
    
    // Trouver ou créer le dossier pour la mission
    const missionFolder = await findOrCreateFolder(accessToken, missionNumber);
    console.log(`Dossier de la mission (${missionNumber}), ID: ${missionFolder.id}`);
    
    // Créer les métadonnées du fichier
    const metadata = {
      name: simpleFileName,
      mimeType: mimeType,
      parents: [missionFolder.id] // Placer le fichier dans le dossier de la mission
    };

    console.log('Métadonnées du fichier:', metadata);
    console.log('Taille du fichier:', fileContent.length, 'octets');

    // Créer les limites pour les données multipart
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    // Construire le corps de la requête
    let requestBody = new Uint8Array([
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

    // Envoyer la requête à l'API Google Drive avec le champ fields pour récupérer toutes les informations nécessaires
    console.log('Envoi de la requête à l\'API Google Drive');
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink', {
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
      console.error(`Statut de la réponse: ${response.status} ${response.statusText}`);
      console.error('Headers de la réponse:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Erreur lors du téléversement: ${response.status} ${errorText}`);
    }

    const fileData = await response.json();
    console.log('Fichier téléversé avec succès:', fileData);
    
    // Définir les permissions publiques pour le fichier
    await setPublicPermissions(accessToken, fileData.id);
    
    // Récupérer les informations complètes du fichier, y compris les liens
    const fileInfoResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}?fields=id,name,webViewLink,webContentLink`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    
    if (!fileInfoResponse.ok) {
      console.warn('Impossible de récupérer les informations complètes du fichier, utilisation des données partielles');
      return fileData;
    }
    
    const completeFileData = await fileInfoResponse.json();
    console.log('Informations complètes du fichier:', completeFileData);
    
    return completeFileData;
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
    const { missionId, missionNumber, fileName, fileData, fileType, fileSize, uploadedBy, fileIndex } = await req.json();
    
    if (!missionId || !fileName || !fileData || !uploadedBy || !missionNumber) {
      return new Response(
        JSON.stringify({ 
          error: 'Données manquantes pour le téléversement', 
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
      );
    }

    console.log(`Traitement de la requête pour téléverser ${fileName} pour la mission ${missionId} (${missionNumber})`, {
      fileType,
      fileSize,
      uploadedBy,
      fileIndex: fileIndex || 1
    });

    // Récupérer un token d'accès
    const accessToken = await getAccessToken();
    console.log('Token d\'accès obtenu');
    
    // Décodage du fichier base64
    let base64Data;
    if (fileData.includes(',')) {
      base64Data = fileData.split(',')[1];
    } else {
      base64Data = fileData;
    }
    
    if (!base64Data) {
      throw new Error('Données base64 invalides');
    }
    
    console.log('Données base64 extraites, longueur:', base64Data.length);
    
    // Conversion en binaire
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    console.log('Taille binaire du fichier:', binaryData.length, 'octets');
    
    // Téléverser le fichier sur Google Drive
    const driveResponse = await uploadFileToDrive(
      accessToken, 
      fileName,
      binaryData,
      fileType || 'application/octet-stream',
      missionNumber, // Utiliser le numéro de mission pour le dossier
      fileIndex || 1
    );
    
    console.log('Réponse de Google Drive:', driveResponse);
    
    // S'assurer que les URLs nécessaires sont bien présentes
    if (!driveResponse.webViewLink) {
      console.warn('Avertissement: webViewLink manquant dans la réponse de Google Drive');
    }
    
    if (!driveResponse.webContentLink) {
      console.warn('Avertissement: webContentLink manquant dans la réponse de Google Drive');
      // Générer une URL de téléchargement alternative si celle-ci n'est pas fournie
      driveResponse.webContentLink = `https://drive.google.com/uc?id=${driveResponse.id}&export=download`;
    }
    
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
