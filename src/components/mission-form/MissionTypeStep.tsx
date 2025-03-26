
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Truck, RotateCcw } from "lucide-react";
import { MissionFormValues } from "./missionFormSchema";

interface MissionTypeStepProps {
  form: UseFormReturn<MissionFormValues>;
  onNext: () => void;
}

const MissionTypeStep = ({ form, onNext }: MissionTypeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Type de mission</div>
      <p className="text-muted-foreground">
        Veuillez sélectionner le type de mission de convoyage
      </p>

      <FormField
        control={form.control}
        name="mission_type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <FormItem>
                  <FormControl>
                    <label
                      className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                        field.value === "livraison"
                          ? "border-primary bg-accent"
                          : "border-input"
                      }`}
                    >
                      <RadioGroupItem
                        value="livraison"
                        className="sr-only"
                      />
                      <Truck className="h-10 w-10 mb-3" />
                      <div className="space-y-1 text-center">
                        <div className="font-semibold">Livraison</div>
                        <div className="text-sm text-muted-foreground">
                          Convoyage d'un véhicule vers un client
                        </div>
                      </div>
                    </label>
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormControl>
                    <label
                      className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                        field.value === "restitution"
                          ? "border-primary bg-accent"
                          : "border-input"
                      }`}
                    >
                      <RadioGroupItem
                        value="restitution"
                        className="sr-only"
                      />
                      <RotateCcw className="h-10 w-10 mb-3" />
                      <div className="space-y-1 text-center">
                        <div className="font-semibold">Restitution</div>
                        <div className="text-sm text-muted-foreground">
                          Retour d'un véhicule vers une concession
                        </div>
                      </div>
                    </label>
                  </FormControl>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={onNext}
          className="mt-6"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default MissionTypeStep;
