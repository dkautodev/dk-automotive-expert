
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
const BUSINESS_EMAIL = 'contact@dkautomotive.fr';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteFormSubmission {
  mission_type?: string;
  vehicle_type: string;
  brand: string;
  model: string;
  licensePlate?: string;
  year?: string;
  fuel_type?: string;
  pickup_address: string;
  delivery_address: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  additionalInfo?: string;
  distance: string;
  priceHT: string;
  priceTTC: string;
  isPerKm: boolean;
  timestamp?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Ensure we only accept POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY is not set');
      throw new Error('API key for email service is not configured');
    }

    // Parse the request body
    const quoteData: QuoteFormSubmission = await req.json();
    console.log('Received quote request data:', quoteData);

    // Validate minimum required data
    if (!quoteData.email || !quoteData.pickup_address || !quoteData.delivery_address || !quoteData.vehicle_type) {
      throw new Error('Missing required fields in quote request');
    }

    // Format the quote for email display
    const formatQuoteDetails = () => {
      const details = [
        `<strong>Type de mission:</strong> ${quoteData.mission_type || 'Livraison'}`,
        `<strong>Véhicule:</strong> ${quoteData.vehicle_type}`,
        `<strong>Marque:</strong> ${quoteData.brand || 'Non spécifié'}`,
        `<strong>Modèle:</strong> ${quoteData.model || 'Non spécifié'}`,
        quoteData.licensePlate ? `<strong>Immatriculation:</strong> ${quoteData.licensePlate}` : '',
        quoteData.year ? `<strong>Année:</strong> ${quoteData.year}` : '',
        quoteData.fuel_type ? `<strong>Carburant:</strong> ${quoteData.fuel_type}` : '',
        `<strong>Adresse de départ:</strong> ${quoteData.pickup_address}`,
        `<strong>Adresse d'arrivée:</strong> ${quoteData.delivery_address}`,
        `<strong>Distance estimée:</strong> ${quoteData.distance} km`,
        `<strong>Type de tarif:</strong> ${quoteData.isPerKm ? 'Prix au kilomètre' : 'Prix forfaitaire'}`,
        `<strong>Prix HT:</strong> ${quoteData.priceHT} €`,
        `<strong>Prix TTC:</strong> ${quoteData.priceTTC} €`,
        `<strong>Entreprise:</strong> ${quoteData.company}`,
        `<strong>Nom:</strong> ${quoteData.firstName} ${quoteData.lastName}`,
        `<strong>Email:</strong> ${quoteData.email}`,
        `<strong>Téléphone:</strong> ${quoteData.phone}`,
        quoteData.additionalInfo ? `<strong>Informations supplémentaires:</strong> ${quoteData.additionalInfo}` : '',
        `<strong>Date de la demande:</strong> ${quoteData.timestamp ? new Date(quoteData.timestamp).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR')}`
      ].filter(Boolean).join('<br />');

      return details;
    };

    // Prepare emails to be sent
    
    // 1. Email to the business
    const businessEmailHtml = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a237e; color: white; padding: 10px 20px; text-align: center; }
          .content { padding: 20px; background-color: #f5f5f5; }
          .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nouvelle demande de devis</h2>
          </div>
          <div class="content">
            <p>Une nouvelle demande de devis a été reçue:</p>
            <div>${formatQuoteDetails()}</div>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé automatiquement depuis le site web DK Automotive.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. Confirmation email to the customer
    const customerEmailHtml = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a237e; color: white; padding: 10px 20px; text-align: center; }
          .content { padding: 20px; background-color: #f5f5f5; }
          .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Confirmation de votre demande de devis</h2>
          </div>
          <div class="content">
            <p>Bonjour ${quoteData.firstName},</p>
            <p>Nous avons bien reçu votre demande de devis et nous vous en remercions.</p>
            <p>Un membre de notre équipe vous contactera dans les plus brefs délais pour discuter de votre projet.</p>
            <p>Voici un récapitulatif de votre demande :</p>
            <div>${formatQuoteDetails()}</div>
          </div>
          <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p>© ${new Date().getFullYear()} DK Automotive. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send both emails using Brevo API
    const emailRequests = [
      // Email to the business
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: 'DK Automotive Website',
            email: 'no-reply@dkautomotive.fr'
          },
          to: [{ email: BUSINESS_EMAIL }],
          subject: `Nouvelle demande de devis de ${quoteData.company} - ${quoteData.firstName} ${quoteData.lastName}`,
          htmlContent: businessEmailHtml
        })
      }),

      // Confirmation email to the customer
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: 'DK Automotive',
            email: 'no-reply@dkautomotive.fr'
          },
          to: [{ email: quoteData.email }],
          subject: 'Confirmation de votre demande de devis - DK Automotive',
          htmlContent: customerEmailHtml
        })
      })
    ];

    // Send the emails and collect responses
    const [businessEmailResponse, customerEmailResponse] = await Promise.all(emailRequests);
    
    console.log(`Business email status: ${businessEmailResponse.status}`);
    console.log(`Customer email status: ${customerEmailResponse.status}`);

    const businessEmailData = await businessEmailResponse.json();
    const customerEmailData = await customerEmailResponse.json();

    console.log('Business email response:', businessEmailData);
    console.log('Customer email response:', customerEmailData);

    // Check for errors
    if (!businessEmailResponse.ok || !customerEmailResponse.ok) {
      throw new Error('Failed to send one or more emails');
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Quote request submitted successfully',
        emailSent: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-quote-request function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
