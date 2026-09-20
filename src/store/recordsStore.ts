import { create } from 'zustand';
import { MedicalRecord, RecordFilter } from '../types';
import { INITIAL_MOCK_RECORDS } from '../constants';

const STORAGE_KEY = 'consultready_medical_records_v1';

function loadStoredRecords(): MedicalRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read records from localStorage', err);
  }
  return INITIAL_MOCK_RECORDS;
}

function saveRecords(records: MedicalRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Failed to save records to localStorage', err);
  }
}

interface RecordsState {
  records: MedicalRecord[];
  activeFilter: RecordFilter;
  searchQuery: string;

  setFilter: (filter: RecordFilter) => void;
  setSearchQuery: (query: string) => void;
  addRecord: (record: Omit<MedicalRecord, 'id'>) => MedicalRecord;
  removeRecord: (id: string) => void;
  getRecordById: (id: string) => MedicalRecord | undefined;
  getFilteredRecords: () => MedicalRecord[];
  resetDefaultRecords: () => void;
}

export const useRecordsStore = create<RecordsState>((set, get) => ({
  records: loadStoredRecords(),
  activeFilter: 'All',
  searchQuery: '',

  setFilter: (filter) => set({ activeFilter: filter }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addRecord: (newRecData) => {
    const newRecord: MedicalRecord = {
      ...newRecData,
      id: `REC_UPLOAD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      isUploaded: true,
      uploadedAt: new Date().toISOString()
    };

    set((state) => {
      const updated = [newRecord, ...state.records];
      saveRecords(updated);
      return { records: updated };
    });

    return newRecord;
  },

  removeRecord: (id) => {
    set((state) => {
      const updated = state.records.filter((r) => r.id !== id);
      saveRecords(updated);
      return { records: updated };
    });
  },

  getRecordById: (id) => {
    return get().records.find((r) => r.id === id);
  },

  getFilteredRecords: () => {
    const { records, activeFilter, searchQuery } = get();
    return records.filter((rec) => {
      // Filter by category
      let matchesFilter = true;
      if (activeFilter === 'Reports') {
        matchesFilter = rec.type === 'Lab Report' || rec.type === 'Hospital Record' || rec.type === 'Vitals / History';
      } else if (activeFilter === 'Prescriptions') {
        matchesFilter = rec.type === 'Prescription';
      } else if (activeFilter === 'Imaging') {
        matchesFilter = rec.type === 'Imaging';
      }

      // Filter by search
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          rec.title.toLowerCase().includes(q) ||
          rec.provider.toLowerCase().includes(q) ||
          rec.type.toLowerCase().includes(q) ||
          rec.date.toLowerCase().includes(q);
      }

      return matchesFilter && matchesSearch;
    });
  },

  resetDefaultRecords: () => {
    saveRecords(INITIAL_MOCK_RECORDS);
    set({ records: INITIAL_MOCK_RECORDS, activeFilter: 'All', searchQuery: '' });
  }
}));
