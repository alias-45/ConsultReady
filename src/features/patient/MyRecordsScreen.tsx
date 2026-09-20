import React, { useState } from 'react';
import { Search, Plus, Filter, Sparkles, FolderPlus, ArrowRight } from 'lucide-react';
import { MedicalRecord, RecordFilter } from '../../types';
import { useRecordsStore } from '../../store/recordsStore';
import { RecordCard } from '../../components/common/RecordCard';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { EmptyState } from '../../components/common/EmptyState';
import { UploadRecordModal } from '../../components/patient/UploadRecordModal';

interface MyRecordsScreenProps {
  onViewRecord: (record: MedicalRecord) => void;
  onCreateConsultation: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

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
    <div className="flex flex-col min-h-full pb-20 sm:pb-6">
      {/* Action Header & Quick Consultation CTA */}
      <div className="p-4 sm:p-5 bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              My Records
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Manage your personal medical history & diagnostic files
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 shadow-2xs ${
                showSearchInput || searchQuery
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-slate-200/90 text-slate-600 hover:bg-slate-50'
              }`}
              aria-label="Search records"
            >
              <Search className="h-4 w-4" />
            </button>

            <PrimaryButton
              onClick={() => setIsUploadOpen(true)}
              size="sm"
              icon={<Plus className="h-4 w-4" />}
            >
              Upload
            </PrimaryButton>
          </div>
        </div>

        {/* Search Bar Collapsible */}
        {showSearchInput && (
          <div className="mt-3.5 relative animate-in fade-in duration-150">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, imaging, medications, or clinics..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-14 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
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

        {/* Category Filter Chips */}
        <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Consultation Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 border-b border-blue-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20 shrink-0">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Visiting a Doctor Soon?
              </h4>
              <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                Generate a 24-hour temporary consultation pass with relevant records.
              </p>
            </div>
          </div>

          <button
            onClick={onCreateConsultation}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95 shadow-sm"
          >
            <span>Create Bundle</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="p-4 sm:p-5 space-y-3 flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {activeFilter} Records ({filteredRecords.length})
          </span>
          <span className="text-[11px] font-medium text-slate-400">Tap record to preview</span>
        </div>

        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No Records Found"
            description={
              searchQuery
                ? `No records match your query "${searchQuery}". Try clearing filters or searching another keyword.`
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

      {/* Upload Record Modal */}
      <UploadRecordModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};
