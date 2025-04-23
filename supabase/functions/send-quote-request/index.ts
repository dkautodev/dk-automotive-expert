
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
}

// Helper functions for security
const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\\/g, '&#92;')
    .replace(/`/g, '&#96;')
    .replace(/\$/g, '&#36;');
};

const sanitizeRequestData = (data: QuoteRequest): QuoteRequest => {
  const sanitized: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized as QuoteRequest;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:\+33|0)[1-9](?:[\s.-]?[0-9]{2}){4}$/;
  return phoneRegex.test(phone);
};

// Rate limiting map
const requestCounts: Map<string, { count: number, timestamp: number }> = new Map();

// Rate limit check
const checkRateLimit = (ip: string, email: string): boolean => {
  const now = Date.now();
  const ipKey = `ip:${ip}`;
  const emailKey = `email:${email}`;
  
  const ipData = requestCounts.get(ipKey) || { count: 0, timestamp: now };
  const emailData = requestCounts.get(emailKey) || { count: 0, timestamp: now };
  
  // Reset counters if older than 1 hour
  if (now - ipData.timestamp > 3600000) {
    ipData.count = 0;
    ipData.timestamp = now;
  }
  
  if (now - emailData.timestamp > 3600000) {
    emailData.count = 0;
    emailData.timestamp = now;
  }
  
  // Increment counters
  ipData.count++;
  emailData.count++;
  
  // Update maps
  requestCounts.set(ipKey, ipData);
  requestCounts.set(emailKey, emailData);
  
  // Allow max 5 requests per hour per IP or email
  return ipData.count <= 5 && emailData.count <= 5;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract client IP for rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for") || "unknown";
    const clientIp = forwardedFor.split(',')[0].trim();
    
    // Detailed logging for debugging
    console.log("==== New quote request received ====");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Client IP:", clientIp);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
    // Parse request body with detailed error handling
    let data: QuoteRequest;
    let rawBody = "";
    
    try {
      rawBody = await req.text();
      console.log("Raw request body:", rawBody);
      
      if (!rawBody || rawBody.trim() === "") {
        throw new Error("Empty request body");
      }
      
      try {
        data = JSON.parse(rawBody);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        throw new Error(`Invalid JSON in request body: ${jsonError.message}`);
      }
      
      console.log("Request body successfully parsed:", data);
    } catch (error) {
      console.error("Error handling request body:", error);
      throw new Error(`Failed to process request body: ${error.message}`);
    }
    
    // Sanitize input data
    data = sanitizeRequestData(data);
    
    // Check rate limiting
    if (!checkRateLimit(clientIp, data.email)) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    
    // Validate essential fields with detailed error messages
    const missingFields = [];
    
    if (!data.firstName) missingFields.push("firstName");
    if (!data.lastName) missingFields.push("lastName");
    if (!data.email) missingFields.push("email");
    if (!data.phone) missingFields.push("phone");
    if (!data.pickup_address) missingFields.push("pickup_address");
    if (!data.delivery_address) missingFields.push("delivery_address");
    
    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(", ")}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    // Validate email and phone
    if (!validateEmail(data.email)) {
      throw new Error("Invalid email format");
    }
    
    if (!validatePhone(data.phone)) {
      throw new Error("Invalid phone format");
    }

    // Prepare HTML email content
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

      console.log("Preparing API requests to Brevo...");
      
      // Add timeout for API calls
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        // Send emails with timeout
        const [dkResponse, clientResponse] = await Promise.all([
          fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "api-key": apiKey
            },
            body: JSON.stringify(emailToDK),
            signal: controller.signal
          }),
          fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "api-key": apiKey
            },
            body: JSON.stringify(emailToClient),
            signal: controller.signal
          })
        ]);
        
        clearTimeout(timeoutId);

        console.log("DK email response status:", dkResponse.status);
        console.log("Client email response status:", clientResponse.status);

        // Logging de la réponse détaillée
        let dkResponseText = "N/A";
        let clientResponseText = "N/A";
        
        try {
          dkResponseText = await dkResponse.text();
          console.log("DK email full response:", dkResponseText);
        } catch (err) {
          console.error("Could not read DK response body:", err);
        }
        
        try {
          clientResponseText = await clientResponse.text();
          console.log("Client email full response:", clientResponseText);
        } catch (err) {
          console.error("Could not read client response body:", err);
        }

        if (!dkResponse.ok) {
          throw new Error(`Error sending email to DK: ${dkResponse.status} - ${dkResponseText}`);
        }
        if (!clientResponse.ok) {
          throw new Error(`Error sending email to client: ${clientResponse.status} - ${clientResponseText}`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Email API request timed out after 10 seconds');
        }
        throw fetchError;
      }

      console.log("Emails sent successfully");
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Emails sent successfully"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      
    } catch (emailError) {
      console.error("Error during email sending:", emailError);
      throw new Error(`Failed to send emails: ${emailError.message}`);
    }

  } catch (error) {
    console.error("Error in send-quote-request function:", error);
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
