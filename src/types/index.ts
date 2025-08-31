export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'DOCTOR' | 'NURSE' | 'JUNIOR_DOCTOR';
  institution_id: string;
  created_at: string;
  is_active: boolean;
}

export interface Institution {
  id: string;
  name: string;
  address: string;
  contact_info: string;
  created_at: string;
}

export interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string;
  date_of_admission: string;
  bed_number: string;
  room_number: string;
  status: 'ACTIVE' | 'REVIEW_PENDING' | 'DISCHARGED';
  institution_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  patient_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  upload_date: string;
  file_size: number;
}

export interface DischargeSummary {
  id: string;
  patient_id: string;
  content: string;
  status: 'DRAFT' | 'REVIEW_PENDING' | 'APPROVED';
  generated_by: string;
  approved_by?: string;
  generated_at: string;
  approved_at?: string;
  version_number: number;
}

export interface DashboardStats {
  patients_admitted_today: number;
  patients_discharged_today: number;
  average_length_of_stay: number;
  pending_summaries: number;
  active_patients: number;
  total_staff: number;
}