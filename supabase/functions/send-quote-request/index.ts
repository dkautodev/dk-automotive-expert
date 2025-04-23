
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  // Informations de contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  
  // Informations du véhicule
  mission_type: string;
  vehicle_type: string;
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  
  // Adresses
  pickup_address: string;
  delivery_address: string;
  
  // Dates et heures
  pickup_date: string;
  pickup_time: string;
  delivery_date: string;
  delivery_time: string;
  
  // Contacts
  pickup_contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  delivery_contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  
  additional_info?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set");
    }

    const data: QuoteRequest = await req.json();
    console.log("Données du devis reçues:", JSON.stringify(data));

    const htmlContent = `
      <h2>Nouvelle demande de devis</h2>
      
      <h3>Informations du demandeur</h3>
      <p><strong>Nom :</strong> ${data.lastName}</p>
      <p><strong>Prénom :</strong> ${data.firstName}</p>
      <p><strong>Société :</strong> ${data.companyName}</p>
      <p><strong>Email :</strong> ${data.email}</p>
      <p><strong>Téléphone :</strong> ${data.phone}</p>
      
      <h3>Détails de la mission</h3>
      <p><strong>Type de mission :</strong> ${data.mission_type}</p>
      <p><strong>Type de véhicule :</strong> ${data.vehicle_type}</p>
      
      <h3>Informations du véhicule</h3>
      <p><strong>Marque :</strong> ${data.brand}</p>
      <p><strong>Modèle :</strong> ${data.model}</p>
      <p><strong>Année :</strong> ${data.year}</p>
      <p><strong>Carburant :</strong> ${data.fuel}</p>
      <p><strong>Immatriculation :</strong> ${data.licensePlate}</p>
      
      <h3>Adresses</h3>
      <p><strong>Adresse de prise en charge :</strong> ${data.pickup_address}</p>
      <p><strong>Adresse de livraison :</strong> ${data.delivery_address}</p>
      
      <h3>Dates et heures</h3>
      <p><strong>Date de prise en charge :</strong> ${data.pickup_date}</p>
      <p><strong>Heure de prise en charge :</strong> ${data.pickup_time}</p>
      <p><strong>Date de livraison :</strong> ${data.delivery_date}</p>
      <p><strong>Heure de livraison :</strong> ${data.delivery_time}</p>
      
      <h3>Contact prise en charge</h3>
      <p><strong>Nom :</strong> ${data.pickup_contact.lastName}</p>
      <p><strong>Prénom :</strong> ${data.pickup_contact.firstName}</p>
      <p><strong>Email :</strong> ${data.pickup_contact.email}</p>
      <p><strong>Téléphone :</strong> ${data.pickup_contact.phone}</p>
      
      <h3>Contact livraison</h3>
      <p><strong>Nom :</strong> ${data.delivery_contact.lastName}</p>
      <p><strong>Prénom :</strong> ${data.delivery_contact.firstName}</p>
      <p><strong>Email :</strong> ${data.delivery_contact.email}</p>
      <p><strong>Téléphone :</strong> ${data.delivery_contact.phone}</p>
      
      ${data.additional_info ? `
        <h3>Informations complémentaires</h3>
        <p>${data.additional_info}</p>
      ` : ''}
    `;

    const requestBody = {
      sender: {
        name: "DK Automotive Devis",
        email: "contact@dkautomotive.fr"
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
      subject: `[DK Automotive] Nouvelle demande de devis de ${data.firstName} ${data.lastName} - ${data.companyName}`,
      htmlContent,
    };

    console.log("Envoi à Brevo avec les données:", JSON.stringify(requestBody));

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
      throw new Error(brevoResult?.message || JSON.stringify(brevoResult));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-quote-request:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
