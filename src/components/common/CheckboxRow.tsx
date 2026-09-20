import React from 'react';
import { HelpCircle, Check, Sparkles } from 'lucide-react';
import { MedicalRecord } from '../../types';
import { RecordIcon } from './RecordIcon';

interface CheckboxRowProps {
  record: MedicalRecord;
  isChecked: boolean;
  onToggle: () => void;
  reason?: string;
  priority?: 'high' | 'medium' | 'low';
}

export const CheckboxRow: React.FC<CheckboxRowProps> = ({
  record,
  isChecked,
  onToggle,
  reason,
  priority
}) => {
  return (
    <div
      onClick={onToggle}
      className={`group relative flex flex-col rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 cursor-pointer select-none ${
        isChecked
          ? 'border-[#1A7A6E] bg-[#E8F6F4]/35 shadow-sm shadow-[#1A7A6E]/10'
          : 'border-slate-200/90 bg-white hover:border-[#1A7A6E]/30 hover:bg-slate-50/50 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="pt-0.5">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-all duration-200 ${
              isChecked
                ? 'border-[#1A7A6E] bg-[#1A7A6E] text-white shadow-xs'
                : 'border-slate-300 bg-white group-hover:border-[#1A7A6E]'
            }`}
          >
            {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </div>
        </div>

        <RecordIcon type={record.type} title={record.title} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
            <h4
              className={`text-xs sm:text-sm font-bold tracking-tight transition-colors truncate ${
                isChecked ? 'text-[#1A7A6E]' : 'text-slate-900'
              }`}
            >
              {record.title}
            </h4>
            {priority && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 self-start xs:self-auto ${
                  priority === 'high'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                    : 'bg-[#E8F6F4] text-[#1A7A6E] border border-[#C5ECE5]'
                }`}
              >
                {priority === 'high' && <Sparkles className="h-2.5 w-2.5" />}
                <span>{priority === 'high' ? 'High Relevance' : 'Recommended'}</span>
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{record.type}</span>
            <span className="text-slate-300">•</span>
            <span className="whitespace-nowrap">{record.date}</span>
            {record.provider && (
              <>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="truncate max-w-[130px] text-slate-400 hidden sm:inline">{record.provider}</span>
              </>
            )}
          </div>

          {reason && (
            <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-white/90 p-2.5 text-xs text-slate-700 border border-[#C5ECE5] shadow-2xs">
              <HelpCircle className="h-3.5 w-3.5 text-[#1A7A6E] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1 leading-relaxed">
                <span className="font-semibold text-slate-900">Clinical rationale: </span>
                <span className="text-slate-600">{reason}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
