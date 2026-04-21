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

// Function to calculate distance via Google Maps API
async function calculateServerDistance(origin: string, destination: string, apiKey: string): Promise<number> {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Google Maps API error: ${data.status} ${data.error_message || ""}`);
  }

  const distanceInMeters = data.routes[0].legs[0].distance.value;
  return distanceInMeters / 1000; // Convert to km
}

// Fallback rates if external DB is down
function getBaseRatePerKm(vehicleType: string): number {
  const rates: Record<string, number> = {
    'citadine': 0.73, 'berline': 0.75, 'break': 0.75, 'suv': 0.78, '4x4': 0.78,
    'utilitaire_3_5': 0.80, 'utilitaire_6_12': 0.82, 'utilitaire_12_15': 0.85,
    'utilitaire_15_20': 0.87, 'utilitaire_20_plus': 0.89, 'premium': 0.95
  };
  return rates[vehicleType] || 0.73;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const origin = req.headers.get("origin") || req.headers.get("referer") || new URL(req.url).origin;
    const missionData: MissionData = await req.json();
    console.log("Received client mission data:", { 
      distance: missionData.distance_km, 
      price: missionData.price_ttc,
      vehicle: missionData.vehicle_type 
    });

    if (!missionData.client_email || !missionData.client_name) {
      throw new Error("Email et nom du client requis");
    }

    // 1. Recalculate distance via Google Maps
    const googleApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    let validatedDistance = missionData.distance_km;
    
    if (googleApiKey) {
      try {
        const serverDistance = await calculateServerDistance(
          missionData.pickup_address,
          missionData.delivery_address,
          googleApiKey
        );
        console.log("Server calculated distance:", serverDistance);

        // 5% Tolerance logic
        const diffPercent = Math.abs(serverDistance - missionData.distance_km) / serverDistance;
        if (diffPercent > 0.05) {
          console.warn(`Distance mismatch detected (${(diffPercent * 100).toFixed(1)}%). Overriding with server distance.`);
          validatedDistance = serverDistance;
        } else {
          console.log(`Distance within 5% tolerance (${(diffPercent * 100).toFixed(1)}%). Keeping client distance.`);
        }
      } catch (err) {
        console.error("Failed to verify distance via Google Maps:", err);
        // Fallback to client distance if API fails, but log it
      }
    }

    // 2. Recalculate price via External Database
    const extUrl = Deno.env.get("EXTERNAL_SUPABASE_URL");
    const extKey = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");
    let finalPriceHT: number;
    let finalPriceTTC: number;

    if (extUrl && extKey && missionData.vehicle_type) {
      const externalSupabase = createClient(extUrl, extKey);
      const { data: pricingGrids, error } = await externalSupabase
        .from('pricing_grids')
        .select('*')
        .eq('vehicle_category', missionData.vehicle_type)
        .eq('active', true);

      const pricingData = pricingGrids?.find(row => {
        const min = Number(row.min_distance) || 0;
        const max = Number(row.max_distance) || 999999;
        return validatedDistance >= min && validatedDistance <= max;
      });

      if (pricingData) {
        const typeTarif = (pricingData.type_tarif || '').toLowerCase();
        if (typeTarif === 'per_km' || typeTarif === 'km') {
          finalPriceHT = (Number(pricingData.price_ht) || 0) * validatedDistance;
          finalPriceTTC = (Number(pricingData.price_ttc) || 0) * validatedDistance;
        } else {
          finalPriceHT = Number(pricingData.price_ht) || 0;
          finalPriceTTC = Number(pricingData.price_ttc) || 0;
        }
        console.log("Price recalculated from grid:", { finalPriceTTC, validatedDistance });
      } else {
        // Fallback to local calculation if no grid matches
        console.log("No matching grid found, using fallback rates");
        const rate = getBaseRatePerKm(missionData.vehicle_type);
        finalPriceHT = validatedDistance * rate;
        finalPriceTTC = finalPriceHT * 1.2;
      }
    } else {
      console.warn("External DB credentials missing, using fallback rates");
      const rate = getBaseRatePerKm(missionData.vehicle_type || 'citadine');
      finalPriceHT = validatedDistance * rate;
      finalPriceTTC = finalPriceHT * 1.2;
    }

    // SECURITY CHECK: Verify the final price against what the client sent
    if (Math.abs(finalPriceTTC - missionData.price_ttc) > 1) {
      console.warn(`PRICE MANIPULATION DETECTED! Client sent ${missionData.price_ttc}€, Server calculated ${finalPriceTTC}€. Enforcing server price.`);
    }

    // 3. Save mission to Database before Stripe redirect
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    let missionId = null;

    if (supabaseUrl && supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const missionPayload = {
        pickup_address: missionData.pickup_address,
        pickup_city: missionData.pickup_city || null,
        pickup_postal_code: missionData.pickup_postal_code || null,
        delivery_address: missionData.delivery_address,
        delivery_city: missionData.delivery_city || null,
        delivery_postal_code: missionData.delivery_postal_code || null,
        distance_km: validatedDistance,
        price_ht: finalPriceHT,
        price_ttc: finalPriceTTC,
        vehicle_type: missionData.vehicle_type || null,
        vehicle_brand: missionData.vehicle_brand || null,
        vehicle_model: missionData.vehicle_model || null,
        vehicle_year: missionData.vehicle_year || null,
        vehicle_fuel: missionData.vehicle_fuel || null,
        vehicle_vin: missionData.vehicle_vin || null,
        client_name: missionData.client_name,
        client_email: missionData.client_email,
        client_phone: missionData.client_phone || null,
        client_company: missionData.client_company || null,
        pickup_date: missionData.pickup_date || null,
        pickup_time: missionData.pickup_time || null,
        pickup_time_end: missionData.pickup_time_end || null,
        delivery_date: missionData.delivery_date || null,
        delivery_time: missionData.delivery_time || null,
        delivery_time_end: missionData.delivery_time_end || null,
        pickup_contact_name: missionData.pickup_contact_name || null,
        pickup_contact_phone: missionData.pickup_contact_phone || null,
        delivery_contact_name: missionData.delivery_contact_name || null,
        delivery_contact_phone: missionData.delivery_contact_phone || null,
        notes: missionData.notes || null,
        status: "pending",
        payment_status: "unpaid"
      };

      console.log("Saving mission to DB before payment:", missionPayload);
      const { data: newMission, error: insertError } = await supabaseAdmin
        .from("missions")
        .insert(missionPayload)
        .select("id")
        .single();

      if (insertError) {
        console.error("Error saving mission to DB:", insertError);
        // We continue anyway so the client can at least pay, even if DB save failed
      } else {
        missionId = newMission?.id;
        console.log("Mission saved with ID:", missionId);
      }
    }

    // Initialize Stripe
    const stripeKey = (Deno.env.get("STRIPE_SECRET_KEY") ?? "").trim();
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Handle Stripe Customer
    const customers = await stripe.customers.list({ email: missionData.client_email, limit: 1 });
    let customerId = customers.data.length > 0 ? customers.data[0].id : null;
    if (!customerId) {
      const newCustomer = await stripe.customers.create({
        email: missionData.client_email,
        name: missionData.client_name,
        phone: missionData.client_phone,
        metadata: { company: missionData.client_company || "" },
      });
      customerId = newCustomer.id;
    }

    // Create Stripe Session with SERVER CALCULATED PRICE
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `Convoyage véhicule - ${missionData.vehicle_brand || ""} ${missionData.vehicle_model || ""}`.trim() || "Convoyage véhicule",
            description: `De ${missionData.pickup_address} à ${missionData.delivery_address} (${validatedDistance.toFixed(0)} km)`,
          },
          unit_amount: Math.round(finalPriceTTC * 100), // Enforcing server price
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pre-commande`,
      metadata: {
        ...missionData,
        mission_id: missionId || "",
        distance_km: validatedDistance.toFixed(2),
        price_ht: finalPriceHT.toFixed(2),
        price_ttc: finalPriceTTC.toFixed(2),
      } as any,
      payment_method_types: ["card", "paypal"],
    });

    console.log("Secure Checkout session created:", session.id);
    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Critical error in payment session creation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
