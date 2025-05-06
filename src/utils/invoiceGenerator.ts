
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MissionRow } from '@/types/database';

export interface InvoiceData {
  invoiceNumber: string;
  missionNumber: string;
  missionId: string;
  client: {
    name: string;
    address: string;
    email: string;
    phone: string;
    vatNumber?: string;
    siretNumber?: string;
  };
  vehicle: {
    brand: string;
    model: string;
    licensePlate: string;
    year: string;
  };
  service: {
    description: string;
    pickupAddress: string;
    deliveryAddress: string;
    pickupDate: string;
    deliveryDate: string;
    distance: string;
  };
  pricing: {
    priceHT: number;
    tva: number;
    priceTTC: number;
  };
  issueDate: string;
  dueDate: string;
  isPaid: boolean;
}

const DEFAULT_LOGO_PATH = '/dk-automotive-logo.png';

export const generateInvoicePDF = (invoice: InvoiceData, options?: { logoPath?: string }) => {
  const logoPath = options?.logoPath || DEFAULT_LOGO_PATH;
  const tvaRate = 20; // 20% par défaut
  const tvaAmount = invoice.pricing.priceHT * (tvaRate / 100);
  
  // Format dates
  const formattedIssueDate = format(new Date(invoice.issueDate), "dd/MM/yyyy", { locale: fr });
  const formattedDueDate = format(new Date(invoice.dueDate), "dd/MM/yyyy", { locale: fr });
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 210mm;">
      <!-- Header with logo and title -->
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 2px solid #18257D; padding-bottom: 20px;">
        <div>
          <img src="${logoPath}" alt="DK Automotive" style="height: 60px; margin-bottom: 10px;" />
          <p style="color: #64748b; margin: 5px 0;">Convoyage | Livraisons | Restitutions</p>
        </div>
        <div style="text-align: right;">
          <h1 style="color: #18257D; margin: 0; font-size: 28px;">FACTURE</h1>
          <p style="font-weight: bold; margin: 5px 0;">${invoice.invoiceNumber}</p>
          <p style="color: #64748b; margin: 5px 0;">Mission: ${invoice.missionNumber}</p>
          ${invoice.isPaid ? '<p style="color: #059669; font-weight: bold; margin: 5px 0;">PAYÉE</p>' : ''}
        </div>
      </div>
      
      <!-- Date information -->
      <div style="margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; font-weight: bold; width: 40%;">Date d'émission</td>
            <td style="padding: 5px 0;">${formattedIssueDate}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-weight: bold;">Date d'échéance</td>
            <td style="padding: 5px 0;">${formattedDueDate}</td>
          </tr>
        </table>
      </div>
      
      <!-- Client & Provider information -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #18257D; margin: 0 0 10px 0; font-size: 16px;">FACTURER À</h3>
          <p style="margin: 5px 0; font-weight: bold;">${invoice.client.name}</p>
          <p style="margin: 5px 0;">${invoice.client.address}</p>
          <p style="margin: 5px 0;">${invoice.client.email}</p>
          <p style="margin: 5px 0;">${invoice.client.phone}</p>
          ${invoice.client.siretNumber ? `<p style="margin: 5px 0;">SIRET: ${invoice.client.siretNumber}</p>` : ''}
          ${invoice.client.vatNumber ? `<p style="margin: 5px 0;">TVA: ${invoice.client.vatNumber}</p>` : ''}
        </div>
        <div>
          <h3 style="color: #18257D; margin: 0 0 10px 0; font-size: 16px;">ÉMETTEUR</h3>
          <p style="margin: 5px 0;">JLD SYNERGY</p>
          <p style="margin: 5px 0;">271 F Route de Cazan</p>
          <p style="margin: 5px 0;">13330 Le Barben, FR</p>
          <p style="margin: 5px 0;">contact@dkautomotive.fr</p>
          <p style="margin: 5px 0;">+33 (0) 7 88 67 33 03</p>
          <p style="margin: 5px 0;">SIRET: 95324178500017</p>
        </div>
      </div>
      
      <!-- Description table -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #18257D; color: white;">
              <th style="padding: 10px; text-align: left;">Description</th>
              <th style="padding: 10px; text-align: center;">Qté</th>
              <th style="padding: 10px; text-align: right;">Prix unitaire</th>
              <th style="padding: 10px; text-align: center;">TVA (%)</th>
              <th style="padding: 10px; text-align: right;">Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 15px 10px; border-bottom: 1px solid #e2e8f0;">
                <p style="margin: 0; font-weight: bold;">Convoyage Véhicule</p>
                <p style="margin: 5px 0 0 0;">
                  Départ: ${invoice.service.pickupAddress}<br>
                  Livraison: ${invoice.service.deliveryAddress}<br>
                  Kilométrage: ${invoice.service.distance} km<br>
                  Type de véhicule: ${invoice.vehicle.brand} ${invoice.vehicle.model} 
                  (${invoice.vehicle.licensePlate})
                </p>
              </td>
              <td style="padding: 15px 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">1</td>
              <td style="padding: 15px 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">
                ${invoice.pricing.priceHT.toFixed(2)}€
              </td>
              <td style="padding: 15px 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">${tvaRate} %</td>
              <td style="padding: 15px 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">
                ${invoice.pricing.priceHT.toFixed(2)}€
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Totals -->
      <div style="margin-top: 20px;">
        <table style="width: 40%; margin-left: auto; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 10px; font-weight: bold;">Total HT</td>
            <td style="padding: 5px 10px; text-align: right;">${invoice.pricing.priceHT.toFixed(2)}€</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; font-weight: bold;">TVA (${tvaRate}%)</td>
            <td style="padding: 5px 10px; text-align: right;">${tvaAmount.toFixed(2)}€</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold;">Total TTC</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">${invoice.pricing.priceTTC.toFixed(2)}€</td>
          </tr>
        </table>
      </div>
      
      <!-- Payment instructions -->
      <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <h3 style="color: #18257D; margin: 0 0 10px 0; font-size: 16px;">INSTRUCTIONS DE PAIEMENT</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; font-weight: bold; width: 30%;">Méthode de paiement</td>
            <td style="padding: 5px 0;">Virement bancaire</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-weight: bold;">Bénéficiaire</td>
            <td style="padding: 5px 0;">JLD SYNERGY</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-weight: bold;">IBAN</td>
            <td style="padding: 5px 0;">FR76 1027 8090 6100 0202 4270 170</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-weight: bold;">BIC</td>
            <td style="padding: 5px 0;">CMCIFR2A</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-weight: bold;">Référence</td>
            <td style="padding: 5px 0;">${invoice.invoiceNumber}</td>
          </tr>
        </table>
      </div>
      
      <!-- Footer note -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">Conditions de paiement: 30 jours à compter de la date d'émission.</p>
        <p style="margin: 10px 0 0 0;">JLD SYNERGY - SASU au capital de 1000€ - SIRET: 95324178500017</p>
      </div>
    </div>
  `;

  const opt = {
    margin: [10, 10],
    filename: `DKAUTOMOTIVE-FACTURE-${invoice.invoiceNumber}`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return html2pdf().set(opt).from(content).save();
};

// Fonction utilitaire pour convertir une mission en données de facture
export const missionToInvoiceData = (mission: MissionRow, invoiceNumber: string): InvoiceData => {
  const vehicleInfo = mission.vehicle_info as any || {};
  const pickupContact = mission.pickup_contact as any || {};
  const deliveryContact = mission.delivery_contact as any || {};
  const clientProfile = mission.clientProfile || {};
  
  // Date de création de la facture (aujourd'hui)
  const issueDate = new Date().toISOString();
  
  // Date d'échéance (30 jours après)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  
  return {
    invoiceNumber,
    missionNumber: mission.mission_number || 'N/A',
    missionId: mission.id,
    client: {
      name: clientProfile.company_name || `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim() || 'Client',
      address: clientProfile.billing_address || 'Adresse non spécifiée',
      email: pickupContact.email || 'N/A',
      phone: pickupContact.phone || clientProfile.phone || 'N/A',
      vatNumber: clientProfile.vat_number,
      siretNumber: clientProfile.siret_number
    },
    vehicle: {
      brand: vehicleInfo.brand || 'N/A',
      model: vehicleInfo.model || 'N/A',
      licensePlate: vehicleInfo.licensePlate || 'N/A',
      year: vehicleInfo.year || 'N/A'
    },
    service: {
      description: 'Convoyage de véhicule',
      pickupAddress: mission.pickup_address || 'N/A',
      deliveryAddress: mission.delivery_address || 'N/A',
      pickupDate: mission.pickup_date ? format(new Date(mission.pickup_date), "PPP", { locale: fr }) : 'N/A',
      deliveryDate: mission.delivery_date ? format(new Date(mission.delivery_date), "PPP", { locale: fr }) : 'N/A',
      distance: mission.distance || 'N/A'
    },
    pricing: {
      priceHT: mission.price_ht || 0,
      tva: mission.price_ttc && mission.price_ht ? mission.price_ttc - mission.price_ht : 0,
      priceTTC: mission.price_ttc || 0
    },
    issueDate,
    dueDate: dueDate.toISOString(),
    isPaid: false
  };
};
