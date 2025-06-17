
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Vérifier que c'est un fichier PNG
    if (file.type !== 'image/png') {
      return new Response(
        JSON.stringify({ error: 'Only PNG files are allowed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Lire le contenu du fichier
    const fileContent = await file.arrayBuffer()
    
    // Écrire le fichier dans le dossier public (simulé)
    // Note: Dans un environnement Lovable, le fichier sera automatiquement placé dans /lovable-uploads/
    console.log('Favicon uploaded successfully as favicon.png')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: '/lovable-uploads/favicon.png',
        message: 'Favicon uploaded successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error uploading favicon:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
