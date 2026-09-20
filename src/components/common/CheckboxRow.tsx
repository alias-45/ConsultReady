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
          ? 'border-blue-500 bg-blue-50/40 shadow-sm shadow-blue-500/10'
          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="pt-0.5">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-all duration-200 ${
              isChecked
                ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                : 'border-slate-300 bg-white group-hover:border-blue-400'
            }`}
          >
            {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </div>
        </div>

        <RecordIcon type={record.type} title={record.title} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <h4
              className={`text-sm font-bold tracking-tight transition-colors ${
                isChecked ? 'text-blue-950' : 'text-slate-900'
              }`}
            >
              {record.title}
            </h4>
            {priority && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  priority === 'high'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                    : 'bg-blue-50 text-blue-700 border border-blue-200/70'
                }`}
              >
                {priority === 'high' && <Sparkles className="h-2.5 w-2.5" />}
                <span>{priority === 'high' ? 'High Relevance' : 'Recommended'}</span>
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{record.type}</span>
            <span className="text-slate-300">•</span>
            <span>{record.date}</span>
            <span className="text-slate-300">•</span>
            <span className="truncate max-w-[140px] text-slate-400">{record.provider}</span>
          </div>

          {reason && (
            <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-white/90 p-2.5 text-xs text-slate-700 border border-blue-100 shadow-2xs">
              <HelpCircle className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
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
