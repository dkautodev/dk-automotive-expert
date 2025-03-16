import { OrderState, Contact, Vehicle } from "@/types/order";

export interface UnifiedOrderFormProps {
  orderDetails: OrderState;
  onQuoteNumberGenerated: (quoteNumber: string) => void;
  onSubmit: (formData: OrderState) => void;
}

export interface ContactFormSectionProps {
  contact: Contact;
  onChange: (contact: Contact) => void;
  label: string;
  prefix: string;
}

export interface FormActions {
  handleSubmit: () => void;
  isFormValid: boolean;
  globalFiles: File[];
  setGlobalFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

