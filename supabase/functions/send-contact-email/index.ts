
// Edge Function pour envoyer les submissions du formulaire contact via Brevo (ex-Sendinblue)

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

    const data: ContactFormData = await req.json();
    console.log("Données du formulaire reçues:", JSON.stringify(data));

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

    // Prépare l'appel à l'API Brevo
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const brevoResult = await brevoResponse.json();
    console.log(`Réponse Brevo (${brevoResponse.status}):`, JSON.stringify(brevoResult));

    if (!brevoResponse.ok) {
      console.error("Brevo API error", brevoResult);
      return new Response(
        JSON.stringify({ 
          error: brevoResult?.message || JSON.stringify(brevoResult),
          status: brevoResponse.status 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, ...brevoResult }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-contact-email:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
