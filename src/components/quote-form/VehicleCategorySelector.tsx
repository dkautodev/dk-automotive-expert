import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { Check, Plus, Car } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VehicleCategorySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const categoryImages: Record<string, string> = {
  'citadine': '/photos-vhl/citadine.webp',
  'berline': '/photos-vhl/berline.webp',
  '4x4_suv': '/photos-vhl/SUV.webp',
  'utilitaire_3_5m3': '/photos-vhl/fourgonette.webp',
  'utilitaire_6_12m3': '/photos-vhl/fourgon-moyen.webp',
  'utilitaire_12_15m3': '/photos-vhl/grand-fourgon.webp',
  'utilitaire_15_20m3': '/photos-vhl/20M3.webp',
  'utilitaire_plus_20m3': '/photos-vhl/nacelle-.webp',
};

const VehicleCategorySelector: React.FC<VehicleCategorySelectorProps> = ({
  value,
  onChange,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedType = vehicleTypes.find(t => t.id === value);
  const selectedImage = value ? categoryImages[value] : null;

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between p-2 sm:p-2.5 rounded-lg border transition-all duration-300 group text-left mt-1.5",
            value 
              ? "border-dk-navy bg-white shadow-sm ring-1 ring-dk-navy/5" 
              : "border-slate-200 bg-white shadow-sm hover:border-dk-navy/30 hover:bg-slate-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Left Icon Storage Box */}
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center transition-colors border border-slate-100 flex-shrink-0",
              "bg-white"
            )}>
              {selectedImage ? (
                <img src={selectedImage} alt="VHL" className="h-8 w-8 object-contain" />
              ) : (
                <Car className="h-4 w-4 text-slate-400" />
              )}
            </div>
            
            <div className="flex flex-col">
              <span className={cn(
                "text-sm font-semibold transition-colors leading-none mb-1",
                value ? "text-dk-navy" : "text-slate-400"
              )}>
                {selectedType ? selectedType.name : "Choisir un type de véhicule"}
              </span>
              {value && (
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
                  Catégorie sélectionnée
                </span>
              )}
            </div>
          </div>
          
          {/* Plus/Check Circular Icon */}
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center transition-all shadow-sm",
            value 
              ? "bg-dk-navy text-white" 
              : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
          )}>
            {value ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dk-navy">Choisir la catégorie de véhicule</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          {vehicleTypes.map((type) => {
            const isSelected = value === type.id;
            const image = categoryImages[type.id];

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleSelect(type.id)}
                className={cn(
                  "relative group flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 h-full",
                  isSelected 
                    ? "border-dk-navy bg-dk-navy/5 shadow-md ring-1 ring-dk-navy/20" 
                    : "border-border bg-white hover:border-dk-navy/40 hover:bg-slate-50"
                )}
              >
                <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-lg bg-white flex items-center justify-center border border-slate-100">
                  {image ? (
                    <img 
                      src={image} 
                      alt={type.name} 
                      className={cn(
                        "w-full h-full object-contain transition-transform duration-500",
                        isSelected ? "scale-110" : "group-hover:scale-110"
                      )}
                    />
                  ) : (
                    <div className="text-[10px] text-muted-foreground">Sans photo</div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-dk-navy text-white p-1 rounded-full shadow-lg">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <p className={cn(
                    "text-[11px] font-bold leading-tight text-center transition-colors",
                    isSelected ? "text-dk-navy" : "text-slate-600 group-hover:text-dk-navy"
                  )}>
                    {type.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleCategorySelector;
