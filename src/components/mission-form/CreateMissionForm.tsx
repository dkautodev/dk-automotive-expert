
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MissionFormValues, missionFormSchema } from "./missionFormSchema";
import MissionTypeStep from "./MissionTypeStep";
import AddressVehicleStep from "./AddressVehicleStep";
import VehicleInfoStep from "./VehicleInfoStep";
import ContactScheduleStep from "./ContactScheduleStep";
import { useAuthContext } from "@/context/AuthContext";
import { MissionRow } from "@/types/database";
import { extractAddressComponents } from "@/utils/addressUtils";

interface CreateMissionFormProps {
  onSuccess: () => void;
  clientDefaultStatus?: "en_attente" | "confirmé";
}

const CreateMissionForm = ({ onSuccess, clientDefaultStatus = "en_attente" }: CreateMissionFormProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, role } = useAuthContext();

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
    },
  });

  useEffect(() => {
    if (role === 'client' && user?.id) {
      form.setValue('client_id', user.id);
    }
  }, [role, user, form]);

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

  // Function to sanitize file names
  const sanitizeFileName = (fileName: string): string => {
    // Replace spaces, apostrophes and special characters
    return fileName
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_') // Replace special characters with _
      .replace(/\s+/g, '_'); // Replace spaces with _
  };

  const uploadAttachments = async (missionId: string, attachments: File[]) => {
    if (!attachments || attachments.length === 0) return;
    
    for (const file of attachments) {
      try {
        // Sanitize file name
        const sanitizedFileName = sanitizeFileName(file.name);
        const uniqueId = Date.now().toString();
        const filePath = `missions/${missionId}/${uniqueId}_${sanitizedFileName}`;
        
        console.log("Uploading file:", file.name, "to path:", filePath);
        
        // Upload file to storage
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('mission-attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          throw uploadError;
        }

        console.log("File uploaded successfully, saving record in database");

        // Create record in database
        const { error: dbError } = await supabase
          .from('mission_attachments')
          .insert({
            mission_id: missionId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            uploaded_by: user!.id
          });

        if (dbError) {
          console.error("Database error when saving attachment:", dbError);
          throw dbError;
        }
      } catch (error: any) {
        console.error("Error processing attachment:", error);
        toast.error(`Erreur lors de l'ajout de la pièce jointe ${file.name}: ${error.message}`);
      }
    }
  };

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Veuillez remplir tous les champs obligatoires");
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

      // Résolution du problème de clé étrangère: Ne pas fixer d'admin_id par défaut
      // Si l'utilisateur est admin, utiliser son ID comme admin_id
      let admin_id = null;
      if (role === 'admin' && user?.id) {
        admin_id = user.id;
        console.log("Administrateur identifié, utilisation de son ID:", admin_id);
      }
      
      const pickupAddressComponents = await handleCalculateAddress(values.pickup_address);
      
      const missionData = {
        status: statusToUse,
        client_id: values.client_id || user?.id,
        // Utiliser admin_id uniquement si on a une valeur valide
        ...(admin_id && { admin_id }),
        distance: values.distance?.toString(),
        price_ht: parseFloat(values.price_ht || "0"),
        price_ttc: parseFloat(values.price_ttc || "0"),
        // Composantes d'adresse structurées
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
        
        // Upload attachments if any
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return <MissionTypeStep form={form} onNext={nextStep} />;
      case 2:
        return <AddressVehicleStep form={form} onNext={nextStep} onPrevious={previousStep} />;
      case 3:
        return <VehicleInfoStep form={form} onNext={nextStep} onPrevious={previousStep} />;
      case 4:
        return <ContactScheduleStep form={form} onSubmit={onSubmit} onPrevious={previousStep} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  stepNumber === step
                    ? "bg-primary text-white"
                    : stepNumber < step
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div
                  className={`h-1 w-6 ${
                    stepNumber < step ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        {renderStep()}
      </div>
    </Form>
  );
};

export default CreateMissionForm;
