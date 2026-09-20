import React, { useState } from 'react';
import { ShieldCheck, QrCode, ArrowLeft, Edit3, Lock, AlertTriangle } from 'lucide-react';
import { useConsultationStore } from '../../store/consultationStore';
import { useRecordsStore } from '../../store/recordsStore';
import { useSessionStore } from '../../store/sessionStore';
import { useAuthStore } from '../../store/authStore';
import { RecordCard } from '../../components/common/RecordCard';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

interface ReviewApproveScreenProps {
  onQrGenerated: () => void;
  onEdit: () => void;
  onBack: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReviewApproveScreen: React.FC<ReviewApproveScreenProps> = ({
  onQrGenerated,
  onEdit,
  onBack,
  onShowToast
}) => {
  const { specialty, reason, selectedRecordIds, toggleRecord } = useConsultationStore();
  const getRecordById = useRecordsStore((state) => state.getRecordById);
  const patient = useAuthStore((state) => state.patient);
  const createPatientSession = useSessionStore((state) => state.createPatientSession);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedRecords = selectedRecordIds
    .map((id) => getRecordById(id))
    .filter(Boolean);

  const handleGenerateConfirm = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Create session in session store with opaque session ID
      const session = createPatientSession(patient, specialty, reason, selectedRecordIds);
      setIsGenerating(false);
      setShowConfirmDialog(false);
      onShowToast('QR Generated', `Session ${session.id} is ready for doctor scanning.`, 'success');
      onQrGenerated();
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 max-w-lg mx-auto pb-24 sm:pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A7A6E] bg-[#E8F6F4] border border-[#C5ECE5] px-3 py-1 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1A7A6E]" />
            <span>Step 3 of 3 • Final Verification</span>
          </span>

          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1A7A6E] hover:text-[#14655B] transition active:scale-95 bg-white border border-[#E8EFEF] rounded-xl px-2.5 py-1 shadow-2xs"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Bundle</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Review & Approve
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Confirm the specific records to grant temporary, time-bound access to.
        </p>
      </div>

      {/* Summary Card */}
      <div className="mb-5 rounded-3xl border border-[#E8EFEF] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Selected Records
            </span>
            <h3 className="text-xl font-black text-[#1A7A6E] mt-0.5">
              {selectedRecordIds.length} records selected
            </h3>
          </div>
          <span className="rounded-full bg-[#E8F6F4] px-3 py-1 text-xs font-bold text-[#1A7A6E] border border-[#C5ECE5]">
            View-Only
          </span>
        </div>

        <div className="mt-3.5 flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs text-slate-600">
          <span className="font-medium text-slate-500 shrink-0">Consultation Scope:</span>
          <span className="font-bold text-slate-900 truncate">
            {specialty} • {reason}
          </span>
        </div>
      </div>

      {/* Record Cards with selection toggles */}
      <div className="space-y-3 flex-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
          Included In This Access Token
        </span>

        {selectedRecords.map((record) => {
          if (!record) return null;
          return (
            <RecordCard
              key={record.id}
              record={record}
              selectable={true}
              isSelected={selectedRecordIds.includes(record.id)}
              onToggleSelect={() => toggleRecord(record.id)}
              showViewOnlyBadge={true}
            />
          );
        })}
      </div>

      {/* Security Note */}
      <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 p-4 text-xs text-slate-600 shadow-2xs">
        <Lock className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Access will be strictly time-limited to 24 hours. The doctor cannot download raw records or edit your files, and you can revoke access at any time.
        </p>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 mt-6 pt-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent flex items-center justify-between gap-3 border-t border-slate-200/80 z-10">
        <SecondaryButton onClick={onBack} size="md">
          Back
        </SecondaryButton>

        <PrimaryButton
          onClick={() => setShowConfirmDialog(true)}
          disabled={selectedRecordIds.length === 0}
          size="lg"
          icon={<QrCode className="h-5 w-5" />}
          className="flex-1 sm:flex-initial sm:min-w-[190px]"
        >
          Generate QR Code
        </PrimaryButton>
      </div>

      {/* Prompt Requirement: Confirmation Dialog before QR generation */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        title="Approve Medical Record Sharing"
        description={`You are about to share ${selectedRecordIds.length} records with a ${specialty} consultation.`}
        warningNote="Access will be temporary and view-only for 24 hours. You can revoke access immediately at any moment."
        confirmLabel="Generate QR"
        cancelLabel="Cancel"
        isConfirming={isGenerating}
        onConfirm={handleGenerateConfirm}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
};
