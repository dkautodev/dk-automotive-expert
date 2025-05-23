
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MissionFormValues, missionFormSchema } from "../missionFormSchema";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from '@/services/mockSupabaseClient';
import { toast } from "sonner";
import { extractAddressParts } from "@/utils/addressUtils";
import { MissionRow } from "@/types/database";

// Mock attachment upload hook
const useAttachmentUpload = () => {
  const uploadAttachments = async (missionId: string, files: File[]): Promise<boolean> => {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`${files.length} files uploaded for mission ${missionId}`);
    return true;
  };
  
  return { uploadAttachments };
};

interface UseMissionSubmitProps {
  onSuccess: () => void;
  clientDefaultStatus?: "en_attente" | "confirmé";
  termsAccepted?: boolean;
  onTermsChange?: (value: boolean) => void;
}

export const useMissionSubmit = ({
  onSuccess,
  clientDefaultStatus = "en_attente",
  termsAccepted = false,
  onTermsChange
}: UseMissionSubmitProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalTermsAccepted, setInternalTermsAccepted] = useState(termsAccepted);
  const { user, role } = useAuthContext();
  const isClient = role === 'client';
  const { uploadAttachments } = useAttachmentUpload();

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: {
      mission_type: "livraison",
      client_id: "",
      pickup_address: "",
      delivery_address: "",
      vehicle_type: "",
      brand: "",
      model: "",
      year: "",
      fuel: "",
      licensePlate: "",
      pickup_first_name: "",
      pickup_last_name: "",
      pickup_email: "",
      pickup_phone: "",
      delivery_first_name: "",
      delivery_last_name: "",
      delivery_email: "",
      delivery_phone: "",
      pickup_time: "",
      delivery_time: "",
      additional_info: "",
      attachments: [],
      termsAccepted: termsAccepted
    },
  });

  const handleTermsChange = (value: boolean) => {
    setInternalTermsAccepted(value);
    form.setValue('termsAccepted', value);
    if (onTermsChange) {
      onTermsChange(value);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      form.trigger("mission_type").then((isValid) => {
        if (isValid) setStep(2);
      });
    } else if (step === 2) {
      form.trigger(["pickup_address", "delivery_address", "vehicle_type", "distance"]).then((isValid) => {
        if (isValid) setStep(3);
      });
    } else if (step === 3) {
      form.trigger(["brand", "model", "year", "fuel", "licensePlate"]).then((isValid) => {
        if (isValid) setStep(4);
      });
    }
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const handleCalculateAddress = async (address: string) => {
    try {
      const { streetNumber, postalCode, city, country } = extractAddressParts(address);
      
      return {
        street_number: streetNumber || '',
        postal_code: postalCode || '',
        city: city || '',
        country: country || 'France'
      };
    } catch (error) {
      console.error("Erreur lors de l'extraction de l'adresse:", error);
      return {
        street_number: '',
        postal_code: '',
        city: '',
        country: 'France'
      };
    }
  };

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (isClient && !internalTermsAccepted) {
      toast.error("Vous devez accepter les conditions générales de vente");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const values = form.getValues();
      
      let statusToUse = clientDefaultStatus;
      if (role === 'admin') {
        statusToUse = "confirmé";
        console.log("Mode admin détecté, statut de mission défini sur 'confirmé'");
      }

      console.log(`Création de mission avec statut: ${statusToUse}`);
      console.log("Adresse de prise en charge:", values.pickup_address);
      console.log("Adresse de livraison:", values.delivery_address);

      let admin_id = null;
      if (role === 'admin' && user?.id) {
        admin_id = user.id;
        console.log("Administrateur identifié, utilisation de son ID:", admin_id);
      }
      
      const pickupAddressComponents = await handleCalculateAddress(values.pickup_address);
      
      const missionData = {
        status: statusToUse,
        client_id: values.client_id || user?.id,
        ...(admin_id && { admin_id }),
        distance: values.distance?.toString(),
        price_ht: parseFloat(values.price_ht || "0"),
        price_ttc: parseFloat(values.price_ttc || "0"),
        street_number: pickupAddressComponents.street_number,
        postal_code: pickupAddressComponents.postal_code,
        city: pickupAddressComponents.city,
        country: pickupAddressComponents.country,
        vehicle_info: {
          brand: values.brand,
          model: values.model,
          year: values.year,
          fuel: values.fuel,
          licensePlate: values.licensePlate,
          pickup_address: values.pickup_address,
          delivery_address: values.delivery_address,
          vehicle_type: values.vehicle_type
        },
        pickup_date: values.pickup_date.toISOString(),
        pickup_time: values.pickup_time,
        delivery_date: values.delivery_date.toISOString(),
        delivery_time: values.delivery_time,
        pickup_contact: {
          firstName: values.pickup_first_name,
          lastName: values.pickup_last_name,
          email: values.pickup_email,
          phone: values.pickup_phone,
        },
        delivery_contact: {
          firstName: values.delivery_first_name,
          lastName: values.delivery_last_name,
          email: values.delivery_email,
          phone: values.delivery_phone,
        },
        additional_info: values.additional_info || null,
      };

      console.log("Données de mission à envoyer:", missionData);
      console.log("Type de mission:", values.mission_type);
      console.log("Statut de la mission:", statusToUse);
      console.log("Admin ID utilisé:", admin_id || "Non spécifié (NULL)");

      // Mock RPC call instead of using the actual Supabase RPC
      console.log("Mock RPC: create_mission with data", { missionData, mission_type_value: values.mission_type });
      
      // Simulate the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMissionId = "mock-" + Math.random().toString(36).substring(2, 9);
      const mockMissionNumber = "M" + Date.now().toString().substring(8);
      
      const createdMission: MissionRow = {
        id: mockMissionId,
        created_at: new Date().toISOString(),
        client_id: missionData.client_id || "anonymous",
        mission_number: mockMissionNumber,
        status: statusToUse as any,
        pickup_address: values.pickup_address,
        delivery_address: values.delivery_address,
        mission_type: values.mission_type,
        distance: values.distance,
        price_ht: parseFloat(values.price_ht || "0"),
        price_ttc: parseFloat(values.price_ttc || "0"),
      };
      
      console.log("Mission créée avec succès:", createdMission);
      console.log("ID mission:", createdMission.id);
      console.log("Numéro mission:", createdMission.mission_number);
      console.log("Statut mission:", createdMission.status);
      console.log("Client ID:", createdMission.client_id);
      console.log("Admin ID:", admin_id);
      
      if (values.attachments && values.attachments.length > 0) {
        console.log(`Téléchargement de ${values.attachments.length} pièces jointes pour la mission ${createdMission.id}`);
        
        try {
          await uploadAttachments(createdMission.id, values.attachments as File[]);
          console.log("Pièces jointes téléchargées avec succès");
        } catch (attachmentError) {
          console.error("Erreur lors du téléchargement des pièces jointes:", attachmentError);
          toast.error("La mission a été créée mais certaines pièces jointes n'ont pas pu être téléchargées");
        }
      }
      
      if (statusToUse === "en_attente") {
        toast.success(`Demande de devis ${createdMission.mission_number} envoyée avec succès`);
      } else {
        toast.success(`Mission ${createdMission.mission_number} créée avec succès`);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error creating mission:", error);
      toast.error(`Erreur lors de la création de la mission: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    step,
    isSubmitting,
    internalTermsAccepted,
    nextStep,
    previousStep,
    onSubmit,
    handleTermsChange
  };
};
