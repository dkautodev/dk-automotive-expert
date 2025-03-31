
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user from auth.users table
    const { data: authUser, error: authError } = await supabaseClient
      .from('auth.users')
      .select('email')
      .eq('id', userId)
      .single();

    if (authError) {
      console.error("Error fetching auth user:", authError);
    }

    // Get user profile from user_profiles table
    const { data: profileData, error: profileError } = await supabaseClient
      .from("user_profiles")
      .select("first_name, last_name, phone, company_name, user_type")
      .eq("user_id", userId)
      .single();

    if (profileError && !authUser) {
      return new Response(
        JSON.stringify({ error: "User not found", details: profileError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Combine data from both tables
    const userData = {
      id: userId,
      email: authUser?.email || "",
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      phone: profileData?.phone || "",
      company_name: profileData?.company_name || "",
      user_type: profileData?.user_type || "client"
    };

    return new Response(
      JSON.stringify(userData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get_user_by_id function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
