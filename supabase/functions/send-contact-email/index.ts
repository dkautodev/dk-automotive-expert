
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
    const data: ContactFormData = await req.json();

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

    // Prépare l'appel à l'API Brevo
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY ?? "",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "DK Automotive Contact",
          email: "contact@dkautomotive.fr" // doit être validé dans Brevo
        },
        to: [
          {
            email: "contact@dkautomotive.fr",
            name: "Contact DK Automotive"
          }
        ],
        replyTo: {
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
        },
        subject: `[DK Automotive] ${data.subject}`,
        htmlContent,
      }),
    });

    const brevoResult = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error("Brevo API error", brevoResult);
      return new Response(
        JSON.stringify({ error: brevoResult?.message || brevoResult }),
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

