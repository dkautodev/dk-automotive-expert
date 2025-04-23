
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
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: QuoteRequest = await req.json();
    
    console.log("Received quote request data:", data);
    
    // Email pour DK Automotive
    const emailToDK = {
      sender: { name: "DK Automotive", email: "noreply@dkautomotive.fr" },
      to: [{ email: "contact@dkautomotive.fr" }],
      subject: `Nouvelle demande de devis - ${data.firstName} ${data.lastName} (${data.company})`,
      htmlContent: `
        <h2>Nouvelle demande de devis</h2>
        <h3>Type de mission</h3>
        <p>${data.mission_type === 'livraison' ? 'Livraison' : 'Restitution'}</p>
        
        <h3>Adresses</h3>
        <p><strong>Départ :</strong> ${data.pickup_address}</p>
        <p><strong>Arrivée :</strong> ${data.delivery_address}</p>
        
        ${data.distance ? `<p><strong>Distance :</strong> ${data.distance} km</p>` : ''}
        ${data.priceHT ? `<p><strong>Prix HT :</strong> ${data.priceHT} €</p>` : ''}
        ${data.priceTTC ? `<p><strong>Prix TTC :</strong> ${data.priceTTC} €</p>` : ''}
        
        <h3>Véhicule</h3>
        <p><strong>Type :</strong> ${data.vehicle_type}</p>
        ${data.brand ? `<p><strong>Marque :</strong> ${data.brand}</p>` : ''}
        ${data.model ? `<p><strong>Modèle :</strong> ${data.model}</p>` : ''}
        ${data.year ? `<p><strong>Année :</strong> ${data.year}</p>` : ''}
        ${data.fuel ? `<p><strong>Carburant :</strong> ${data.fuel}</p>` : ''}
        ${data.licensePlate ? `<p><strong>Immatriculation :</strong> ${data.licensePlate}</p>` : ''}
        
        <h3>Contact</h3>
        <p><strong>Société :</strong> ${data.company}</p>
        <p><strong>Nom :</strong> ${data.lastName}</p>
        <p><strong>Prénom :</strong> ${data.firstName}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.phone}</p>
      `
    };

    // Email de confirmation pour le client
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
        <p><strong>Type de mission :</strong> ${data.mission_type === 'livraison' ? 'Livraison' : 'Restitution'}</p>
        <p><strong>Départ :</strong> ${data.pickup_address}</p>
        <p><strong>Arrivée :</strong> ${data.delivery_address}</p>
        ${data.distance ? `<p><strong>Distance estimée :</strong> ${data.distance} km</p>` : ''}
        <p>Cordialement,<br>L'équipe DK Automotive</p>
      `
    };

    try {
      // Envoi des emails via Brevo
      console.log("Sending emails via Brevo...");
      
      const [dkResponse, clientResponse] = await Promise.all([
        fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": Deno.env.get("BREVO_API_KEY")!
          },
          body: JSON.stringify(emailToDK)
        }),
        fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": Deno.env.get("BREVO_API_KEY")!
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
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
