
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./missionFormSchema";
import { useAuthContext } from "@/context/AuthContext";
import PickupContactSection from "./contact-schedule/PickupContactSection";
import DeliveryContactSection from "./contact-schedule/DeliveryContactSection";
import AdditionalInfoSection from "./contact-schedule/AdditionalInfoSection";
import TermsSection from "./contact-schedule/TermsSection";
import FormActions from "./contact-schedule/FormActions";

interface ContactScheduleStepProps {
  form: UseFormReturn<MissionFormValues>;
  onSubmit?: () => void;
  onPrevious?: () => void;
  isSubmitting?: boolean;
  termsAccepted?: boolean;
  onTermsChange?: (value: boolean) => void;
}

const ContactScheduleStep = ({ 
  form, 
  onSubmit, 
  onPrevious, 
  isSubmitting, 
  termsAccepted, 
  onTermsChange 
}: ContactScheduleStepProps) => {
  const { role } = useAuthContext();
  const isClient = role === 'client';
  
  return (
    <div className="space-y-6">
      <PickupContactSection form={form} />
      <DeliveryContactSection form={form} />
      <AdditionalInfoSection form={form} />
      
      <TermsSection 
        termsAccepted={termsAccepted}
        onTermsChange={onTermsChange}
        isClient={isClient}
      />

      <FormActions 
        onSubmit={onSubmit}
        onPrevious={onPrevious}
        isSubmitting={isSubmitting}
        isClient={isClient}
        termsAccepted={termsAccepted}
      />
    </div>
  );
};

export default ContactScheduleStep;
