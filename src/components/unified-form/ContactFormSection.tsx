
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormSectionProps } from "./types";

export const ContactFormSection = ({ contact, onChange, label, prefix }: ContactFormSectionProps) => {
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{label}</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${prefix}-lastName`}>Nom *</Label>
          <Input 
            id={`${prefix}-lastName`} 
            value={contact.lastName} 
            onChange={e => onChange({ ...contact, lastName: e.target.value })} 
            required 
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-firstName`}>Prénom *</Label>
          <Input 
            id={`${prefix}-firstName`} 
            value={contact.firstName} 
            onChange={e => onChange({ ...contact, firstName: e.target.value })} 
            required 
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-email`}>Adresse mail *</Label>
          <Input 
            id={`${prefix}-email`} 
            type="email" 
            value={contact.email} 
            onChange={e => onChange({ ...contact, email: e.target.value })}
            className={!validateEmail(contact.email) && contact.email ? "border-red-500" : ""} 
            required 
          />
          {!validateEmail(contact.email) && contact.email && 
            <p className="text-red-500 text-sm mt-1">Format d'email invalide</p>
          }
        </div>
        <div>
          <Label htmlFor={`${prefix}-phone`}>Téléphone *</Label>
          <Input 
            id={`${prefix}-phone`} 
            value={contact.phone} 
            onChange={e => onChange({ ...contact, phone: e.target.value })}
            className={!validatePhone(contact.phone) && contact.phone ? "border-red-500" : ""} 
            required 
          />
          {!validatePhone(contact.phone) && contact.phone && 
            <p className="text-red-500 text-sm mt-1">Format de téléphone invalide (ex: 0612345678 ou +33612345678)</p>
          }
        </div>
        <div>
          <Label htmlFor={`${prefix}-message`}>Message complémentaire</Label>
          <Textarea 
            id={`${prefix}-message`} 
            value={contact.message} 
            onChange={e => onChange({
              ...contact,
              message: e.target.value.slice(0, 60)
            })}
            placeholder="Ajoutez un message (60 caractères max)"
            maxLength={60}
            className="resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            {(contact.message?.length || 0)}/60 caractères
          </p>
        </div>
      </div>
    </div>
  );
};
