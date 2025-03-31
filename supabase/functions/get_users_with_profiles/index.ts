
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
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get users with their profiles
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
    
    if (authError) {
      throw authError;
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('user_profiles')
      .select('*');
    
    if (profilesError) {
      throw profilesError;
    }

    // Merge the data
    const usersWithProfiles = authUsers.users.map(user => {
      const profile = profiles.find(p => p.user_id === user.id);
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        user_type: user.user_metadata?.user_type || 'client',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        company_name: profile?.company_name || '',
        phone: profile?.phone || '',
      };
    });

    return new Response(
      JSON.stringify(usersWithProfiles),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
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
