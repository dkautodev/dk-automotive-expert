
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequestData {
  pickup_address: string;
  delivery_address: string;
  vehicle_type: string;
  brand?: string;
  model?: string;
  year?: string;
  fuel?: string;
  licensePlate?: string;
  vin?: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  additionalInfo?: string;
  distance?: string;
  priceHT?: string;
  priceTTC?: string;
  timestamp: string;
  contactEmail: string;
  destinationEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: QuoteRequestData = await req.json();
    console.log('Données reçues pour le devis:', data);

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      throw new Error("Clé API Brevo non configurée");
    }

    // Email à l'entreprise (contact@dkautomotive.fr)
    const companyEmailPayload = {
      sender: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email
      },
      to: [
        {
          email: data.destinationEmail,
          name: "DK Automotive"
        }
      ],
      subject: `Nouvelle demande de devis - ${data.company}`,
      htmlContent: `
        <h2>Nouvelle demande de devis</h2>
        
        <h3>Informations du contact</h3>
        <p><strong>Société:</strong> ${data.company}</p>
        <p><strong>Nom:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone}</p>
        
        <h3>Transport</h3>
        <p><strong>Adresse de prise en charge:</strong> ${data.pickup_address}</p>
        <p><strong>Adresse de livraison:</strong> ${data.delivery_address}</p>
        <p><strong>Catégorie de véhicule:</strong> ${data.vehicle_type}</p>
        
        ${data.distance ? `
        <h3>Calcul de prix</h3>
        <p><strong>Distance:</strong> ${data.distance} km</p>
        <p><strong>Prix HT:</strong> ${data.priceHT} €</p>
        <p><strong>Prix TTC:</strong> ${data.priceTTC} €</p>
        ` : ''}
        
        ${data.brand || data.model || data.year || data.fuel || data.licensePlate || data.vin ? `
        <h3>Détails du véhicule</h3>
        ${data.brand ? `<p><strong>Marque:</strong> ${data.brand}</p>` : ''}
        ${data.model ? `<p><strong>Modèle:</strong> ${data.model}</p>` : ''}
        ${data.year ? `<p><strong>Année:</strong> ${data.year}</p>` : ''}
        ${data.fuel ? `<p><strong>Carburant:</strong> ${data.fuel}</p>` : ''}
        ${data.licensePlate ? `<p><strong>Immatriculation:</strong> ${data.licensePlate}</p>` : ''}
        ${data.vin ? `<p><strong>VIN:</strong> ${data.vin}</p>` : ''}
        ` : ''}
        
        ${data.additionalInfo ? `
        <h3>Informations complémentaires</h3>
        <p>${data.additionalInfo}</p>
        ` : ''}
        
        <p><em>Demande envoyée le ${new Date(data.timestamp).toLocaleString('fr-FR')}</em></p>
      `
    };

    // Email de confirmation au client
    const clientEmailPayload = {
      sender: {
        name: "DK Automotive",
        email: "contact@dkautomotive.fr"
      },
      to: [
        {
          email: data.contactEmail,
          name: `${data.firstName} ${data.lastName}`
        }
      ],
      subject: "Confirmation de votre demande de devis - DK Automotive",
      htmlContent: `
        <h2>Merci pour votre demande de devis</h2>
        
        <p>Bonjour ${data.firstName},</p>
        
        <p>Nous avons bien reçu votre demande de devis pour le transport d'un véhicule.</p>
        
        <h3>Récapitulatif de votre demande</h3>
        <p><strong>Société:</strong> ${data.company}</p>
        <p><strong>Adresse de prise en charge:</strong> ${data.pickup_address}</p>
        <p><strong>Adresse de livraison:</strong> ${data.delivery_address}</p>
        <p><strong>Catégorie de véhicule:</strong> ${data.vehicle_type}</p>
        
        ${data.distance ? `
        <p><strong>Distance estimée:</strong> ${data.distance} km</p>
        <p><strong>Prix indicatif HT:</strong> ${data.priceHT} €</p>
        <p><strong>Prix indicatif TTC:</strong> ${data.priceTTC} €</p>
        ` : ''}
        
        <p>Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais pour vous proposer un devis personnalisé.</p>
        
        <p>Si vous avez des questions, n'hésitez pas à nous contacter :</p>
        <ul>
          <li>Email: contact@dkautomotive.fr</li>
          <li>Téléphone: ${data.phone}</li>
        </ul>
        
        <p>Cordialement,<br>L'équipe DK Automotive</p>
        
        <p><em>Demande envoyée le ${new Date(data.timestamp).toLocaleString('fr-FR')}</em></p>
      `
    };

    // Envoi des emails via Brevo
    const brevoHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY
    };

    // Envoi email à l'entreprise
    const companyEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: brevoHeaders,
      body: JSON.stringify(companyEmailPayload)
    });

    if (!companyEmailResponse.ok) {
      const errorText = await companyEmailResponse.text();
      console.error('Erreur envoi email entreprise:', errorText);
      throw new Error(`Erreur envoi email entreprise: ${companyEmailResponse.statusText}`);
    }

    // Envoi email de confirmation au client
    const clientEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: brevoHeaders,
      body: JSON.stringify(clientEmailPayload)
    });

    if (!clientEmailResponse.ok) {
      const errorText = await clientEmailResponse.text();
      console.error('Erreur envoi email client:', errorText);
      throw new Error(`Erreur envoi email client: ${clientEmailResponse.statusText}`);
    }

    console.log('Emails envoyés avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Devis envoyé avec succès' 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Erreur dans send-quote-request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
