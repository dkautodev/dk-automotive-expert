import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import StripeCardForm from './StripeCardForm';

// Stripe publishable key - this is public and safe to include in frontend code
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RKLIg4Y1R3LHQgtPqM4dIL4D33IeEJLlWCJhTuzqj6BG7qdX6LPSY7NMRlYmqhDyNpCVLbpFe7U8lp37UzpuWUF00u5sYg3Kj';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface MissionData {
  pickup_address: string;
  delivery_address: string;
  distance_km: number;
  price_ht: number;
  price_ttc: number;
  vehicle_type?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_fuel?: string;
  license_plate?: string;
  vehicle_vin?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_company?: string;
  pickup_date?: string;
  pickup_time?: string;
  pickup_time_end?: string;
  delivery_date?: string;
  delivery_time?: string;
  delivery_time_end?: string;
  pickup_contact_name?: string;
  pickup_contact_phone?: string;
  delivery_contact_name?: string;
  delivery_contact_phone?: string;
  notes?: string;
}

interface StripePaymentWrapperProps {
  missionData: MissionData;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const StripePaymentWrapper: React.FC<StripePaymentWrapperProps> = ({
  missionData,
  onSuccess,
  onError,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fnError } = await supabase.functions.invoke('create-payment-intent', {
          body: missionData,
        });

        if (fnError) {
          throw new Error(fnError.message || 'Erreur lors de la création du paiement');
        }

        if (!data?.clientSecret) {
          throw new Error('Client secret non reçu');
        }

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error('Error creating payment intent:', err);
        const errorMessage = err.message || 'Erreur lors de l\'initialisation du paiement';
        setError(errorMessage);
        onError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [missionData, onError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-sm text-gray-600">Initialisation du paiement...</p>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'Erreur lors de l\'initialisation du paiement'}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-green-600 hover:text-green-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#16a34a',
        colorBackground: '#ffffff',
        colorText: '#1a365d',
        colorDanger: '#dc2626',
        fontFamily: '"Inter", system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <StripeCardForm
        clientSecret={clientSecret}
        amount={missionData.price_ttc}
        defaultEmail={missionData.client_email}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePaymentWrapper;
