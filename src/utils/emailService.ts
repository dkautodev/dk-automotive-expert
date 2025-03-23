
import { QuoteFormValues } from '@/components/quote-form/quoteFormSchema';

export const sendQuoteEmail = async (formData: QuoteFormValues): Promise<void> => {
  try {
    // Construction des adresses détaillées
    const pickupAddressDetails = `
      Numéro: ${formData.pickupStreetNumber}
      Type de voie: ${formData.pickupStreetType}
      Nom de voie: ${formData.pickupStreetName}
      ${formData.pickupComplement ? `Complément: ${formData.pickupComplement}` : ''}
      Code postal: ${formData.pickupPostalCode}
      Ville: ${formData.pickupCity}
      Pays: ${formData.pickupCountry}
    `;
    
    const deliveryAddressDetails = `
      Numéro: ${formData.deliveryStreetNumber}
      Type de voie: ${formData.deliveryStreetType}
      Nom de voie: ${formData.deliveryStreetName}
      ${formData.deliveryComplement ? `Complément: ${formData.deliveryComplement}` : ''}
      Code postal: ${formData.deliveryPostalCode}
      Ville: ${formData.deliveryCity}
      Pays: ${formData.deliveryCountry}
    `;

    // Construction du corps de l'email
    const emailBody = `
      NOUVELLE DEMANDE DE DEVIS - COLD
      
      -- INFORMATIONS DU VÉHICULE --
      Type de véhicule: ${formData.vehicleType}
      Marque: ${formData.brand}
      Modèle: ${formData.model}
      Année: ${formData.year}
      Immatriculation: ${formData.licensePlate}
      Carburant: ${formData.fuelType}
      
      -- ADRESSE DE PRISE EN CHARGE --
      ${pickupAddressDetails}
      
      -- ADRESSE DE LIVRAISON --
      ${deliveryAddressDetails}
      
      -- CONTACT --
      ${formData.company ? `Société: ${formData.company}` : ''}
      Nom: ${formData.lastName}
      Prénom: ${formData.firstName}
      Email: ${formData.email}
      Téléphone: ${formData.phone}
      
      Demande reçue le: ${new Date().toLocaleString('fr-FR')}
    `;

    // Configuration de la requête d'envoi d'email
    // Utilisation d'un service de messagerie tiers (EmailJS)
    const serviceID = 'default_service'; // Remplacer par votre service ID
    const templateID = 'template_quote'; // Remplacer par votre template ID
    const userID = 'user_id'; // Remplacer par votre user ID

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceID,
        template_id: templateID,
        user_id: userID,
        template_params: {
          to_email: 'dkautomotive70@gmail.com',
          subject: 'Nouvelle demande de devis - COLD',
          message: emailBody,
          from_name: `${formData.firstName} ${formData.lastName}`,
          reply_to: formData.email,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'envoi de l'email: ${response.statusText}`);
    }

    // Utilisation de mailto comme solution de secours
    // Cette partie sera exécutée si vous n'avez pas configuré EmailJS
    const mailtoLink = `mailto:dkautomotive70@gmail.com?subject=Nouvelle demande de devis - COLD&body=${encodeURIComponent(emailBody)}`;
    
    // Ouvrir le lien mailto (cela ouvrira le client de messagerie de l'utilisateur)
    window.open(mailtoLink);

    console.log('Email envoyé avec succès');
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};
