import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "contact@dkautomotive.fr";

// Function to format date in French
function formatDateFR(dateStr: string | null): string {
  if (!dateStr) return "Non spécifiée";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Function to generate email HTML content
function generateEmailHTML(missionData: any, isAdmin: boolean): string {
  const title = isAdmin 
    ? "🚗 Nouvelle mission prépayée" 
    : "✅ Confirmation de votre prépaiement";
  
  const intro = isAdmin
    ? `<p>Un client vient de prépayer une mission de convoyage. Voici le récapitulatif :</p>`
    : `<p>Bonjour ${missionData.client_name},</p>
       <p>Nous avons bien reçu votre paiement. Votre mission de convoyage est confirmée. Voici le récapitulatif de votre commande :</p>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9fafb; }
        .section { background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #2563eb; }
        .section-title { font-weight: bold; color: #1a365d; margin-bottom: 10px; font-size: 16px; }
        .info-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
        .info-label { color: #666; }
        .info-value { font-weight: 500; }
        .price-box { background: #1a365d; color: white; padding: 15px; text-align: center; border-radius: 8px; margin-top: 15px; }
        .price { font-size: 24px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">${title}</h1>
      </div>
      <div class="content">
        ${intro}
        
        <div class="section">
          <div class="section-title">👤 Informations client</div>
          <div class="info-row"><span class="info-label">Nom :</span><span class="info-value">${missionData.client_name}</span></div>
          <div class="info-row"><span class="info-label">Email :</span><span class="info-value">${missionData.client_email}</span></div>
          <div class="info-row"><span class="info-label">Téléphone :</span><span class="info-value">${missionData.client_phone || "Non renseigné"}</span></div>
          ${missionData.client_company ? `<div class="info-row"><span class="info-label">Entreprise :</span><span class="info-value">${missionData.client_company}</span></div>` : ""}
        </div>

        <div class="section">
          <div class="section-title">📍 Enlèvement</div>
          <div class="info-row"><span class="info-label">Adresse :</span><span class="info-value">${missionData.pickup_address}</span></div>
          ${missionData.pickup_city ? `<div class="info-row"><span class="info-label">Ville :</span><span class="info-value">${missionData.pickup_postal_code || ""} ${missionData.pickup_city}</span></div>` : ""}
          <div class="info-row"><span class="info-label">Date :</span><span class="info-value">${formatDateFR(missionData.pickup_date)}${missionData.pickup_time ? ` à ${missionData.pickup_time}` : ""}</span></div>
          ${missionData.pickup_contact_name ? `<div class="info-row"><span class="info-label">Contact sur place :</span><span class="info-value">${missionData.pickup_contact_name}${missionData.pickup_contact_phone ? ` - ${missionData.pickup_contact_phone}` : ""}</span></div>` : ""}
        </div>

        <div class="section">
          <div class="section-title">🏁 Livraison</div>
          <div class="info-row"><span class="info-label">Adresse :</span><span class="info-value">${missionData.delivery_address}</span></div>
          ${missionData.delivery_city ? `<div class="info-row"><span class="info-label">Ville :</span><span class="info-value">${missionData.delivery_postal_code || ""} ${missionData.delivery_city}</span></div>` : ""}
          <div class="info-row"><span class="info-label">Date :</span><span class="info-value">${formatDateFR(missionData.delivery_date)}${missionData.delivery_time ? ` à ${missionData.delivery_time}` : ""}</span></div>
          ${missionData.delivery_contact_name ? `<div class="info-row"><span class="info-label">Contact sur place :</span><span class="info-value">${missionData.delivery_contact_name}${missionData.delivery_contact_phone ? ` - ${missionData.delivery_contact_phone}` : ""}</span></div>` : ""}
        </div>

        <div class="section">
          <div class="section-title">🚙 Véhicule</div>
          <div class="info-row"><span class="info-label">Type :</span><span class="info-value">${missionData.vehicle_type || "Non spécifié"}</span></div>
          <div class="info-row"><span class="info-label">Marque / Modèle :</span><span class="info-value">${missionData.vehicle_brand || ""} ${missionData.vehicle_model || ""}</span></div>
          ${missionData.vehicle_year ? `<div class="info-row"><span class="info-label">Année :</span><span class="info-value">${missionData.vehicle_year}</span></div>` : ""}
          ${missionData.license_plate ? `<div class="info-row"><span class="info-label">Immatriculation :</span><span class="info-value">${missionData.license_plate}</span></div>` : ""}
          ${missionData.vehicle_vin ? `<div class="info-row"><span class="info-label">VIN :</span><span class="info-value">${missionData.vehicle_vin}</span></div>` : ""}
        </div>

        <div class="section">
          <div class="section-title">📏 Distance</div>
          <div class="info-row"><span class="info-label">Distance estimée :</span><span class="info-value">${missionData.distance_km ? `${missionData.distance_km} km` : "Non calculée"}</span></div>
        </div>

        ${missionData.notes ? `
        <div class="section">
          <div class="section-title">📝 Notes</div>
          <p>${missionData.notes}</p>
        </div>
        ` : ""}

        <div class="price-box">
          <div>Montant payé</div>
          <div class="price">${missionData.price_ttc ? `${parseFloat(missionData.price_ttc).toFixed(2)} € TTC` : "N/A"}</div>
          <div style="font-size: 12px; opacity: 0.8;">(${missionData.price_ht ? `${parseFloat(missionData.price_ht).toFixed(2)} € HT` : "N/A"})</div>
        </div>
      </div>
      <div class="footer">
        <p>DK Automotive - Service de convoyage automobile</p>
        <p>Pour toute question, contactez-nous à contact@dkautomotive.fr</p>
      </div>
    </body>
    </html>
  `;
}

// Function to send email via Brevo
async function sendEmailViaBrevo(to: string, subject: string, htmlContent: string): Promise<boolean> {
  const brevoApiKey = Deno.env.get("BREVO_API_KEY");
  
  if (!brevoApiKey) {
    console.error("BREVO_API_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "DK Automotive", email: "contact@dkautomotive.fr" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo API error:", response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log("Email sent successfully to:", to, "MessageId:", result.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return false;
  }
}

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

    // Send confirmation emails
    const clientEmailHtml = generateEmailHTML(missionData, false);
    const adminEmailHtml = generateEmailHTML(missionData, true);

    // Send email to client
    const clientEmailSent = await sendEmailViaBrevo(
      missionData.client_email,
      "✅ Confirmation de votre prépaiement - DK Automotive",
      clientEmailHtml
    );
    console.log("Client email sent:", clientEmailSent);

    // Send email to admin
    const adminEmailSent = await sendEmailViaBrevo(
      ADMIN_EMAIL,
      `🚗 Nouvelle mission prépayée - ${missionData.client_name}`,
      adminEmailHtml
    );
    console.log("Admin email sent:", adminEmailSent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        mission_id: mission.id,
        message: "Payment verified and mission created",
        emails_sent: {
          client: clientEmailSent,
          admin: adminEmailSent
        }
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
