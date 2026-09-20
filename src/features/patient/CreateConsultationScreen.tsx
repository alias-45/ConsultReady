import React, { useState } from 'react';
import { Stethoscope, FileQuestion, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SPECIALTIES, REASONS_BY_SPECIALTY } from '../../constants';
import { useConsultationStore } from '../../store/consultationStore';
import { useRecordsStore } from '../../store/recordsStore';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { LoadingState } from '../../components/common/LoadingState';

interface CreateConsultationScreenProps {
  onSuggestionsReady: () => void;
  onCancel: () => void;
}

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
      <div className="mb-6 text-left">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50/90 border border-blue-200/60 px-3 py-1 rounded-full mb-3 w-fit">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Step 1 of 3 • Specialty & Purpose</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Create Consultation
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          Specify your appointment details so our deterministic clinical engine matches only the records relevant to your visit.
        </p>
      </div>

      <form onSubmit={handleGetSuggestions} className="space-y-4">
        {error && (
          <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 border border-rose-200 shadow-2xs">
            {error}
          </div>
        )}

        {/* Doctor Specialty Select */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <span>Doctor’s Specialty</span>
          </label>
          <select
            value={specialty}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
          >
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 mt-2 block">
            e.g., Cardiology, Pulmonology, Orthopedics, General Medicine
          </span>
        </div>

        {/* Reason for Visit Select */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
            <FileQuestion className="h-4 w-4 text-indigo-600" />
            <span>Reason for Visit</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
          >
            {availableReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Select the primary condition or chief complaint
          </span>
        </div>

        {/* Security & Privacy Reassurance */}
        <div className="flex items-start gap-2.5 rounded-2xl bg-blue-50/80 p-3.5 text-xs text-blue-900 border border-blue-200/70 shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Patient Privacy Shield:</strong> You will review, customize, and approve every record before generating the consultation QR.
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
