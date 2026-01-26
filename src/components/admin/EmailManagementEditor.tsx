
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, FileText, CreditCard, Building2, User } from 'lucide-react';
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
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {email.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{email.name}</CardTitle>
              <CardDescription className="mt-1">{email.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            {email.category === 'quote' ? 'Devis' : 'Paiement'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground w-24 shrink-0">Déclencheur :</span>
            <span>{email.trigger}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground w-24 shrink-0">Expéditeur :</span>
            <code className="bg-muted px-2 py-0.5 rounded text-xs">{email.sender}</code>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground w-24 shrink-0">Destinataire :</span>
            <div className="flex flex-wrap gap-1">
              {email.recipients.map((recipient, idx) => (
                <code key={idx} className="bg-muted px-2 py-0.5 rounded text-xs">{recipient}</code>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-muted-foreground w-24 shrink-0">Fonction :</span>
            <code className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{email.edgeFunction}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dk-navy flex items-center gap-2">
          <Mail className="h-6 w-6" />
          Gestion des emails Brevo
        </h2>
        <p className="text-gray-600 mt-2">
          Visualisez les emails transactionnels configurés dans l'application. Ces emails sont envoyés automatiquement via l'API Brevo.
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Send className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Configuration Brevo</h3>
            <p className="text-sm text-blue-700 mt-1">
              Les emails sont envoyés via l'API Brevo avec la clé API configurée dans les secrets Supabase (BREVO_API_KEY).
            </p>
          </div>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['quotes', 'payments']} className="space-y-4">
        <AccordionItem value="quotes" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="font-semibold">Emails Demande de devis</span>
              <Badge variant="secondary" className="ml-2">{quoteEmails.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {quoteEmails.map(email => (
              <EmailCard key={email.id} email={email} />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payments" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Emails Paiement</span>
              <Badge variant="secondary" className="ml-2">{paymentEmails.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {paymentEmails.map(email => (
              <EmailCard key={email.id} email={email} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Note :</strong> Pour modifier le contenu des emails, il faut éditer les Edge Functions correspondantes dans le code source.
          Les templates HTML sont définis directement dans les fonctions <code className="bg-amber-100 px-1 rounded">send-quote-request</code> et <code className="bg-amber-100 px-1 rounded">verify-payment</code>.
        </p>
      </div>
    </div>
  );
};

export default EmailManagementEditor;
