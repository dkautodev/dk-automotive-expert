
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log incoming request
    console.log("Début de la requête Edge Function get_users_with_profiles");
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Récupérer les profils utilisateurs
    console.log("Récupération des profils utilisateur");
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      throw profilesError;
    }

    console.log(`${profiles?.length || 0} profils récupérés`);

    // Récupérer les utilisateurs si possible
    let userData = [];
    try {
      const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
      
      if (!authError && authUsers?.users) {
        console.log(`${authUsers.users.length || 0} utilisateurs auth récupérés`);
        
        // Fusionner les données
        userData = authUsers.users.map(user => {
          const profile = profiles?.find(p => p.user_id === user.id);
          const userType = user.user_metadata?.role || user.user_metadata?.user_type || 'client';
          
          // Détecter l'administrateur par email si nécessaire
          const finalUserType = user.email === 'dkautomotive70@gmail.com' ? 'admin' : userType;
          
          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            user_type: finalUserType,
            first_name: profile?.first_name || user.user_metadata?.first_name || '',
            last_name: profile?.last_name || user.user_metadata?.last_name || '',
            company_name: profile?.company_name || '',
            phone: profile?.phone || '',
            client_code: profile?.client_code || ''
          };
        });
      }
    } catch (authError) {
      console.error("Erreur lors de la récupération des utilisateurs auth:", authError);
    }

    // Si aucune donnée d'utilisateur auth, utiliser uniquement les profils
    if (userData.length === 0 && profiles && profiles.length > 0) {
      console.log("Utilisation des profils uniquement");
      userData = profiles.map(profile => {
        let userType = profile.user_type || 'client';
        
        return {
          id: profile.user_id || profile.id,
          email: '',
          created_at: null,
          user_type: userType,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          company_name: profile.company_name || '',
          phone: profile.phone || '',
          client_code: profile.client_code || ''
        };
      });
    }

    // Récupérer les utilisateurs de la table users (fallback)
    if (userData.length === 0) {
      console.log("Tentative de récupération depuis la table users");
      const { data: users, error: usersError } = await supabaseClient
        .from('users')
        .select('*');
      
      if (!usersError && users && users.length > 0) {
        console.log(`${users.length} utilisateurs récupérés depuis la table users`);
        userData = users.map(user => {
          // Vérifier si l'utilisateur est un administrateur par son email
          const userType = user.email === 'dkautomotive70@gmail.com' ? 'admin' : (user.user_type || 'client');
          
          return {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            user_type: userType,
            first_name: '',
            last_name: '',
            company_name: '',
            phone: '',
            client_code: ''
          };
        });
      } else if (usersError) {
        console.log("Erreur lors de la récupération des utilisateurs:", usersError);
      }
    }

    console.log(`Retour de ${userData.length} utilisateurs au total`);

    return new Response(
      JSON.stringify(userData),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
