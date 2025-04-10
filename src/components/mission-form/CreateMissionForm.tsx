
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { MissionTypeStep } from "./MissionTypeStep";
import AddressVehicleStep from "./AddressVehicleStep";
import VehicleInfoStep from "./VehicleInfoStep";
import ContactScheduleStep from "./ContactScheduleStep";
import { useMissionSubmit } from "./hooks/useMissionSubmit";
import StepIndicator from "./StepIndicator";

interface CreateMissionFormProps {
  onSuccess: () => void;
  clientDefaultStatus?: "en_attente" | "confirmé";
  termsAccepted?: boolean;
  onTermsChange?: (value: boolean) => void;
}

const CreateMissionForm = ({
  onSuccess,
  clientDefaultStatus = "en_attente",
  termsAccepted = false,
  onTermsChange,
}: CreateMissionFormProps) => {
  const {
    form,
    step,
    isSubmitting,
    internalTermsAccepted,
    nextStep,
    previousStep,
    onSubmit,
    handleTermsChange,
  } = useMissionSubmit({
    onSuccess,
    clientDefaultStatus,
    termsAccepted,
    onTermsChange,
  });

  useEffect(() => {
    const { user, role } = require("@/context/AuthContext").useAuthContext();
    if (role === "client" && user?.id) {
      form.setValue("client_id", user.id);
    }
  }, [form]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <MissionTypeStep form={form} onNext={nextStep} />;
      case 2:
        return (
          <AddressVehicleStep
            form={form}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 3:
        return (
          <VehicleInfoStep
            form={form}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 4:
        return (
          <ContactScheduleStep
            form={form}
            onSubmit={onSubmit}
            onPrevious={previousStep}
            isSubmitting={isSubmitting}
            termsAccepted={internalTermsAccepted}
            onTermsChange={handleTermsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <StepIndicator currentStep={step} totalSteps={4} />
        {renderStep()}
      </div>
    </Form>
  );
};

export default CreateMissionForm;
