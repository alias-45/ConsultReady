import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Sparkles,
  FolderPlus,
  ArrowRight,
  HeartPulse,
  Wind,
  Brain,
  Bone,
  Stethoscope,
  Activity,
  Pill,
  ShieldCheck,
  ChevronRight,
  Lock
} from 'lucide-react';
import { MedicalRecord, RecordFilter } from '../../types';
import { useRecordsStore } from '../../store/recordsStore';
import { useAuthStore } from '../../store/authStore';
import { RecordCard } from '../../components/common/RecordCard';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { EmptyState } from '../../components/common/EmptyState';
import { UploadRecordModal } from '../../components/patient/UploadRecordModal';
import { AppLogo } from '../../components/common/AppLogo';
import { SPECIALTIES } from '../../constants';

interface MyRecordsScreenProps {
  onViewRecord: (record: MedicalRecord) => void;
  onCreateConsultation: (specialty?: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

const SPECIALTY_META: Record<string, { icon: React.ComponentType<{ className?: string }>; bg: string; color: string; border: string }> = {
  Cardiology: { icon: HeartPulse, bg: 'bg-[#FEF1F2]', color: 'text-[#EF4444]', border: 'border-[#FECDD3]' },
  Pulmonology: { icon: Wind, bg: 'bg-[#F0F9FF]', color: 'text-[#0284C7]', border: 'border-[#BAE6FD]' },
  'General Medicine': { icon: Stethoscope, bg: 'bg-[#EEF7F5]', color: 'text-[#1A7A6E]', border: 'border-[#C5ECE5]' },
  Neurology: { icon: Brain, bg: 'bg-[#FDF0F3]', color: 'text-[#F06292]', border: 'border-[#FBCFE8]' },
  Orthopedics: { icon: Bone, bg: 'bg-[#FEF6EE]', color: 'text-[#F97316]', border: 'border-[#FED7AA]' },
  Gastroenterology: { icon: Activity, bg: 'bg-[#F5F3FF]', color: 'text-[#8B5CF6]', border: 'border-[#DDD6FE]' },
  Endocrinology: { icon: Pill, bg: 'bg-[#ECFEFF]', color: 'text-[#0891B2]', border: 'border-[#A5F3FC]' },
  Dermatology: { icon: Sparkles, bg: 'bg-[#FFF7ED]', color: 'text-[#EA580C]', border: 'border-[#FFEDD5]' }
};

export const MyRecordsScreen: React.FC<MyRecordsScreenProps> = ({
  onViewRecord,
  onCreateConsultation,
  onShowToast
}) => {
  const {
    activeFilter,
    setFilter,
    searchQuery,
    setSearchQuery,
    getFilteredRecords,
    removeRecord
  } = useRecordsStore();

  const patient = useAuthStore((state) => state.patient);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const filteredRecords = getFilteredRecords();
  const filters: RecordFilter[] = ['All', 'Reports', 'Prescriptions', 'Imaging'];

  const handleUploadSuccess = (title: string) => {
    onShowToast('Record Uploaded', `"${title}" has been saved to your clinical records.`, 'success');
  };

  const handleDelete = (id: string, title: string) => {
    removeRecord(id);
    onShowToast('Record Removed', `"${title}" was removed from your records.`, 'info');
  };

  return (
    <div className="flex flex-col min-h-full pb-20 sm:pb-6 animate-in fade-in duration-200">
      {/* Top Patient Bar matching the reference UI */}
      <div className="px-4 py-3 sm:px-6 bg-white border-b border-[#E8EFEF]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full overflow-hidden bg-[#E8F6F4] text-[#1A7A6E] font-bold text-sm border-2 border-[#C5ECE5] shrink-0 shadow-2xs">
              {patient.avatarUrl ? (
                <img
                  src={patient.avatarUrl}
                  alt={patient.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{patient.name.charAt(0)}</span>
              )}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-slate-400 block leading-tight">
                Welcome Back
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate">
                {patient.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95 shadow-2xs shrink-0 ${
                showSearchInput || searchQuery
                  ? 'border-[#1A7A6E] bg-[#E8F6F4] text-[#1A7A6E]'
                  : 'border-slate-200/90 text-slate-600 hover:bg-slate-50'
              }`}
              aria-label="Search records"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#1A7A6E] text-white px-3.5 py-2 text-xs font-bold hover:bg-[#14655B] active:scale-95 transition shadow-sm shadow-[#1A7A6E]/20 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {showSearchInput && (
          <div className="mt-3 relative animate-in fade-in duration-150">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, imaging, prescriptions, or doctors..."
              className="w-full rounded-2xl border border-[#E8EFEF] bg-slate-50/80 py-2.5 pl-9 pr-14 text-xs font-medium text-slate-900 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition shadow-2xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Prominent Teal Hero Banner with Doctor Consultation Imagery */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A7A6E] via-[#166E63] to-[#125A50] p-5 sm:p-6 text-white shadow-lg shadow-[#1A7A6E]/15">
          {/* Subtle decorative medical circles */}
          <div className="absolute -right-8 -bottom-8 h-36 w-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-8 -top-8 h-24 w-24 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                Looking to consult a doctor?
              </h3>
              <p className="text-xs text-white/85 leading-relaxed max-w-sm">
                Bundle relevant medical records into an encrypted, auto-expiring QR pass for your consultation.
              </p>
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  onClick={() => onCreateConsultation()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-[#1A7A6E] px-4 py-2.5 text-xs font-extrabold hover:bg-slate-50 transition active:scale-95 shadow-md shrink-0"
                >
                  <span>Prepare Pass</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Doctor Consultation Photo Showcase */}
            <div className="flex items-center gap-3 shrink-0 self-center sm:self-auto">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg shrink-0 group bg-[#166E63]">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=320&q=80"
                  alt="Doctor Consultation"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=320&q=80') {
                      target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=320&q=80';
                    }
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-1.5 text-center">
                  <span className="text-[10px] font-bold text-white block truncate">
                    Verified Doctors
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Specialty Quick Badges with no overlap on mobile */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Find your specialty
              </h3>
              <p className="text-[11px] text-slate-400">
                Tap to quickly prepare consultation records
              </p>
            </div>
            <button
              onClick={() => onCreateConsultation()}
              className="flex items-center gap-0.5 text-xs font-bold text-[#1A7A6E] hover:text-[#14655B]"
            >
              <span>See All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {SPECIALTIES.map((spec) => {
              const meta = SPECIALTY_META[spec] || {
                icon: Stethoscope,
                bg: 'bg-slate-100',
                color: 'text-slate-600',
                border: 'border-slate-200'
              };
              const Icon = meta.icon;

              return (
                <button
                  key={spec}
                  onClick={() => onCreateConsultation(spec)}
                  className="group flex flex-col items-center shrink-0 active:scale-95 transition-all w-20"
                  title={`Start consultation for ${spec}`}
                >
                  <div
                    className={`flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover:scale-105 shadow-2xs ${meta.bg} ${meta.border} ${meta.color}`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
                  </div>
                  <span className="mt-1.5 text-[10px] sm:text-[11px] font-bold text-slate-700 group-hover:text-[#1A7A6E] text-center w-full px-0.5 truncate block leading-tight">
                    {spec}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filters.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-[#1A7A6E] text-white shadow-xs'
                      : 'bg-white border border-[#E8EFEF] text-slate-600 hover:bg-[#E8F6F4] hover:text-[#1A7A6E]'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden xs:inline">
            {filteredRecords.length} records
          </span>
        </div>

        {/* Medical Records List */}
        <div className="space-y-3">
          {filteredRecords.length === 0 ? (
            <EmptyState
              title="No Records Found"
              description={
                searchQuery
                  ? `No records match your search "${searchQuery}". Try a different keyword.`
                  : `No records in the ${activeFilter} category.`
              }
              actionLabel="+ Upload Record"
              onAction={() => setIsUploadOpen(true)}
              icon={searchQuery ? 'search' : 'folder'}
            />
          ) : (
            filteredRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onView={() => onViewRecord(record)}
                onDelete={() => handleDelete(record.id, record.title)}
              />
            ))
          )}
        </div>
      </div>

      {/* Upload Record Modal */}
      <UploadRecordModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};
