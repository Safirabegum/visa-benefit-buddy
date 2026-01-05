export interface BenefitResponse {
  benefit: string;
  details: string;
  condition: string;
  source: string;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  file_size: number;
  content: string;
  uploaded_at: string;
  user_session: string;
}

export interface BenefitQuery {
  id: string;
  card_number_masked: string;
  location: string;
  language: string;
  query: string;
  benefit_response: BenefitResponse | null;
  reasoning_log: string[];
  created_at: string;
  user_session: string;
}

export type Location = 'IIT Madras Main Gate' | 'Chennai Airport' | 'Phoenix Mall';
export type Language = 'English' | 'Tamil';
