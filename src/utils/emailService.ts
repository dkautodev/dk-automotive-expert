
import { toast } from "@/hooks/use-toast";
import { QuoteFormValues } from "@/components/quote-form/quoteFormSchema";

export const sendQuoteEmail = async (quoteData: QuoteFormValues) => {
  try {
    // Formatage des données pour l'affichage
    const formattedData = {
      // Informations du véhicule
      vehicleInfo: {
        type: quoteData.vehicle_type,
        brand: quoteData.brand,
        model: quoteData.model,
        year: quoteData.year,
        licensePlate: quoteData.licensePlate,
        fuelType: quoteData.fuel
      },
      // Adresse de prise en charge
      pickupAddress: quoteData.pickup_address,
      // Adresse de livraison
      deliveryAddress: quoteData.delivery_address,
      // Contact
      contact: {
        company: quoteData.company,
        firstName: quoteData.firstName,
        lastName: quoteData.lastName, 
        email: quoteData.email,
        phone: quoteData.phone
      },
      // Date de création
      dateCreated: new Date().toLocaleString('fr-FR')
    };

    // Simulation d'envoi d'email (à implémenter avec un service réel comme Brevo)
    console.log("Envoi d'email avec les données:", formattedData);
    
    // Simulation de succès d'envoi
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};
