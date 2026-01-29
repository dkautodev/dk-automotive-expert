import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface StripeCardFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  defaultEmail?: string;
}

const StripeCardForm: React.FC<StripeCardFormProps> = ({
  clientSecret,
  amount,
  onSuccess,
  onError,
  defaultEmail = '',
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState(defaultEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Élément carte non trouvé');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email,
          },
        },
      });

      if (error) {
        console.error('Payment error:', error);
        onError(error.message || 'Erreur lors du paiement');
        toast.error(error.message || 'Erreur lors du paiement');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        toast.success('Paiement effectué avec succès !');
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // 3D Secure authentication required - handled by Stripe automatically
        toast.info('Authentification supplémentaire requise...');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      onError(err.message || 'Erreur lors du paiement');
      toast.error(err.message || 'Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1a365d',
        fontFamily: '"Inter", system-ui, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#1a365d',
      },
      invalid: {
        color: '#dc2626',
        iconColor: '#dc2626',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Link Authentication Element for saved payment methods */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <LinkAuthenticationElement
          options={{
            defaultValues: {
              email: defaultEmail,
            },
          }}
          onChange={(e) => {
            if (e.value.email) {
              setEmail(e.value.email);
            }
          }}
        />
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Carte bancaire</label>
        <div className="p-4 border rounded-lg bg-white shadow-sm focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="h-3 w-3" />
        <span>Paiement sécurisé par Stripe</span>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Payer {amount.toFixed(2)} €
          </>
        )}
      </Button>
    </form>
  );
};

export default StripeCardForm;
