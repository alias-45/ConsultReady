import { create } from 'zustand';
import { ConsultationSession, SessionStatus, UserProfile } from '../types';
import { generateSessionId } from '../services/qrService';
import { DEMO_PATIENT, VALID_SESSION_DURATION_MS } from '../constants';

const SESSIONS_STORAGE_KEY = 'consultready_sessions_store_v1';

function loadStoredSessions(): Record<string, ConsultationSession> {
  try {
    const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read sessions from localStorage', err);
  }

  // Pre-seed a default demo session for instant demonstration
  const now = new Date();
  const demoExpires = new Date(now.getTime() + VALID_SESSION_DURATION_MS);
  const demoSessionId = 'CONSULT_SESSION_8F72A91C';

  const initialDemo: ConsultationSession = {
    id: demoSessionId,
    patientId: DEMO_PATIENT.id,
    patientName: DEMO_PATIENT.name,
    patientAge: DEMO_PATIENT.age || 29,
    patientGender: DEMO_PATIENT.gender || 'Female',
    specialty: 'Cardiology',
    reason: 'Chest pain',
    selectedRecordIds: [
      'REC_ECG_001',
      'REC_BP_002',
      'REC_LIPID_003',
      'REC_MEDS_004',
      'REC_CARD_005'
    ],
    createdAt: now.toISOString(),
    expiresAt: demoExpires.toISOString(),
    status: 'pending'
  };

  return {
    [demoSessionId]: initialDemo
  };
}

function saveSessions(sessions: Record<string, ConsultationSession>) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn('Failed to save sessions to localStorage', err);
  }
}

interface SessionState {
  sessions: Record<string, ConsultationSession>;
  currentSessionId: string | null;
  activeDoctorSessionId: string | null;

  createPatientSession: (
    patient: UserProfile,
    specialty: string,
    reason: string,
    selectedRecordIds: string[]
  ) => ConsultationSession;
  
  setCurrentSessionId: (id: string | null) => void;
  setActiveDoctorSessionId: (id: string | null) => void;
  
  getSession: (id: string) => ConsultationSession | undefined;
  
  grantAccess: (
    sessionId: string,
    doctor: UserProfile
  ) => { success: boolean; session?: ConsultationSession; error?: string };
  
  sendAccessRequest: (
    sessionId: string,
    requesterName: string,
    requesterRole: string
  ) => { success: boolean; error?: string };

  acceptAccessRequest: (
    sessionId: string
  ) => { success: boolean; session?: ConsultationSession; error?: string };

  denyAccessRequest: (sessionId: string) => void;
  
  revokeAccess: (sessionId: string) => void;
  endDoctorSession: (sessionId: string) => void;
  expireSession: (sessionId: string) => void;
  fastForwardSession: (sessionId: string, minutes: number) => void;
  
  checkSessionStatus: (sessionId: string) => {
    valid: boolean;
    status: SessionStatus;
    remainingMs: number;
    errorReason?: string;
  };
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: loadStoredSessions(),
  currentSessionId: 'CONSULT_SESSION_8F72A91C',
  activeDoctorSessionId: null,

  createPatientSession: (patient, specialty, reason, selectedRecordIds) => {
    const id = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + VALID_SESSION_DURATION_MS).toISOString();

    const newSession: ConsultationSession = {
      id,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age || 29,
      patientGender: patient.gender || 'Female',
      specialty,
      reason,
      selectedRecordIds,
      createdAt: now.toISOString(),
      expiresAt,
      status: 'pending'
    };

    set((state) => {
      const updated = { ...state.sessions, [id]: newSession };
      saveSessions(updated);
      return {
        sessions: updated,
        currentSessionId: id
      };
    });

