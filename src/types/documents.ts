
export type DriverDocumentType = 'kbis' | 'driving_license' | 'id_card' | 'vigilance_certificate';

export interface DriverDocument {
  id: string;
  user_id: string;
  document_type: DriverDocumentType;
  document_url: string;
  uploaded_at: string;
  verified: boolean;
}

export const DOCUMENT_TYPE_LABELS: Record<DriverDocumentType, string> = {
  kbis: 'Extrait KBIS',
  driving_license: 'Permis de conduire',
  id_card: 'Carte d\'identité',
  vigilance_certificate: 'Attestation de vigilance'
};
