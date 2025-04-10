
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MissionFormValues, missionFormSchema } from "../missionFormSchema";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { extractAddressComponents } from "@/utils/addressUtils";
import { MissionRow } from "@/types/database";
import { useAttachmentUpload } from "./useAttachmentUpload";

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
      const { streetNumber, postalCode, city, country } = extractAddressComponents(address);
      
      return {
        street_number: streetNumber,
        postal_code: postalCode,
        city: city,
        country: country
      };
    } catch (error) {
      console.error("Erreur lors de l'extraction de l'adresse:", error);
      return null;
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
        street_number: pickupAddressComponents?.street_number || '',
        postal_code: pickupAddressComponents?.postal_code || '',
        city: pickupAddressComponents?.city || '',
        country: pickupAddressComponents?.country || 'France',
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

      const { data, error } = await supabase.rpc(
        'create_mission',
        {
          mission_data: missionData,
          mission_type_value: values.mission_type
        }
      );

      if (error) {
        console.error("Erreur détaillée:", error);
        throw error;
      }

      const createdMission = Array.isArray(data) && data.length > 0 ? data[0] as MissionRow : null;
      
      if (createdMission) {
        console.log("Mission créée avec succès:", createdMission);
        console.log("ID mission:", createdMission.id);
        console.log("Numéro mission:", createdMission.mission_number);
        console.log("Statut mission:", createdMission.status);
        console.log("Client ID:", createdMission.client_id);
        console.log("Admin ID:", createdMission.admin_id);
        
        if (values.attachments && values.attachments.length > 0) {
          console.log(`Téléchargement de ${values.attachments.length} pièces jointes pour la mission ${createdMission.id}`);
          await uploadAttachments(createdMission.id, values.attachments as File[]);
        }
        
        if (statusToUse === "en_attente") {
          toast.success(`Demande de devis ${createdMission.mission_number} envoyée avec succès`);
        } else {
          toast.success(`Mission ${createdMission.mission_number} créée avec succès`);
        }
      } else {
        console.log("Données retournées:", data);
        if (statusToUse === "en_attente") {
          toast.success("Demande de devis envoyée avec succès");
        } else {
          toast.success("Mission créée avec succès");
        }
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
