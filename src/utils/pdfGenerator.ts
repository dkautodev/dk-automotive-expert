
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { OrderState } from '@/types/order';

export const generateQuotePDF = (orderDetails: OrderState, totalPriceHT: number) => {
  const quoteNumber = 'DEV-00000100';
  const totalPriceTTC = totalPriceHT * 1.2;
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 210mm;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 2px solid #1a365d; padding-bottom: 20px;">
        <div>
          <h1 style="color: #1a365d; font-size: 24px; margin: 0;">DK Automotive</h1>
          <p style="color: #64748b; margin: 5px 0;">Transport de véhicules</p>
        </div>
        <div style="text-align: right;">
          <p style="color: #64748b; margin: 0;">Devis n° ${quoteNumber}</p>
          <p style="color: #64748b; margin: 0;">Date: ${format(new Date(), "dd/MM/yyyy")}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #2c5282; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Adresses et dates</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div>
            <p style="margin: 5px 0;"><strong>Adresse de départ:</strong></p>
            <p style="margin: 5px 0;">${orderDetails.pickupAddress}</p>
            <p style="margin: 5px 0;"><strong>Date de prise en charge:</strong></p>
            <p style="margin: 5px 0;">${format(orderDetails.pickupDate, "PPP 'à' HH:mm", { locale: fr })}</p>
          </div>
          <div>
            <p style="margin: 5px 0;"><strong>Adresse de livraison:</strong></p>
            <p style="margin: 5px 0;">${orderDetails.deliveryAddress}</p>
            <p style="margin: 5px 0;"><strong>Date de livraison:</strong></p>
            <p style="margin: 5px 0;">${format(orderDetails.deliveryDate, "PPP 'à' HH:mm", { locale: fr })}</p>
          </div>
        </div>
        <p style="margin: 15px 0;"><strong>Distance:</strong> ${orderDetails.distance}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #2c5282; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Contacts</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div>
            <h3 style="color: #4a5568; font-size: 16px; margin: 0 0 10px 0;">Contact départ</h3>
            <p style="margin: 5px 0;">${orderDetails.pickupContact.firstName} ${orderDetails.pickupContact.lastName}</p>
            <p style="margin: 5px 0;">${orderDetails.pickupContact.email}</p>
            <p style="margin: 5px 0;">${orderDetails.pickupContact.phone}</p>
          </div>
          <div>
            <h3 style="color: #4a5568; font-size: 16px; margin: 0 0 10px 0;">Contact livraison</h3>
            <p style="margin: 5px 0;">${orderDetails.deliveryContact.firstName} ${orderDetails.deliveryContact.lastName}</p>
            <p style="margin: 5px 0;">${orderDetails.deliveryContact.email}</p>
            <p style="margin: 5px 0;">${orderDetails.deliveryContact.phone}</p>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #2c5282; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Véhicules</h2>
        <div style="margin-top: 15px;">
          ${orderDetails.vehicles.map((vehicle, index) => `
            <div style="border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
              <h3 style="color: #4a5568; font-size: 16px; margin: 0 0 10px 0;">Véhicule ${index + 1}</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
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

      <div style="margin-top: 40px; border-top: 2px solid #1a365d; padding-top: 20px;">
        <div style="text-align: right;">
          <h2 style="color: #2c5282; font-size: 20px; margin: 0;">Prix Total HT: ${totalPriceHT}€</h2>
          <h2 style="color: #2c5282; font-size: 20px; margin: 5px 0;">Prix Total TTC: ${totalPriceTTC.toFixed(2)}€</h2>
          <p style="color: #64748b; margin: 5px 0; font-size: 12px;">Ce devis est valable 30 jours à compter de sa date d'émission.</p>
        </div>
      </div>
    </div>
  `;

  const opt = {
    margin: [15, 15],
    filename: `DK_Automotive-${quoteNumber}`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(content).save();
};
