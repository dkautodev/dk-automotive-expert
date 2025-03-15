import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Quote } from '@/types/order';

export const generateQuotePDF = (quote: Quote) => {
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 210mm;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 2px solid #1a365d; padding-bottom: 20px;">
        <div>
          <h1 style="color: #1a365d; font-size: 28px; margin: 0;">DK Automotive</h1>
          <p style="color: #64748b; margin: 5px 0;">Transport de véhicules</p>
        </div>
        <div style="text-align: right;">
          <p style="color: #1a365d; margin: 0; font-size: 18px; font-weight: bold;">Devis n° ${quote.quote_number}</p>
          <p style="color: #64748b; margin: 5px 0;">Créé le: ${format(new Date(quote.dateCreated), "dd/MM/yyyy")}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="color: #2c5282; font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Adresses et dates</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p style="margin: 5px 0; font-weight: bold;">Adresse de départ:</p>
            <p style="margin: 5px 0;">${quote.pickupAddress}</p>
            ${quote.pickupDate ? `
              <p style="margin: 15px 0 5px 0; font-weight: bold;">Date de prise en charge:</p>
              <p style="margin: 5px 0;">${format(new Date(quote.pickupDate), "PPP", { locale: fr })}
              ${quote.pickupTime ? ` à ${quote.pickupTime}` : ''}</p>
            ` : ''}
          </div>
          <div>
            <p style="margin: 5px 0; font-weight: bold;">Adresse de livraison:</p>
            <p style="margin: 5px 0;">${quote.deliveryAddress}</p>
            ${quote.deliveryDate ? `
              <p style="margin: 15px 0 5px 0; font-weight: bold;">Date de livraison:</p>
              <p style="margin: 5px 0;">${format(new Date(quote.deliveryDate), "PPP", { locale: fr })}
              ${quote.deliveryTime ? ` à ${quote.deliveryTime}` : ''}</p>
            ` : ''}
          </div>
        </div>
        ${quote.distance ? `<p style="margin: 15px 0;"><strong>Distance:</strong> ${quote.distance}</p>` : ''}
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="color: #2c5282; font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Véhicules</h2>
        <div style="display: grid; gap: 15px;">
          ${quote.vehicles.map((vehicle, index) => `
            <div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px;">
              <h3 style="color: #4a5568; font-size: 16px; margin: 0 0 10px 0;">Véhicule ${index + 1}</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <p style="margin: 5px 0;"><strong>Marque:</strong> ${vehicle.brand}</p>
                <p style="margin: 5px 0;"><strong>Modèle:</strong> ${vehicle.model}</p>
                <p style="margin: 5px 0;"><strong>Année:</strong> ${vehicle.year}</p>
                <p style="margin: 5px 0;"><strong>Carburant:</strong> ${vehicle.fuel}</p>
                <p style="margin: 5px 0;"><strong>Immatriculation:</strong> ${vehicle.licensePlate}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 30px; border-top: 2px solid #1a365d; padding-top: 20px;">
        <div style="text-align: right;">
          <h2 style="color: #2c5282; font-size: 20px; margin: 0;">Prix Total HT: ${quote.totalPriceHT.toFixed(2)}€</h2>
          <h2 style="color: #2c5282; font-size: 20px; margin: 5px 0;">Prix Total TTC: ${quote.totalPriceTTC.toFixed(2)}€</h2>
          <p style="color: #64748b; margin: 10px 0; font-size: 12px;">Ce devis est valable 30 jours à compter de sa date d'émission.</p>
        </div>
      </div>
    </div>
  `;

  const opt = {
    margin: [10, 10],
    filename: `DKAUTOMOTIVE-${quote.quote_number}`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(content).save();
};
