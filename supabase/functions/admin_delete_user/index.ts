
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Créer un client Supabase avec la clé de service (role admin)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variables d\'environnement SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquantes');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extraire l'ID utilisateur du corps de la requête
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('userId est requis');
    }

    console.log(`Tentative de suppression de l'utilisateur avec ID: ${userId}`);

    // Supprimer l'utilisateur via l'API admin
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) {
      throw error;
    }

    // Supprimer également les profils utilisateur associés si nécessaire
    console.log(`Suppression du profil utilisateur pour l'ID: ${userId}`);
    await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Utilisateur supprimé avec succès' 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
    
  } catch (error) {
    console.error('Erreur:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
