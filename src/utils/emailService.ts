
import { toast } from "@/hooks/use-toast";
import { QuoteFormValues } from "@/components/quote-form/quoteFormSchema";

// Fonction pour formater l'adresse complète à partir des composants d'adresse
const formatAddress = (
  streetNumber: string, 
  streetType: string, 
  streetName: string, 
  complement: string, 
  postalCode: string, 
  city: string, 
  country: string
): string => {
  const formattedComplement = complement !== "aucun" ? `, ${complement}` : "";
  return `${streetNumber} ${streetType} ${streetName}${formattedComplement}, ${postalCode} ${city}, ${country}`;
};

// Fonction principale pour envoyer l'email du devis
export const sendQuoteEmail = async (data: QuoteFormValues): Promise<void> => {
  try {
    // Formatage des adresses complètes
    const pickupAddress = formatAddress(
      data.pickupStreetNumber,
      data.pickupStreetType,
      data.pickupStreetName,
      data.pickupComplement,
      data.pickupPostalCode,
      data.pickupCity,
      data.pickupCountry
    );

    const deliveryAddress = formatAddress(
      data.deliveryStreetNumber,
      data.deliveryStreetType,
      data.deliveryStreetName,
      data.deliveryComplement,
      data.deliveryPostalCode,
      data.deliveryCity,
      data.deliveryCountry
    );

    // Préparation des données pour l'API
    const emailData = {
      ...data,
      pickupFullAddress: pickupAddress,
      deliveryFullAddress: deliveryAddress,
      formType: 'quote'
    };

    // En mode développement, on simule l'envoi d'email
    if (import.meta.env.DEV) {
      console.log("Envoi d'email simulé en développement:", emailData);
      // Attendre 1 seconde pour simuler une requête réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    // En production, faire un appel API réel
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'envoi de l\'email');
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    toast({
      variant: "destructive",
      title: "Erreur d'envoi",
      description: "Impossible d'envoyer votre demande de devis. Veuillez réessayer plus tard.",
    });
    throw error; // Relancer l'erreur pour la gestion dans le composant
  }
};
