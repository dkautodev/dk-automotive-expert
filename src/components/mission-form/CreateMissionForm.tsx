import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MissionFormValues, missionFormSchema } from "./missionFormSchema";
import MissionTypeStep from "./MissionTypeStep";
import AddressVehicleStep from "./AddressVehicleStep";
import VehicleInfoStep from "./VehicleInfoStep";
import ContactScheduleStep from "./ContactScheduleStep";
import { useAuthContext } from "@/context/AuthContext";

interface CreateMissionFormProps {
  onSuccess: () => void;
}

const CreateMissionForm = ({ onSuccess }: CreateMissionFormProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

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
    },
  });

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

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const values = form.getValues();
      
      // Format data for database
      const missionData = {
        mission_type: values.mission_type,
        status: "confirmé", // Changé de "en_attente" à "confirmé" pour les missions créées par l'admin
        client_id: values.client_id || user?.id, // Utilisation de l'ID du client sélectionné
        pickup_address: values.pickup_address,
        delivery_address: values.delivery_address,
        distance: values.distance?.toString(), // Convert to string as required by the database
        price_ht: parseFloat(values.price_ht || "0"),
        price_ttc: parseFloat(values.price_ttc || "0"),
        vehicle_info: {
          brand: values.brand,
          model: values.model,
          year: values.year,
          fuel: values.fuel,
          licensePlate: values.licensePlate,
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

      const { data, error } = await supabase
        .from("missions")
        .insert(missionData)
        .select();

      if (error) {
        throw error;
      }

      toast.success(`Mission ${data[0].mission_number} créée avec succès`);
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
