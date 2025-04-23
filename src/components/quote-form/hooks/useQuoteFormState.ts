
import { useState } from 'react';

export const useQuoteFormState = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [priceHT, setPriceHT] = useState<string | null>(null);
  const [priceTTC, setPriceTTC] = useState<string | null>(null);

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
    setPriceTTC
  };
};
