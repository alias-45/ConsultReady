import React, { useState } from 'react';
import {
  Stethoscope,
  FileQuestion,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Wind,
  Brain,
  Bone,
  Activity,
  Pill
} from 'lucide-react';
import { SPECIALTIES, REASONS_BY_SPECIALTY } from '../../constants';
import { useConsultationStore } from '../../store/consultationStore';
import { useRecordsStore } from '../../store/recordsStore';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { LoadingState } from '../../components/common/LoadingState';

interface CreateConsultationScreenProps {
  onSuggestionsReady: () => void;
  onCancel: () => void;
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

export const CreateConsultationScreen: React.FC<CreateConsultationScreenProps> = ({
  onSuggestionsReady,
  onCancel
}) => {
  const { specialty, reason, setSpecialty, setReason, generateSuggestions } = useConsultationStore();
  const records = useRecordsStore((state) => state.records);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableReasons = REASONS_BY_SPECIALTY[specialty] || [
    'Initial clinical consultation',
    'Follow-up visit',
    'Second opinion evaluation',
    'Review of prior symptoms'
  ];

  const handleSpecialtyChange = (newSpecialty: string) => {
    setSpecialty(newSpecialty);
    const newReasons = REASONS_BY_SPECIALTY[newSpecialty];
    if (newReasons && newReasons.length > 0) {
      setReason(newReasons[0]);
    }
  };

  const handleGetSuggestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialty) {
      setError('Please select a doctor specialty.');
      return;
    }
    if (!reason) {
      setError('Please choose or enter a reason for visit.');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Brief simulated clinical processing
    setTimeout(() => {
      generateSuggestions(records);
      setIsLoading(false);
      onSuggestionsReady();
    }, 700);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <LoadingState
          title="Analyzing Relevant Records"
          message={`Reviewing your history for ${specialty} • ${reason}...`}
          isAiAnalysis={true}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto animate-in fade-in duration-200">
      <div className="mb-5 text-left">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A7A6E] bg-[#E8F6F4] border border-[#C5ECE5] px-3 py-1 rounded-full mb-2.5 w-fit">
          <Sparkles className="h-3.5 w-3.5 text-[#1A7A6E]" />
          <span>Step 1 of 3 • Specialty & Purpose</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Create Consultation
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Select clinical specialty & reason to automatically match your relevant diagnostic history.
        </p>
      </div>

      <form onSubmit={handleGetSuggestions} className="space-y-4">
        {error && (
          <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 border border-rose-200 shadow-2xs">
            {error}
          </div>
        )}

        {/* Doctor Specialty Category Grid */}
        <div className="rounded-3xl border border-[#E8EFEF] bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Stethoscope className="h-4 w-4 text-[#1A7A6E]" />
              <span>Select Clinical Specialty</span>
            </label>
            <span className="text-[11px] font-semibold text-[#1A7A6E]">
              {specialty || 'Choose'}
            </span>
          </div>

          {/* Circular Category Badges from Reference UI */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 py-1">
            {SPECIALTIES.map((spec) => {
              const meta = SPECIALTY_META[spec] || {
                icon: Stethoscope,
                bg: 'bg-slate-100',
                color: 'text-slate-600',
                border: 'border-slate-200'
              };
              const Icon = meta.icon;
              const isSelected = specialty === spec;

              return (
                <button
                  type="button"
                  key={spec}
                  onClick={() => handleSpecialtyChange(spec)}
                  className={`group flex flex-col items-center p-2 rounded-2xl transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-[#E8F6F4]/50 border border-[#C5ECE5]'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div
                    className={`relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full border transition-all duration-200 ${
                      meta.bg
                    } ${meta.border} ${meta.color} ${
                      isSelected
                        ? 'ring-2 ring-[#1A7A6E] ring-offset-2 scale-105 shadow-sm'
                        : 'group-hover:scale-105 shadow-2xs'
                    }`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] sm:text-[11px] font-bold text-center line-clamp-1 transition-colors ${
                      isSelected ? 'text-[#1A7A6E]' : 'text-slate-600 group-hover:text-slate-900'
                    }`}
                  >
                    {spec.replace(' Medicine', '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fallback Specialty Select Dropdown */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <select
              value={specialty}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              className="w-full rounded-xl border border-[#E8EFEF] bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition shadow-2xs"
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason for Visit with Quick Chips */}
        <div className="rounded-3xl border border-[#E8EFEF] bg-white p-4 sm:p-5 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2.5">
            <FileQuestion className="h-4 w-4 text-[#1A7A6E]" />
            <span>Reason for Visit</span>
          </label>

          {/* Quick Reason Chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {availableReasons.map((r) => {
              const isSelected = reason === r;
              return (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReason(r)}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold text-left transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#1A7A6E] text-white shadow-xs font-bold'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-[#E8F6F4] hover:text-[#1A7A6E]'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-2xl border border-[#E8EFEF] bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition shadow-2xs"
          >
            {availableReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Security & Privacy Reassurance */}
        <div className="flex items-start gap-2.5 rounded-2xl bg-[#E8F6F4]/60 p-3.5 text-xs text-[#1A7A6E] border border-[#C5ECE5] shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-[#1A7A6E] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong className="font-bold">Patient Controlled:</strong> You will review and approve each individual record before generating the consultation QR pass.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 space-y-2">
          <PrimaryButton
            type="submit"
            fullWidth
            size="lg"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Get Record Suggestions
          </PrimaryButton>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            Cancel and Return
          </button>
        </div>
      </form>
    </div>
  );
};
