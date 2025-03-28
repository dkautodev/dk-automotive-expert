
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, Mail, Info } from "lucide-react";
import { ContactStepType } from "../schemas/signUpStepSchema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ContactStepProps {
  control: Control<ContactStepType>;
}

const ContactStep = ({ control }: ContactStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-center">Coordonnées</h2>
      
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormLabel>Numéro de téléphone*</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Format: 0612345678 ou +33612345678</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input placeholder="06 12 34 56 78" className="pl-10" type="tel" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormLabel>Email*</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adresse email valide où vous recevrez les confirmations</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input placeholder="votre@email.com" className="pl-10" type="email" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactStep;
