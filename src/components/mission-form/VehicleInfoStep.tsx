
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MissionFormValues } from "./missionFormSchema";
import { carBrands, getModelsByBrand } from "@/components/quote-form/vehicleData";
import { useState, useEffect } from "react";

interface VehicleInfoStepProps {
  form: UseFormReturn<MissionFormValues>;
  onNext: () => void;
  onPrevious: () => void;
}

const VehicleInfoStep = ({ form, onNext, onPrevious }: VehicleInfoStepProps) => {
  const selectedBrand = form.watch("brand");
  const [models, setModels] = useState<string[]>([]);
  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");

  useEffect(() => {
    if (selectedBrand && selectedBrand !== "AUTRE") {
      setModels(getModelsByBrand(selectedBrand));
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  const handleBrandChange = (value: string) => {
    form.setValue("brand", value);
    if (value !== "AUTRE") {
      setCustomBrand("");
    }
    // Réinitialiser le modèle quand on change de marque
    form.setValue("model", "");
  };

  const handleModelChange = (value: string) => {
    form.setValue("model", value);
    if (value !== "AUTRE") {
      setCustomModel("");
    }
  };

  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBrand(e.target.value);
    form.setValue("brand", e.target.value);
  };

  const handleCustomModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomModel(e.target.value);
    form.setValue("model", e.target.value);
  };

  // Ajout de la marque "AUTRE" à la liste des marques
  const brandsWithOther = [...carBrands, "AUTRE"];

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Informations du véhicule</div>
      <p className="text-muted-foreground">
        Veuillez fournir les informations détaillées du véhicule à convoyer
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marque</FormLabel>
                <Select 
                  onValueChange={handleBrandChange} 
                  value={brandsWithOther.includes(field.value) ? field.value : "AUTRE"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une marque" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brandsWithOther.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedBrand === "AUTRE" && (
            <FormItem>
              <FormLabel>Marque personnalisée</FormLabel>
              <FormControl>
                <Input
                  placeholder="Saisir la marque"
                  value={customBrand}
                  onChange={handleCustomBrandChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle</FormLabel>
                <Select 
                  onValueChange={handleModelChange} 
                  value={field.value}
                  disabled={!selectedBrand}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedBrand ? "Sélectionner un modèle" : "Sélectionner d'abord une marque"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                    <SelectItem value="AUTRE">AUTRE</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("model") === "AUTRE" && (
            <FormItem>
              <FormLabel>Modèle personnalisé</FormLabel>
              <FormControl>
                <Input
                  placeholder="Saisir le modèle"
                  value={customModel}
                  onChange={handleCustomModelChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </div>

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fuel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de carburant</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de carburant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="essence">Essence</SelectItem>
                  <SelectItem value="electrique">Électrique</SelectItem>
                  <SelectItem value="hybride">Hybride</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immatriculation</FormLabel>
              <FormControl>
                <Input
                  placeholder="AB-123-CD"
                  {...field}
                  className="uppercase"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
        >
          Précédent
        </Button>
        <Button
          type="button"
          onClick={onNext}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default VehicleInfoStep;
