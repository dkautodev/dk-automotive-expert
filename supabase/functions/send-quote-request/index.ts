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
      subject: `🚗 Nouvelle demande de devis - ${data.company || `${data.firstName} ${data.lastName}`}`,
      htmlContent: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f5f7fa; padding: 32px;">
          <div style="background: #fff; border-radius: 8px; max-width: 680px; margin: auto; padding: 32px; box-shadow: 0 4px 32px rgba(55, 92, 194, 0.10); border: 1px solid #e2e8f0;">
            <img src="https://dkautomotive.fr/logo.png" alt="DK Automotive" style="height: 62px; margin-bottom: 12px; display: block;" />

            <h2 style="color: #375cc2; margin-bottom: 4px;">Nouvelle demande de devis</h2>
            <p style="color: #334155; font-size:15px; margin-top: 0;">Vous venez de recevoir une demande via le formulaire en ligne.</p>
            <hr style="margin: 20px 0;">
            
            <h3 style="color:#375cc2;">Informations du contact</h3>
            <ul style="color: #334155; font-size:15px; list-style: none; padding:0; margin:0;">
              <li><b>Société :</b> ${data.company || '-'}</li>
              <li><b>Nom :</b> ${data.firstName} ${data.lastName}</li>
              <li><b>Email :</b> <a href="mailto:${data.email}" style="color:#4f46e5">${data.email}</a></li>
              <li><b>Téléphone :</b> <a href="tel:${data.phone}" style="color:#4f46e5">${data.phone}</a></li>
            </ul>

            <h3 style="color:#375cc2; margin-top:28px;">Détails du transport</h3>
            <ul style="color: #334155; font-size:15px; list-style: none; padding:0;">
              <li><b>Adresse de prise en charge :</b><br>${data.pickup_address}</li>
              <li><b>Adresse de livraison :</b><br>${data.delivery_address}</li>
              <li><b>Catégorie de véhicule :</b> ${data.vehicle_type}</li>
            </ul>

            ${(data.distance || data.priceHT || data.priceTTC) ? `
              <h3 style="color:#375cc2; margin-top:28px;">Devis calculé :</h3>
              <ul style="color: #334155; font-size:15px; list-style: none; padding:0;">
                ${data.distance ? `<li><b>Distance :</b> ${data.distance} km</li>` : ''}
                ${data.priceHT ? `<li><b>Prix HT :</b> ${data.priceHT} €</li>` : ''}
                ${data.priceTTC ? `<li><b>Prix TTC :</b> ${data.priceTTC} €</li>` : ''}
              </ul>
            ` : ''}

            ${(data.brand || data.model || data.year || data.fuel || data.licensePlate || data.vin) ? `
              <h3 style="color:#375cc2; margin-top:28px;">Informations sur le véhicule :</h3>
              <ul style="color: #334155; font-size:15px; list-style: none; padding:0;">
                ${data.brand ? `<li><b>Marque :</b> ${data.brand}</li>` : ''}
                ${data.model ? `<li><b>Modèle :</b> ${data.model}</li>` : ''}
                ${data.year ? `<li><b>Année :</b> ${data.year}</li>` : ''}
                ${data.fuel ? `<li><b>Carburant :</b> ${data.fuel}</li>` : ''}
                ${data.licensePlate ? `<li><b>Immatriculation :</b> ${data.licensePlate}</li>` : ''}
                ${data.vin ? `<li><b>VIN :</b> ${data.vin}</li>` : ''}
              </ul>
            ` : ''}

            ${data.additionalInfo ? `
              <h4 style="color:#375cc2; margin-top:28px;">Informations complémentaires :</h4>
              <p style="color: #334155; font-size:15px;">${data.additionalInfo}</p>
            ` : ''}

            <hr style="margin: 30px 0;">
            <p style="font-size:12px; color: #64748b;">Demande transmise le ${new Date(data.timestamp).toLocaleString('fr-FR')}<br>
            — N° IP : —<br>
            __Contact généré depuis le site dkautomotive.fr__</p>
          </div>
        </div>
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
      subject: "Votre demande de devis DK Automotive – confirmation",
      htmlContent: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f5f7fa; padding: 32px;">
          <div style="background: #fff; border-radius: 8px; max-width: 680px; margin: auto; padding: 32px; box-shadow: 0 4px 32px rgba(55, 92, 194, 0.10); border: 1px solid #e2e8f0;">
            <img src="https://dkautomotive.fr/logo.png" alt="DK Automotive" style="height: 62px; margin-bottom: 12px; display: block;" />

            <h2 style="color: #375cc2; margin-bottom: 4px;">Merci pour votre demande !</h2>
            <p style="color: #334155; font-size:15px; margin-top: 0;">
              Bonjour ${data.firstName},<br>
              Nous vous confirmons la bonne réception de votre demande de devis pour un transport de véhicule.
            </p>
            <div style="background: #f1f5f9; padding: 18px 28px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size:15px;">Voici un récapitulatif :</p>
              <ul style="font-size:15px; color:#334155; padding-left:1.3em;">
                <li><b>Départ :</b> ${data.pickup_address}</li>
                <li><b>Arrivée :</b> ${data.delivery_address}</li>
                <li><b>Véhicule :</b> ${data.vehicle_type}${data.brand ? ` — ${data.brand}` : ''}${data.model ? ` ${data.model}` : ''}${data.year ? ` (${data.year})` : ''}</li>
                ${data.distance ? `<li><b>Distance estimée :</b> ${data.distance} km</li>` : ''}
                ${data.priceHT ? `<li><b>Estimation prix HT :</b> ${data.priceHT} €</li>` : ''}
                ${data.priceTTC ? `<li><b>Estimation prix TTC :</b> ${data.priceTTC} €</li>` : ''}
              </ul>
              ${data.additionalInfo ? `<p style="margin:0; font-size:14px;"><b>Complément :</b><br>${data.additionalInfo}</p>` : ''}
            </div>
            <p style="color: #334155; font-size:15px;">Notre équipe va étudier votre demande et vous recontactera sous 24h ouvrées pour un devis personnalisé.<br>
              Si votre demande est urgente, contactez-nous directement :</p>
            <ul style="color: #334155; font-size:15px; list-style:none; padding:0; margin:0;">
              <li><b>Email :</b> <a style="color:#4f46e5" href="mailto:contact@dkautomotive.fr">contact@dkautomotive.fr</a></li>
              <li><b>Téléphone :</b> <a style="color:#4f46e5" href="tel:0972588582">09 72 58 85 82</a></li>
            </ul>
            <p style="font-size:13px; color: #64748b; margin-top:32px;">
              Cette confirmation vous est envoyée automatiquement.<br>
              L’équipe DK Automotive vous remercie de votre confiance.<br>
              <a href="https://dkautomotive.fr" style="color:#4f46e5; text-decoration:underline;">dkautomotive.fr</a>
            </p>
          </div>
        </div>
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
