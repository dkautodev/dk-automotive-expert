
// Edge Function to send contact form submissions to contact@dkautomotive.fr

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactFormData = await req.json();

    const html = `
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

    const send = await resend.emails.send({
      from: "DK Automotive Contact <onboarding@resend.dev>",
      to: ["contact@dkautomotive.fr"],
      subject: `[DK Automotive] ${data.subject}`,
      html,
      reply_to: data.email,
    });

    if (send.error) {
      console.error("Resend error", send.error);
      return new Response(
        JSON.stringify({ error: send.error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
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
