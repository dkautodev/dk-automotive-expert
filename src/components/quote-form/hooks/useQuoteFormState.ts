
import { useState } from 'react';

export const useQuoteFormState = () => {
  const [step, setStep] = useState(1); // Commence maintenant à l'étape 1 (adresses & véhicule)
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [priceHT, setPriceHT] = useState<string | null>(null);
  const [priceTTC, setPriceTTC] = useState<string | null>(null);
  const [isPerKm, setIsPerKm] = useState<boolean>(false);
  const [formValidated, setFormValidated] = useState<boolean>(false);

  return {
    step,
    setStep,
    loading,
    setLoading,
    distance,
    setDistance,
    priceHT,
    setPriceHT,
    priceTTC,
    setPriceTTC,
    isPerKm,
    setIsPerKm,
    formValidated,
    setFormValidated
  };
};
