
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Utilise la clé d'API Brevo depuis les secrets Supabase
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  subject: string;
  message: string;
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

const sanitizeRequestData = (data: ContactFormData): ContactFormData => {
  const sanitized: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized as ContactFormData;
};

serve(async (req: Request) => {
  // Gérer le preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérification de la clé API
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Configuration de la clé API manquante" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log HTTP request headers for debugging
    console.log("==== New contact request received ====");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
    // Read and log body
    let rawBody = "";
    try {
      rawBody = await req.text();
      console.log("Raw request body:", rawBody);
      
      if (!rawBody || rawBody.trim() === "") {
        throw new Error("Empty request body");
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      throw new Error(`Failed to read request body: ${bodyError.message}`);
    }
    
    // Parse body
    let data: ContactFormData;
    try {
      data = JSON.parse(rawBody);
      console.log("Parsed data:", data);
    } catch (parseError) {
      console.error("Error parsing JSON body:", parseError);
      return new Response(
        JSON.stringify({ error: "Format de données invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Sanitize input
    data = sanitizeRequestData(data);

    // Validation des données
    if (!data.email || !data.firstName || !data.lastName || !data.subject || !data.message) {
      console.error("Données de formulaire incomplètes:", data);
      return new Response(
        JSON.stringify({ error: "Toutes les informations requises n'ont pas été fournies" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const htmlContent = `
      <h2>Nouveau message de contact du site DK Automotive</h2>
      <p><strong>Nom&nbsp;:</strong> ${data.lastName}</p>
      <p><strong>Prénom&nbsp;:</strong> ${data.firstName}</p>
      <p><strong>Société&nbsp;:</strong> ${data.companyName}</p>
      <p><strong>Email&nbsp;:</strong> ${data.email}</p>
      <p><strong>Téléphone&nbsp;:</strong> ${data.phone}</p>
      <hr>
      <p><strong>Objet&nbsp;:</strong> ${data.subject}</p>
      <p><strong>Message&nbsp;:</strong></p>
      <pre style="font-family: inherit; font-size: 1rem;">${data.message}</pre>
    `;

    const toEmail = "contact@dkautomotive.fr";
    const fromEmail = "contact@dkautomotive.fr"; // Doit être validé dans Brevo

    const requestBody = {
      sender: {
        name: "DK Automotive Contact",
        email: fromEmail
      },
      to: [
        {
          email: toEmail,
          name: "Contact DK Automotive"
        }
      ],
      replyTo: {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      },
      subject: `[DK Automotive] ${data.subject}`,
      htmlContent,
    };

    console.log("Envoi à Brevo avec les données:", JSON.stringify(requestBody));

    // Add timeout for API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      // Prépare l'appel à l'API Brevo
      const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      let brevoResult;
      let responseText = "";
      
      try {
        responseText = await brevoResponse.text();
        console.log(`Réponse Brevo brute (${brevoResponse.status}):`, responseText);
        
        if (responseText) {
          brevoResult = JSON.parse(responseText);
        }
      } catch (parseErr) {
        console.error("Erreur lors du parsing de la réponse Brevo:", parseErr);
        brevoResult = { parseError: true };
      }

      console.log(`Réponse Brevo (${brevoResponse.status}):`, brevoResult || "No parsed result");

      if (!brevoResponse.ok) {
        console.error("Brevo API error:", brevoResult);
        return new Response(
          JSON.stringify({ 
            error: (brevoResult && brevoResult.message) ? brevoResult.message : "Erreur lors de l'envoi de l'email",
            status: brevoResponse.status,
            details: responseText
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ success: true, messageId: brevoResult?.messageId }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Email API request timed out after 10 seconds');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Error in send-contact-email:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
