
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  mission_type: string;
  vehicle_type: string;
  brand: string;
  model: string;
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
  isPerKm?: boolean;
  additionalInfo?: string;
  // Détails supplémentaires pour les adresses
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request for CORS");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔄 Starting send-quote-request function");
    console.log("🔍 Request method:", req.method);
    console.log("📍 Request URL:", req.url);

    // Extract client IP for logging purposes
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    console.log("👤 Client IP:", clientIp);
    
    // Parse request body
    const bodyText = await req.text();
    console.log("📄 Raw request body length:", bodyText.length);
    
    if (!bodyText || bodyText.trim() === "") {
      console.error("❌ Empty request body");
      throw new Error("Request body is empty");
    }
    
    let data: QuoteRequest;
    try {
      data = JSON.parse(bodyText);
      console.log("✅ Successfully parsed request body");
      console.log("📋 Form data summary:", {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        company: data.company,
        vehicle: `${data.brand} ${data.model} (${data.vehicle_type})`,
        addresses: {
          pickup: data.pickup_address,
          delivery: data.delivery_address
        },
        price: {
          type: data.isPerKm ? "Per KM" : "Fixed",
          ht: data.priceHT,
          ttc: data.priceTTC,
          distance: data.distance
        }
      });
    } catch (error) {
      console.error("❌ Failed to parse JSON:", error);
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
    
    // Validate essential fields
    const requiredFields = [
      "firstName", 
      "lastName", 
      "email", 
      "phone", 
      "company",
      "pickup_address", 
      "delivery_address",
      "vehicle_type",
      "brand",
      "model"
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Prepare email content
    const missionTypeLabel = data.mission_type === 'livraison' ? 'Livraison' : 'Restitution';
    
    // Format pickup address details if available
    const pickupAddressDetails = [
      data.pickupStreetNumber,
      data.pickupStreetType,
      data.pickupStreetName,
      data.pickupComplement,
      data.pickupPostalCode,
      data.pickupCity,
      data.pickupCountry
    ].filter(Boolean).join(' ');
    
    // Format delivery address details if available
    const deliveryAddressDetails = [
      data.deliveryStreetNumber,
      data.deliveryStreetType,
      data.deliveryStreetName,
      data.deliveryComplement,
      data.deliveryPostalCode,
      data.deliveryCity,
      data.deliveryCountry
    ].filter(Boolean).join(' ');

    // Helper function to create detail rows in HTML
    const createDetailRow = (label: string, value?: string) =>
      value ? `<p><strong>${label}:</strong> ${value}</p>` : "";
    
    // Vehicle information HTML block
    const vehicleInfoHtml = `
      ${createDetailRow("Type de véhicule", data.vehicle_type)}
      ${createDetailRow("Marque", data.brand)}
      ${createDetailRow("Modèle", data.model)}
      ${createDetailRow("Année", data.year)}
      ${createDetailRow("Carburant", data.fuel)}
      ${createDetailRow("Immatriculation", data.licensePlate)}
    `;

    // Address HTML blocks
    const pickupAddressHtml = pickupAddressDetails ? 
      `<p><strong>Détails adresse départ:</strong> ${pickupAddressDetails}</p>` : "";
    
    const deliveryAddressHtml = deliveryAddressDetails ? 
      `<p><strong>Détails adresse arrivée:</strong> ${deliveryAddressDetails}</p>` : "";

    // Contact HTML block
    const contactHtml = `
      ${createDetailRow("Société", data.company)}
      ${createDetailRow("Nom", data.lastName)}
      ${createDetailRow("Prénom", data.firstName)}
      ${createDetailRow("Email", data.email)}
      ${createDetailRow("Téléphone", data.phone)}
    `;

    // Distance and price information HTML blocks
    const distanceHtml = data.distance ? 
      `<p><strong>Distance estimée:</strong> ${data.distance} km</p>` : "";
    
    let priceInfoHtml = "";
    if (data.priceHT && data.priceTTC) {
      if (data.isPerKm) {
        const pricePerKm = parseFloat(data.priceHT) / parseFloat(data.distance || "1");
        priceInfoHtml = `
          <p><strong>Type de tarif:</strong> Prix au kilomètre</p>
          <p><strong>Prix HT:</strong> ${data.priceHT} € (${pricePerKm.toFixed(2)} €/km)</p>
          <p><strong>Prix TTC:</strong> ${data.priceTTC} €</p>
        `;
      } else {
        priceInfoHtml = `
          <p><strong>Type de tarif:</strong> Prix forfaitaire</p>
          <p><strong>Prix HT:</strong> ${data.priceHT} €</p>
          <p><strong>Prix TTC:</strong> ${data.priceTTC} €</p>
        `;
      }
    }
    
    // Additional information HTML block
    const additionalInfoHtml = data.additionalInfo ? 
      `<p><strong>Informations complémentaires:</strong> ${data.additionalInfo}</p>` : "";

    // Email to DK Automotive
    const emailToDK = {
      sender: { name: "DK Automotive", email: "noreply@dkautomotive.fr" },
      to: [{ email: "contact@dkautomotive.fr" }],
      subject: `Nouvelle demande de devis - ${data.firstName} ${data.lastName} (${data.company})`,
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
        ${priceInfoHtml}
        
        <h3>Véhicule</h3>
        ${vehicleInfoHtml}
        
        <h3>Contact</h3>
        ${contactHtml}
        ${additionalInfoHtml}
        
        <p>Demande envoyée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
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
        <p>Notre équipe étudiera votre demande et vous répondra dans les meilleurs délais.</p>
        
        <h3>Récapitulatif de votre demande</h3>
        <h4>Type de mission</h4>
        <p>${missionTypeLabel}</p>
        
        <h4>Adresse de départ</h4>
        <p>${data.pickup_address}</p>
        ${pickupAddressHtml}
        
        <h4>Adresse d'arrivée</h4>
        <p>${data.delivery_address}</p>
        ${deliveryAddressHtml}
        ${distanceHtml}
        ${priceInfoHtml}
        
        <h4>Détails véhicule</h4>
        ${vehicleInfoHtml}
        
        <h4>Vos coordonnées</h4>
        ${contactHtml}
        ${additionalInfoHtml}
        
        <p>Cordialement,<br>L'équipe DK Automotive</p>
      `
    };

    // Send emails via Brevo API
    console.log("📧 Preparing to send emails via Brevo API");
    
    const apiKey = Deno.env.get("BREVO_API_KEY");
    if (!apiKey) {
      console.error("❌ BREVO_API_KEY is not configured");
      throw new Error("La clé API Brevo n'est pas configurée");
    }
    
    // Set up request options with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
    
    const requestOptions = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      signal: controller.signal
    };
    
    try {
      console.log("📧 Sending email to DK Automotive...");
      const dkResponse = await fetch(
        "https://api.brevo.com/v3/smtp/email", 
        {
          ...requestOptions,
          body: JSON.stringify(emailToDK)
        }
      );
      
      const dkResponseText = await dkResponse.text();
      console.log("🔄 DK email API response status:", dkResponse.status);
      console.log("🔄 DK email API response body:", dkResponseText);
      
      if (!dkResponse.ok) {
        throw new Error(`DK email failed: ${dkResponse.status} - ${dkResponseText}`);
      }
      
      console.log("📧 Sending confirmation email to client...");
      const clientResponse = await fetch(
        "https://api.brevo.com/v3/smtp/email", 
        {
          ...requestOptions,
          body: JSON.stringify(emailToClient)
        }
      );
      
      const clientResponseText = await clientResponse.text();
      console.log("🔄 Client email API response status:", clientResponse.status);
      console.log("🔄 Client email API response body:", clientResponseText);
      
      if (!clientResponse.ok) {
        throw new Error(`Client email failed: ${clientResponse.status} - ${clientResponseText}`);
      }
      
      console.log("✅ Both emails sent successfully!");
    } catch (error) {
      console.error("❌ Error sending emails:", error);
      throw new Error(`Failed to send emails: ${error.message}`);
    } finally {
      clearTimeout(timeoutId);
    }
    
    // Return success response
    return new Response(JSON.stringify({ 
      success: true,
      message: "Emails sent successfully"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("❌ Error in send-quote-request function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error",
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
