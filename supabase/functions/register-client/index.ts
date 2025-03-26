
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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the request data
    const { email, password, first_name, last_name, phone } = await req.json()

    // Check required fields
    if (!email || !password || !first_name || !last_name || !phone) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Create the user in auth.users
    const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
      }
    })

    if (createUserError) {
      throw createUserError
    }

    const userId = userData.user.id

    // Create profile in user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        first_name,
        last_name,
        phone,
        user_type: 'client'
      })
      .select()
      .single()

    if (profileError) {
      throw profileError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Client registered successfully', 
        id: userId,
        profile: profileData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    )
  }
})
