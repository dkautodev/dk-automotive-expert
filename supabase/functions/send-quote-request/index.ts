
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  mission_type: string;
  vehicle_type: string;
  brand?: string;
  model?: string;
  year?: string;
  fuel?: string;
  licensePlate?: string;
  pickup_address: string;
  delivery_address: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  distance?: string;
  priceHT?: string;
  priceTTC?: string;
  // Include additional optional fields if sent by form
  pickupStreetNumber?: string;
  pickupStreetType?: string;
  pickupStreetName?: string;
  pickupComplement?: string;
  pickupPostalCode?: string;
  pickupCity?: string;
  pickupCountry?: string;
  deliveryStreetNumber?: string;
  deliveryStreetType?: string;
  deliveryStreetName?: string;
  deliveryComplement?: string;
  deliveryPostalCode?: string;
  deliveryCity?: string;
  deliveryCountry?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request info
    console.log("Received request:", req.method, req.url);
    
    const contentType = req.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);
    
    let data: QuoteRequest;
    try {
      data = await req.json();
      console.log("Parsed request body:", data);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      const rawBody = await req.text();
      console.log("Raw body:", rawBody);
      throw new Error(`Invalid request body: ${parseError.message}`);
    }
    
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      throw new Error("Missing required contact information");
    }
    if (!data.pickup_address || !data.delivery_address) {
      throw new Error("Missing required address information");
    }

    // Prepare full HTML email content using all available fields, displayed clearly
    const createDetailRow = (label: string, value?: string) =>
      value ? `<p><strong>${label}:</strong> ${value}</p>` : "";
    
    const missionTypeLabel = data.mission_type === 'livraison' ? 'Livraison' : 'Restitution';

    const pickupFullAddress = [
      data.pickupStreetNumber,
      data.pickupStreetType,
      data.pickupStreetName,
      data.pickupComplement,
      data.pickupPostalCode,
      data.pickupCity,
      data.pickupCountry
    ].filter(Boolean).join(' ');

    const deliveryFullAddress = [
      data.deliveryStreetNumber,
      data.deliveryStreetType,
      data.deliveryStreetName,
      data.deliveryComplement,
      data.deliveryPostalCode,
      data.deliveryCity,
      data.deliveryCountry
    ].filter(Boolean).join(' ');

    const vehicleInfoHtml = `
      ${createDetailRow("Type de véhicule", data.vehicle_type)}
      ${createDetailRow("Marque", data.brand)}
      ${createDetailRow("Modèle", data.model)}
      ${createDetailRow("Année", data.year)}
      ${createDetailRow("Carburant", data.fuel)}
      ${createDetailRow("Immatriculation", data.licensePlate)}
    `;

    const pickupAddressHtml = pickupFullAddress ? `<p><strong>Adresse complète départ :</strong> ${pickupFullAddress}</p>` : "";

    const deliveryAddressHtml = deliveryFullAddress ? `<p><strong>Adresse complète arrivée :</strong> ${deliveryFullAddress}</p>` : "";

    const contactHtml = `
      ${createDetailRow("Société", data.company)}
      ${createDetailRow("Nom", data.lastName)}
      ${createDetailRow("Prénom", data.firstName)}
      ${createDetailRow("Email", data.email)}
      ${createDetailRow("Téléphone", data.phone)}
    `;

    const distanceHtml = data.distance ? `<p><strong>Distance estimée :</strong> ${data.distance} km</p>` : "";
    const priceHTHtml = data.priceHT ? `<p><strong>Prix HT estimé :</strong> ${data.priceHT} €</p>` : "";
    const priceTTCHtml = data.priceTTC ? `<p><strong>Prix TTC estimé :</strong> ${data.priceTTC} €</p>` : "";

    // Email to DK Automotive
    const emailToDK = {
      sender: { name: "DK Automotive", email: "noreply@dkautomotive.fr" },
      to: [{ email: "contact@dkautomotive.fr" }],
      subject: `Nouvelle demande de devis - ${data.firstName} ${data.lastName} (${data.company || "sans société"})`,
      htmlContent: `
        <h2>Nouvelle demande de devis</h2>
        <h3>Type de mission</h3>
        <p>${missionTypeLabel}</p>
        <h3>Adresses</h3>
        <p><strong>Adresse départ:</strong> ${data.pickup_address}</p>
        ${pickupAddressHtml}
        <p><strong>Adresse arrivée:</strong> ${data.delivery_address}</p>
        ${deliveryAddressHtml}
        ${distanceHtml}
        ${priceHTHtml}
        ${priceTTCHtml}
        <h3>Véhicule</h3>
        ${vehicleInfoHtml}
        <h3>Contact</h3>
        ${contactHtml}
      `
    };

    // Confirmation email to client
    const emailToClient = {
      sender: { name: "DK Automotive", email: "noreply@dkautomotive.fr" },
      to: [{ email: data.email }],
      subject: "Confirmation de votre demande de devis - DK Automotive",
      htmlContent: `
        <h2>Merci pour votre demande de devis</h2>
        <p>Cher(e) ${data.firstName} ${data.lastName},</p>
        <p>Nous avons bien reçu votre demande de devis pour le transport de votre véhicule.</p>
        <p>Notre équipe étudiera votre demande et vous répondra dans les 24 heures ouvrées.</p>
        <h3>Récapitulatif de votre demande</h3>
        <h4>Type de mission</h4>
        <p>${missionTypeLabel}</p>
        <h4>Adresse départ</h4>
        <p>${data.pickup_address}</p>
        ${pickupAddressHtml}
        <h4>Adresse arrivée</h4>
        <p>${data.delivery_address}</p>
        ${deliveryAddressHtml}
        ${distanceHtml}
        ${priceHTHtml}
        ${priceTTCHtml}
        <h4>Détails véhicule</h4>
        ${vehicleInfoHtml}
        <h4>Contact</h4>
        ${contactHtml}
        <p>Cordialement,<br>L'équipe DK Automotive</p>
      `
    };

    try {
      console.log("Sending emails via Brevo API...");

      const apiKey = Deno.env.get("BREVO_API_KEY");
      if (!apiKey) {
        throw new Error("BREVO_API_KEY n'est pas configurée");
      }

      const [dkResponse, clientResponse] = await Promise.all([
        fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": apiKey
          },
          body: JSON.stringify(emailToDK)
        }),
        fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": apiKey
          },
          body: JSON.stringify(emailToClient)
        })
      ]);

      console.log("DK email response status:", dkResponse.status);
      console.log("Client email response status:", clientResponse.status);

      if (!dkResponse.ok) {
        const dkErrorData = await dkResponse.text();
        console.error("Error sending email to DK:", dkErrorData);
      }
      if (!clientResponse.ok) {
        const clientErrorData = await clientResponse.text();
        console.error("Error sending email to client:", clientErrorData);
      }

      if (!dkResponse.ok || !clientResponse.ok) {
        throw new Error("Failed to send one or more emails");
      }

      console.log("Emails sent successfully");
    } catch (emailError) {
      console.error("Error during email sending:", emailError);
      throw new Error(`Failed to send emails: ${emailError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-quote-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
