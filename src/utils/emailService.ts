
import { toast } from "@/hooks/use-toast";
import { QuoteFormValues } from "@/components/quote-form/quoteFormSchema";
import { supabase } from "@/integrations/supabase/client";

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

    // Enregistrement dans la base de données si l'utilisateur est connecté
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      // Génération d'un numéro de mission simple
      const missionNumber = `MISSION-${Date.now().toString().substring(0, 10)}`;
      
      const { data, error } = await supabase
        .from('missions')
        .insert({
          client_id: userData.user.id,
          mission_number: missionNumber,
          status: 'en_attente',
          mission_type: 'livraison',
          pickup_address: quoteData.pickup_address,
          delivery_address: quoteData.delivery_address,
          vehicles: {
            type: quoteData.vehicle_type,
            brand: quoteData.brand,
            model: quoteData.model,
            year: quoteData.year,
            license_plate: quoteData.licensePlate,
            fuel_type: quoteData.fuel
          },
          price_ht: 0, // Sera calculé par l'admin
          price_ttc: 0, // Sera calculé par l'admin
          distance: "À déterminer",
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
          }
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement de la mission:", error);
        throw new Error("Erreur lors de l'enregistrement de la mission");
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
