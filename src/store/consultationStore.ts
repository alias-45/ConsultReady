import { create } from 'zustand';
import { SmartSuggestionResult, MedicalRecord } from '../types';
import { getSmartRecordSuggestions } from '../services/smartSuggestions';

interface ConsultationState {
  specialty: string;
  reason: string;
  selectedRecordIds: string[];
  suggestions: SmartSuggestionResult[];
  isGenerating: boolean;

  setSpecialty: (specialty: string) => void;
  setReason: (reason: string) => void;
  toggleRecord: (recordId: string) => void;
  selectAllSuggestions: () => void;
  deselectAll: () => void;
  setSelectedRecords: (recordIds: string[]) => void;
  generateSuggestions: (records: MedicalRecord[]) => void;
  resetConsultation: () => void;
}

export const useConsultationStore = create<ConsultationState>((set, get) => ({
  specialty: 'Cardiology',
  reason: 'Chest pain',
  selectedRecordIds: [],
  suggestions: [],
  isGenerating: false,

  setSpecialty: (specialty) => {
    set({ specialty });
  },

  setReason: (reason) => {
    set({ reason });
  },

  toggleRecord: (recordId) => {
    set((state) => {
      const exists = state.selectedRecordIds.includes(recordId);
      const updated = exists
        ? state.selectedRecordIds.filter((id) => id !== recordId)
        : [...state.selectedRecordIds, recordId];
      return { selectedRecordIds: updated };
    });
  },

  selectAllSuggestions: () => {
    const { suggestions } = get();
    const ids = suggestions.map((s) => s.recordId);
    set({ selectedRecordIds: ids });
  },

  deselectAll: () => {
    set({ selectedRecordIds: [] });
  },

  setSelectedRecords: (recordIds) => {
    set({ selectedRecordIds: recordIds });
  },

  generateSuggestions: (records) => {
    const { specialty, reason } = get();
    set({ isGenerating: true });

    // Deterministic suggestions from smart suggestion service
    const results = getSmartRecordSuggestions(records, specialty, reason);
    
    // Automatically pre-select all suggested records by default
    const preselected = results.map((r) => r.recordId);

    set({
      suggestions: results,
      selectedRecordIds: preselected,
      isGenerating: false
    });
  },

  resetConsultation: () => {
    set({
      specialty: 'Cardiology',
      reason: 'Chest pain',
      selectedRecordIds: [],
      suggestions: [],
      isGenerating: false
    });
  }
}));
