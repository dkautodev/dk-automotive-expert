import { Mail, FileText, CreditCard, Building2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface EmailConfig {
  id: string;
  name: string;
  description: string;
  trigger: string;
  sender: string;
  recipients: string[];
  edgeFunction: string;
  category: 'quote' | 'payment';
  icon: React.ReactNode;
}

const emailConfigs: EmailConfig[] = [
  {
    id: 'quote-admin',
    name: 'Notification nouvelle demande de devis',
    description: 'Email envoyé à l\'équipe DK Automotive lors d\'une nouvelle demande de devis',
    trigger: 'Soumission du formulaire de devis',
    sender: 'DK Automotive <noreply@dkautomotive.fr>',
    recipients: ['contact@dkautomotive.fr'],
    edgeFunction: 'send-quote-request',
    category: 'quote',
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: 'quote-client',
    name: 'Confirmation demande de devis',
    description: 'Email de confirmation envoyé au client après sa demande de devis',
    trigger: 'Soumission du formulaire de devis',
    sender: 'DK Automotive <noreply@dkautomotive.fr>',
    recipients: ['Email du client (dynamique)'],
    edgeFunction: 'send-quote-request',
    category: 'quote',
    icon: <User className="h-5 w-5" />
  },
  {
    id: 'payment-admin',
    name: 'Notification nouvelle mission prépayée',
    description: 'Email envoyé à l\'équipe DK Automotive lors d\'un paiement réussi',
    trigger: 'Paiement Stripe validé',
    sender: 'DK Automotive <contact@dkautomotive.fr>',
    recipients: ['contact@dkautomotive.fr'],
    edgeFunction: 'verify-payment',
    category: 'payment',
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: 'payment-client',
    name: 'Confirmation de paiement',
    description: 'Email de confirmation envoyé au client après son paiement',
    trigger: 'Paiement Stripe validé',
    sender: 'DK Automotive <contact@dkautomotive.fr>',
    recipients: ['Email du client (dynamique)'],
    edgeFunction: 'verify-payment',
    category: 'payment',
    icon: <User className="h-5 w-5" />
  }
];

const EmailManagementEditor = () => {
  const quoteEmails = emailConfigs.filter(e => e.category === 'quote');
  const paymentEmails = emailConfigs.filter(e => e.category === 'payment');

  const EmailCard = ({ email }: { email: EmailConfig }) => (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            {email.icon}
          </div>
          <div>
            <p className="font-medium">{email.name}</p>
            <p className="text-xs text-muted-foreground">{email.description}</p>
          </div>
        </div>
        <Badge variant="outline">
          {email.category === 'quote' ? 'Devis' : 'Paiement'}
        </Badge>
      </div>
      <div className="space-y-2 text-sm bg-muted/30 p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="font-medium text-muted-foreground w-24 shrink-0">Déclencheur :</span>
          <span>{email.trigger}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-medium text-muted-foreground w-24 shrink-0">Expéditeur :</span>
          <code className="bg-background px-2 py-0.5 rounded text-xs">{email.sender}</code>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-medium text-muted-foreground w-24 shrink-0">Destinataire :</span>
          <div className="flex flex-wrap gap-1">
            {email.recipients.map((recipient, idx) => (
              <code key={idx} className="bg-background px-2 py-0.5 rounded text-xs">{recipient}</code>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-medium text-muted-foreground w-24 shrink-0">Fonction :</span>
          <code className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{email.edgeFunction}</code>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dk-navy mb-2 flex items-center gap-2">
          <Mail className="h-6 w-6" />
          Gestion des emails Brevo
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualisez la configuration des emails automatiques.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['quotes', 'payments']} className="space-y-3">
        <AccordionItem value="quotes" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="font-semibold">Emails Demande de devis</span>
              <Badge variant="secondary">{quoteEmails.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {quoteEmails.map(email => (
              <EmailCard key={email.id} email={email} />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payments" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <CreditCard className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Emails Paiement</span>
              <Badge variant="secondary">{paymentEmails.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {paymentEmails.map(email => (
              <EmailCard key={email.id} email={email} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EmailManagementEditor;
