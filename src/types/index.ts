export type RecordType = 'Lab Report' | 'Imaging' | 'Prescription' | 'Hospital Record' | 'Vitals / History';

export type RecordFilter = 'All' | 'Reports' | 'Prescriptions' | 'Imaging';

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  type: RecordType;
  provider: string;
  fileSize?: string;
  fileName?: string;
  isUploaded?: boolean;
  uploadedAt?: string;
  clinicalSummary?: string;
  details?: {
    patientName: string;
    patientAge: number;
    patientGender: string;
    facility: string;
    physician: string;
    findings?: string[];
    medications?: Array<{ name: string; dosage: string; frequency: string; duration: string }>;
    metrics?: Array<{ label: string; value: string; status?: 'normal' | 'warning' | 'critical' }>;
    ecgData?: {
      heartRate: number;
      prInterval: string;
      qrsDuration: string;
      qtc: string;
      rhythm: string;
      stSegment: string;
    };
  };
}

export type SessionStatus = 'pending' | 'requested' | 'active' | 'expired' | 'revoked' | 'denied';

export interface ConsultationSession {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  doctorId?: string;
  doctorName?: string;
  doctorLicense?: string;
  specialty: string;
  reason: string;
  selectedRecordIds: string[];
  createdAt: string; // ISO string
  expiresAt: string; // ISO string (e.g. 24 hours from creation)
  status: SessionStatus;
  grantedAt?: string;
  requesterName?: string;
  requesterRole?: string;
  requestedAt?: string;
}

export interface SmartSuggestionResult {
  recordId: string;
  record: MedicalRecord;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'patient' | 'doctor';
  email: string;
  gender?: 'Female' | 'Male' | 'Other';
  age?: number;
  bloodGroup?: string;
  doctorLicense?: string;
  hospitalAffiliation?: string;
}

export type PatientScreen = 
  | 'welcome'
  | 'records'
  | 'consultation-details'
  | 'smart-suggestions'
  | 'review-approve'
  | 'consultation-qr'
  | 'active-session-patient';

export type DoctorScreen = 
  | 'scan-qr'
  | 'verify-access'
  | 'request-access'
  | 'waiting-approval'
  | 'patient-records';

export type AppRole = 'patient' | 'doctor';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
