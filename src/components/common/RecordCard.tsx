import React, { useState } from 'react';
import { MoreVertical, Eye, Trash2, ShieldCheck, Download, FileText } from 'lucide-react';
import { MedicalRecord } from '../../types';
import { RecordIcon } from './RecordIcon';

interface RecordCardProps {
  record: MedicalRecord;
  isSelected?: boolean;
  selectable?: boolean;
  onToggleSelect?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  showViewOnlyBadge?: boolean;
}

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  isSelected = false,
  selectable = false,
  onToggleSelect,
  onView,
  onDelete,
  showViewOnlyBadge = false
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      id={`record-card-${record.id}`}
      onClick={selectable ? onToggleSelect : onView}
      className={`group relative flex items-center justify-between gap-3 rounded-2xl border bg-white p-3.5 sm:p-4 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#1A7A6E] bg-[#E8F6F4]/35 shadow-sm shadow-[#1A7A6E]/10'
          : 'border-slate-200/80 hover:border-[#1A7A6E]/40 hover:shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {selectable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            onClick={(e) => e.stopPropagation()}
            className="h-4.5 w-4.5 rounded-md border-slate-300 text-[#1A7A6E] focus:ring-[#1A7A6E] cursor-pointer shrink-0 accent-[#1A7A6E]"
            aria-label={`Select ${record.title}`}
          />
        )}

        <RecordIcon type={record.type} title={record.title} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="truncate text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#1A7A6E] transition-colors">
              {record.title}
            </h4>
            {record.isUploaded && (
              <span className="rounded-full bg-[#E8F6F4] border border-[#C5ECE5] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#1A7A6E] shrink-0">
                Uploaded
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-500">
            <span className="font-semibold text-slate-700 whitespace-nowrap">{record.type}</span>
            <span className="text-slate-300">•</span>
            <span className="whitespace-nowrap">{record.date}</span>
            {record.provider && (
              <>
                <span className="text-slate-300 hidden md:inline">•</span>
                <span className="truncate text-slate-400 hidden md:inline max-w-[130px]">
                  {record.provider}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        {showViewOnlyBadge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span className="hidden xs:inline">Read-only</span>
          </span>
        )}

        {onView && (
          <button
            onClick={onView}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-[#E8F6F4] hover:text-[#1A7A6E] transition-all active:scale-95"
            title="View medical document"
            aria-label={`View ${record.title}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        )}

        {!selectable && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-150">
                  {onView && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onView();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-500" />
                      <span>View Record</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (onView) onView();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>Download Copy</span>
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Record</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
