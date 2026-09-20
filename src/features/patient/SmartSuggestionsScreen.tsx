import React from 'react';
import { Sparkles, CheckSquare, Square, ArrowRight, ShieldCheck } from 'lucide-react';
import { useConsultationStore } from '../../store/consultationStore';
import { CheckboxRow } from '../../components/common/CheckboxRow';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';

interface SmartSuggestionsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const SmartSuggestionsScreen: React.FC<SmartSuggestionsScreenProps> = ({
  onNext,
  onBack
}) => {
  const {
    specialty,
    reason,
    suggestions,
    selectedRecordIds,
    toggleRecord,
    selectAllSuggestions,
    deselectAll
  } = useConsultationStore();

  const allSelected =
    suggestions.length > 0 &&
    suggestions.every((s) => selectedRecordIds.includes(s.recordId));

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 max-w-lg mx-auto pb-24 sm:pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50/90 border border-blue-200/60 px-3 py-1 rounded-full">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span>Step 2 of 3 • Smart Matching</span>
          </span>

          {/* Quick Select All / Deselect All Toggle */}
          <button
            onClick={allSelected ? deselectAll : selectAllSuggestions}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition active:scale-95 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1 shadow-2xs"
          >
            {allSelected ? (
              <>
                <Square className="h-3.5 w-3.5" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Select All ({suggestions.length})</span>
              </>
            )}
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Suggested Records
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Based on <strong className="text-blue-600 font-bold">{specialty}</strong> •{' '}
          <strong className="text-slate-800 font-bold">{reason}</strong>
        </p>
      </div>

      {/* Rationale notification banner */}
      <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-slate-100/90 border border-slate-200/70 p-3.5 text-xs text-slate-700 shadow-2xs">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span className="leading-relaxed">
          Records are pre-selected based on clinical relevance. You can check or uncheck any item to customize the bundle.
        </span>
      </div>

      {/* Suggested Records List with "Why included?" explanations */}
      <div className="space-y-3.5 flex-1">
        {suggestions.map((item) => {
          const isSelected = selectedRecordIds.includes(item.recordId);
          return (
            <CheckboxRow
              key={item.recordId}
              record={item.record}
              isChecked={isSelected}
              onToggle={() => toggleRecord(item.recordId)}
              reason={item.reason}
              priority={item.priority}
            />
          );
        })}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 mt-6 pt-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent flex items-center justify-between gap-3 border-t border-slate-200/80 z-10">
        <SecondaryButton onClick={onBack} size="md">
          Back
        </SecondaryButton>

        <PrimaryButton
          onClick={onNext}
          disabled={selectedRecordIds.length === 0}
          size="md"
          icon={<ArrowRight className="h-4 w-4" />}
          className="flex-1 sm:flex-initial sm:min-w-[170px]"
        >
          Review ({selectedRecordIds.length} Selected)
        </PrimaryButton>
      </div>
    </div>
  );
};
