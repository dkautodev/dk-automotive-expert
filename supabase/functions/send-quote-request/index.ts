
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    
    // Email pour DK Automotive
    await resend.emails.send({
      from: "DK Automotive <noreply@dkautomotive.fr>",
      to: "contact@dkautomotive.fr",
      subject: `Nouvelle demande de devis - ${data.firstName} ${data.lastName} (${data.company})`,
      html: `
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
      `,
    });
    
    // Email de confirmation pour le client
    await resend.emails.send({
      from: "DK Automotive <noreply@dkautomotive.fr>",
      to: data.email,
      subject: "Confirmation de votre demande de devis - DK Automotive",
      html: `
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
      `,
    });

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
