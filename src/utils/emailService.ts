
import { toast } from "@/hooks/use-toast";
import { QuoteFormValues } from "@/components/quote-form/quoteFormSchema";
import { supabase } from "@/integrations/supabase/client";

export const sendQuoteEmail = async (quoteData: QuoteFormValues) => {
  try {
    // Formatage des données pour l'affichage
    const formattedData = {
      // Informations du véhicule
      vehicleInfo: {
        type: quoteData.vehicleType,
        brand: quoteData.brand,
        model: quoteData.model,
        year: quoteData.year,
        licensePlate: quoteData.licensePlate,
        fuelType: quoteData.fuelType
      },
      // Adresse de prise en charge
      pickupAddress: quoteData.pickupAddress,
      // Adresse de livraison
      deliveryAddress: quoteData.deliveryAddress,
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

    // Enregistrement dans la base de données si l'utilisateur est connecté
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      // Génération d'un numéro de devis simple
      const quoteNumber = `QT-${Date.now().toString().substring(0, 10)}`;
      
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          quote_number: quoteNumber,
          pickup_address: quoteData.pickupAddress,
          delivery_address: quoteData.deliveryAddress,
          vehicles: {
            type: quoteData.vehicleType,
            brand: quoteData.brand,
            model: quoteData.model,
            year: quoteData.year,
            license_plate: quoteData.licensePlate,
            fuel_type: quoteData.fuelType
          },
          total_price_ht: 0, // Sera calculé par l'admin
          total_price_ttc: 0, // Sera calculé par l'admin
          distance: "À déterminer",
          status: 'pending',
          date_created: new Date().toISOString(),
          pickup_contact: {
            company: quoteData.company,
            first_name: quoteData.firstName,
            last_name: quoteData.lastName,
            email: quoteData.email,
            phone: quoteData.phone
          },
          delivery_contact: {
            company: quoteData.company,
            first_name: quoteData.firstName,
            last_name: quoteData.lastName,
            email: quoteData.email,
            phone: quoteData.phone
          },
          client_id: userData.user.id
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement du devis:", error);
        throw new Error("Erreur lors de l'enregistrement du devis");
      }
    }

    // Simulation d'envoi d'email (à implémenter avec un service réel)
    console.log("Envoi d'email avec les données:", formattedData);
    
    // On considère que l'email a été envoyé avec succès
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};
