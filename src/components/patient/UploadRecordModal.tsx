import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { RecordType } from '../../types';
import { useRecordsStore } from '../../store/recordsStore';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (title: string) => void;
}

export const UploadRecordModal: React.FC<UploadRecordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const addRecord = useRecordsStore((state) => state.addRecord);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<RecordType>('Lab Report');
  const [provider, setProvider] = useState('Metro Health Diagnostic Center');
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  });
  const [summary, setSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        // Auto fill title without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a record title.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addRecord({
        title: title.trim(),
        date: date.trim() || 'Today',
        type,
        provider: provider.trim() || 'Independent Clinic',
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
        fileName: selectedFile ? selectedFile.name : `${title.replace(/\s+/g, '_')}.pdf`,
        clinicalSummary: summary.trim() || 'Patient-uploaded health record for consultation sharing.'
      });

      setIsSubmitting(false);
      onSuccess(title.trim());
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900">Upload Medical Record</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Add a report, prescription, or lab result to your personal clinical vault
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 border border-rose-200 shadow-2xs">
              {error}
            </div>
          )}

          {/* Drag & Drop / File Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Medical Document File
            </label>
            <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 hover:border-blue-500 hover:bg-blue-50/20 transition cursor-pointer">
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.png,.jpg,.jpeg,.dicom,.csv,.txt"
                onChange={handleFileChange}
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-2 border border-blue-100">
                <UploadCloud className="h-6 w-6 text-blue-600" />
              </div>
              {selectedFile ? (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-slate-400 font-normal">
                    ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold text-slate-800">
                    Click to select or drag & drop document
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    PDF, DICOM, JPEG, or PNG up to 25MB
                  </span>
                </>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Record Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Thyroid Panel"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Record Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RecordType)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Imaging">Imaging</option>
                <option value="Prescription">Prescription</option>
                <option value="Hospital Record">Hospital Record</option>
                <option value="Vitals / History">Vitals / History</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Facility / Provider
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. City Diagnostics"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Date of Record
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 15 Mar 2024"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Clinical Summary / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of findings or diagnosis..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
            <SecondaryButton type="button" onClick={onClose} size="sm">
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" isLoading={isSubmitting} size="sm">
              Save Record
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