    return newSession;
  },

  setCurrentSessionId: (id) => set({ currentSessionId: id }),

  setActiveDoctorSessionId: (id) => set({ activeDoctorSessionId: id }),

  getSession: (id) => {
    const { sessions } = get();
    return sessions[id];
  },

  sendAccessRequest: (sessionId, requesterName, requesterRole) => {
    const session = get().sessions[sessionId];
    if (!session) {
      return { success: false, error: 'Session not found or invalid QR.' };
    }

    const validity = get().checkSessionStatus(sessionId);
    if (!validity.valid) {
      return { success: false, error: validity.errorReason || 'Session is no longer valid.' };
    }

    const updatedSession: ConsultationSession = {
      ...session,
      status: 'requested',
      requesterName: requesterName.trim() || 'Consulting Physician',
      requesterRole: requesterRole.trim() || 'Medical Specialist',
      requestedAt: new Date().toISOString()
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return { sessions: updated };
    });

    return { success: true };
  },

  acceptAccessRequest: (sessionId) => {
    const session = get().sessions[sessionId];
    if (!session) {
      return { success: false, error: 'Session not found.' };
    }

    const updatedSession: ConsultationSession = {
      ...session,
      status: 'active',
      grantedAt: new Date().toISOString()
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return {
        sessions: updated,
        activeDoctorSessionId: sessionId
      };
    });

    return { success: true, session: updatedSession };
  },

  denyAccessRequest: (sessionId) => {
    const session = get().sessions[sessionId];
    if (!session) return;

    const updatedSession: ConsultationSession = {
      ...session,
      status: 'denied'
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return { sessions: updated };
    });
  },

  grantAccess: (sessionId, doctor) => {
    const session = get().sessions[sessionId];
    if (!session) {
      return { success: false, error: 'Session not found or invalid QR.' };
    }

    const validity = get().checkSessionStatus(sessionId);
    if (!validity.valid) {
      return { success: false, error: validity.errorReason || 'Session is no longer valid.' };
    }

    const updatedSession: ConsultationSession = {
      ...session,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorLicense: doctor.doctorLicense,
      status: 'active',
      grantedAt: new Date().toISOString()
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return {
        sessions: updated,
        activeDoctorSessionId: sessionId
      };
    });

    return { success: true, session: updatedSession };
  },

  revokeAccess: (sessionId) => {
    const session = get().sessions[sessionId];
    if (!session) return;

    const updatedSession: ConsultationSession = {
      ...session,
      status: 'revoked'
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return { sessions: updated };
    });
  },

  endDoctorSession: (sessionId) => {
    const session = get().sessions[sessionId];
    if (!session) return;

    const updatedSession: ConsultationSession = {
      ...session,
      status: 'expired'
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return {
        sessions: updated,
        activeDoctorSessionId: null
      };
    });
  },

  expireSession: (sessionId) => {
    const session = get().sessions[sessionId];
    if (!session) return;

    const updatedSession: ConsultationSession = {
      ...session,
      status: 'expired'
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return { sessions: updated };
    });
  },

  fastForwardSession: (sessionId, minutes) => {
    const session = get().sessions[sessionId];
    if (!session) return;

    // Shift expiresAt into the past or closer to now
    const currentExpiry = new Date(session.expiresAt).getTime();
    const newExpiry = new Date(currentExpiry - minutes * 60 * 1000).toISOString();

    const isNowExpired = new Date(newExpiry).getTime() <= Date.now();
    const updatedSession: ConsultationSession = {
      ...session,
      expiresAt: newExpiry,
      status: isNowExpired ? 'expired' : session.status
    };

    set((state) => {
      const updated = { ...state.sessions, [sessionId]: updatedSession };
      saveSessions(updated);
      return { sessions: updated };
    });
  },

  checkSessionStatus: (sessionId) => {
    const session = get().sessions[sessionId];
    if (!session) {
      return {
        valid: false,
        status: 'expired',
        remainingMs: 0,
        errorReason: 'Consultation session does not exist or has been removed.'
      };
    }

    if (session.status === 'revoked') {
      return {
        valid: false,
        status: 'revoked',
        remainingMs: 0,
        errorReason: 'Access to these records has been revoked by the patient.'
      };
    }

    if (session.status === 'denied') {
      return {
        valid: false,
        status: 'denied',
        remainingMs: 0,
        errorReason: 'The patient declined this access request.'
      };
    }

    if (session.status === 'expired') {
      return {
        valid: false,
        status: 'expired',
        remainingMs: 0,
        errorReason: 'This consultation session has expired.'
      };
    }

    const now = Date.now();
    const expiresAtMs = new Date(session.expiresAt).getTime();
    const remainingMs = expiresAtMs - now;

    if (remainingMs <= 0) {
      // Mark as expired in store
      get().expireSession(sessionId);
      return {
        valid: false,
        status: 'expired',
        remainingMs: 0,
        errorReason: 'This consultation session has expired.'
      };
    }

    return {
      valid: true,
      status: session.status,
      remainingMs
    };
  }
}));
