import { create } from 'zustand';
import { UserProfile, AppRole } from '../types';
import { DEMO_PATIENT, DEMO_DOCTOR } from '../constants';

interface AuthState {
  currentRole: AppRole;
  patient: UserProfile;
  doctor: UserProfile;

  setRole: (role: AppRole) => void;
  updatePatientProfile: (updated: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentRole: 'patient',
  patient: DEMO_PATIENT,
  doctor: DEMO_DOCTOR,

  setRole: (role) => set({ currentRole: role }),
  updatePatientProfile: (updated) =>
    set((state) => ({
      patient: { ...state.patient, ...updated }
    }))
}));

