import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MissionData {
  pickup_address: string;
  delivery_address: string;
  pickup_city?: string;
  delivery_city?: string;
  pickup_postal_code?: string;
  delivery_postal_code?: string;
  distance_km: number;
  price_ht: number;
  price_ttc: number;
  vehicle_type?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_fuel?: string;
  license_plate?: string;
  vehicle_vin?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_company?: string;
  pickup_date?: string;
  pickup_time?: string;
  pickup_time_end?: string;
  delivery_date?: string;
  delivery_time?: string;
  delivery_time_end?: string;
  pickup_contact_name?: string;
  pickup_contact_phone?: string;
  delivery_contact_name?: string;
  delivery_contact_phone?: string;
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const missionData: MissionData = await req.json();
    console.log("Received mission data:", missionData);

    // Validate required fields
    if (!missionData.client_email || !missionData.client_name) {
      throw new Error("Email et nom du client requis");
    }

    if (!missionData.price_ttc || missionData.price_ttc <= 0) {
      throw new Error("Prix TTC invalide");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer record exists for this email
    const customers = await stripe.customers.list({ 
      email: missionData.client_email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create a new customer
      const newCustomer = await stripe.customers.create({
        email: missionData.client_email,
        name: missionData.client_name,
        phone: missionData.client_phone,
        metadata: {
          company: missionData.client_company || "",
        },
      });
      customerId = newCustomer.id;
    }

    console.log("Customer ID:", customerId);

    // Create a one-time payment session with multiple payment methods
    // Note: Apple Pay and Google Pay are automatically enabled when using "card" 
    // if they are configured in your Stripe account
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card", "sepa_debit", "paypal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Convoyage véhicule - ${missionData.vehicle_brand || ''} ${missionData.vehicle_model || ''}`.trim() || 'Convoyage véhicule',
              description: `De ${missionData.pickup_address} à ${missionData.delivery_address} (${missionData.distance_km} km)`,
            },
            unit_amount: Math.round(missionData.price_ttc * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pre-commande`,
      metadata: {
        pickup_address: missionData.pickup_address,
        delivery_address: missionData.delivery_address,
        pickup_city: missionData.pickup_city || "",
        delivery_city: missionData.delivery_city || "",
        pickup_postal_code: missionData.pickup_postal_code || "",
        delivery_postal_code: missionData.delivery_postal_code || "",
        distance_km: missionData.distance_km.toString(),
        price_ht: missionData.price_ht.toString(),
        price_ttc: missionData.price_ttc.toString(),
        vehicle_type: missionData.vehicle_type || "",
        vehicle_brand: missionData.vehicle_brand || "",
        vehicle_model: missionData.vehicle_model || "",
        vehicle_year: missionData.vehicle_year || "",
        vehicle_fuel: missionData.vehicle_fuel || "",
        license_plate: missionData.license_plate || "",
        vehicle_vin: missionData.vehicle_vin || "",
        client_name: missionData.client_name,
        client_email: missionData.client_email,
        client_phone: missionData.client_phone || "",
        client_company: missionData.client_company || "",
        pickup_date: missionData.pickup_date || "",
        pickup_time: missionData.pickup_time || "",
        pickup_time_end: missionData.pickup_time_end || "",
        delivery_date: missionData.delivery_date || "",
        delivery_time: missionData.delivery_time || "",
        delivery_time_end: missionData.delivery_time_end || "",
        pickup_contact_name: missionData.pickup_contact_name || "",
        pickup_contact_phone: missionData.pickup_contact_phone || "",
        delivery_contact_name: missionData.delivery_contact_name || "",
        delivery_contact_phone: missionData.delivery_contact_phone || "",
        notes: missionData.notes || "",
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
