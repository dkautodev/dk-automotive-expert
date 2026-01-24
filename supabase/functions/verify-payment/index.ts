import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    console.log("Verifying payment for session:", session_id);

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Session status:", session.payment_status);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Payment not completed" 
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Create Supabase admin client to insert mission
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract mission data from session metadata
    const metadata = session.metadata || {};
    
    const missionData = {
      pickup_address: metadata.pickup_address,
      delivery_address: metadata.delivery_address,
      pickup_city: metadata.pickup_city || null,
      delivery_city: metadata.delivery_city || null,
      pickup_postal_code: metadata.pickup_postal_code || null,
      delivery_postal_code: metadata.delivery_postal_code || null,
      distance_km: parseFloat(metadata.distance_km) || null,
      price_ht: parseFloat(metadata.price_ht) || null,
      price_ttc: parseFloat(metadata.price_ttc) || null,
      vehicle_type: metadata.vehicle_type || null,
      vehicle_brand: metadata.vehicle_brand || null,
      vehicle_model: metadata.vehicle_model || null,
      vehicle_year: metadata.vehicle_year || null,
      vehicle_fuel: metadata.vehicle_fuel || null,
      license_plate: metadata.license_plate || null,
      vehicle_vin: metadata.vehicle_vin || null,
      client_name: metadata.client_name,
      client_email: metadata.client_email,
      client_phone: metadata.client_phone || null,
      client_company: metadata.client_company || null,
      pickup_date: metadata.pickup_date || null,
      pickup_time: metadata.pickup_time || null,
      delivery_date: metadata.delivery_date || null,
      delivery_time: metadata.delivery_time || null,
      pickup_contact_name: metadata.pickup_contact_name || null,
      pickup_contact_phone: metadata.pickup_contact_phone || null,
      delivery_contact_name: metadata.delivery_contact_name || null,
      delivery_contact_phone: metadata.delivery_contact_phone || null,
      notes: metadata.notes || null,
      status: "confirmed",
      payment_status: "paid",
      payment_intent_id: session.payment_intent as string,
    };

    console.log("Inserting mission data:", missionData);

    // Insert mission into database
    const { data: mission, error: insertError } = await supabaseAdmin
      .from("missions")
      .insert(missionData)
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting mission:", insertError);
      throw new Error(`Failed to create mission: ${insertError.message}`);
    }

    console.log("Mission created successfully:", mission.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        mission_id: mission.id,
        message: "Payment verified and mission created" 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
