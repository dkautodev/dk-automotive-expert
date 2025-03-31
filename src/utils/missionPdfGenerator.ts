
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MissionRow } from '@/types/database';

export const generateMissionPDF = (mission: MissionRow) => {
  // Format the date
  const currentDate = format(new Date(), "dd/MM/yyyy", { locale: fr });
  
  // Extract vehicle information
  const vehicleInfo = mission.vehicle_info as any || {};
  
  const content = document.createElement('div');
  content.innerHTML = `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 210mm;">
      <!-- Header with logo and title -->
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 2px solid #1a365d; padding-bottom: 20px;">
        <div>
          <img src="/dk-automotive-logo.png" alt="DK Automotive" style="height: 60px; margin-bottom: 10px;" />
          <p style="color: #64748b; margin: 5px 0;">Convoyage | Livraisons | Restitutions</p>
        </div>
        <div style="text-align: right;">
          <h1 style="color: #1a365d; margin: 0; font-size: 28px;">Devis</h1>
        </div>
      </div>
      
      <!-- Quote information -->
      <div style="margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px 0; font-weight: bold; width: 40%;">Numéro de devis</td>
            <td style="padding: 5px 0;">${mission.mission_number || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-weight: bold;">Date d'émission</td>
            <td style="padding: 5px 0;">${currentDate}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-weight: bold;">Date d'expiration</td>
            <td style="padding: 5px 0;">Indéfini</td>
          </tr>
        </table>
      </div>
      
      <!-- Client & Provider information -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
        <div>
          ${mission.pickup_contact ? `
            <h3 style="color: #1a365d; margin: 0 0 10px 0; font-size: 16px;">CLIENT</h3>
            <p style="margin: 5px 0; font-weight: bold;">
              ${(mission.pickup_contact as any).firstName || ""} ${(mission.pickup_contact as any).lastName || ""}
            </p>
            <p style="margin: 5px 0;">${mission.pickup_address || "N/A"}</p>
            <p style="margin: 5px 0;">${(mission.pickup_contact as any).email || "N/A"}</p>
            <p style="margin: 5px 0;">${(mission.pickup_contact as any).phone || "N/A"}</p>
          ` : `<p>Informations client non disponibles</p>`}
        </div>
        <div>
          <h3 style="color: #1a365d; margin: 0 0 10px 0; font-size: 16px;">JLD SYNERGY</h3>
          <p style="margin: 5px 0;">271 F Route de Cazan</p>
          <p style="margin: 5px 0;">13330 Le Barben, FR</p>
          <p style="margin: 5px 0;">contact@dkautomotive.fr</p>
          <p style="margin: 5px 0;">+33 (0) 7 88 67 33 03</p>
        </div>
      </div>
      
      <!-- Description table -->
      <div style="margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #1a365d; color: white;">
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
                <p style="margin: 0; font-weight: bold;">Convoyage</p>
                <p style="margin: 5px 0 0 0;">
                  Départ: ${mission.pickup_address || "N/A"}<br>
                  Livraison: ${mission.delivery_address || "N/A"}<br>
                  ${mission.distance ? `Kilométrage: ${mission.distance} km<br>` : ""}
                  Type de véhicule: ${vehicleInfo.brand || "N/A"} ${vehicleInfo.model || ""} 
                  ${vehicleInfo.licensePlate ? `(${vehicleInfo.licensePlate})` : ""}
                </p>
              </td>
              <td style="padding: 15px 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">1</td>
              <td style="padding: 15px 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">
                ${mission.price_ht ? `${mission.price_ht.toFixed(2)}€` : "N/A"}
              </td>
              <td style="padding: 15px 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">20 %</td>
              <td style="padding: 15px 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">
                ${mission.price_ht ? `${mission.price_ht.toFixed(2)}€` : "N/A"}
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
            <td style="padding: 5px 10px; text-align: right;">
              ${mission.price_ht ? `${mission.price_ht.toFixed(2)}€` : "N/A"}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; font-weight: bold;">Montant total de la TVA</td>
            <td style="padding: 5px 10px; text-align: right;">
              ${mission.price_ht && mission.price_ttc ? 
                `${(mission.price_ttc - mission.price_ht).toFixed(2)}€` : "N/A"}
            </td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold;">Total TTC</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">
              ${mission.price_ttc ? `${mission.price_ttc.toFixed(2)}€` : "N/A"}
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Footer note -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">Validité du devis: Indéfini</p>
        <p style="margin: 10px 0 0 0;">JLD SYNERGY - SASU au capital de 1000€ - SIRET: 95324178500017</p>
      </div>
    </div>
  `;

  const opt = {
    margin: [10, 10],
    filename: `DKAUTOMOTIVE-DEVIS-${mission.mission_number || "SANS-NUMERO"}`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(content).save();
};
