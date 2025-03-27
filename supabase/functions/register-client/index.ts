
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Variables d'environnement manquantes:", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseServiceKey 
      });
      
      throw new Error("Configuration serveur incomplète");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the request data
    const data = await req.json();
    console.log("Données reçues:", data);
    
    const { email, password, first_name, last_name, phone, company } = data;

    // Check required fields
    if (!email || !password || !first_name || !last_name || !phone) {
      console.error("Champs requis manquants:", { 
        hasEmail: !!email,
        hasPassword: !!password,
        hasFirstName: !!first_name,
        hasLastName: !!last_name,
        hasPhone: !!phone
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Certains champs requis sont manquants' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Create the user in auth.users
    console.log("Création du compte utilisateur...");
    const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        role: 'client'
      }
    })

    if (createUserError) {
      console.error("Erreur lors de la création de l'utilisateur:", createUserError);
      throw createUserError
    }

    const userId = userData.user.id
    console.log("Utilisateur créé avec succès, ID:", userId);

    // Create profile in user_profiles
    console.log("Création du profil utilisateur...");
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        first_name,
        last_name,
        phone,
        company_name: company,
        user_type: 'client'
      })
      .select()
      .single()

    if (profileError) {
      console.error("Erreur lors de la création du profil:", profileError);
      throw profileError
    }

    console.log("Profil créé avec succès:", profileData);
    return new Response(
      JSON.stringify({ 
        message: 'Client enregistré avec succès', 
        id: userId,
        profile: profileData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    console.error("Erreur lors du traitement de la demande:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Une erreur inconnue s'est produite" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    )
  }
})
