import React from 'react';
import { AlertCircle, ShieldAlert, X } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  warningNote?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'success' | 'danger';
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  warningNote,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  isConfirming = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
            <ShieldAlert className="h-6 w-6 stroke-[2.2]" />
          </div>
          <button
            onClick={onCancel}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-black tracking-tight text-slate-900">{title}</h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">{description}</p>
          {warningNote && (
            <div className="mt-3.5 flex items-center gap-2 rounded-2xl bg-amber-50/80 p-3.5 text-xs font-semibold text-amber-900 border border-amber-200/80 shadow-2xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{warningNote}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <SecondaryButton onClick={onCancel} disabled={isConfirming} fullWidth className="sm:w-auto">
            {cancelLabel}
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            isLoading={isConfirming}
            variant={confirmVariant}
            fullWidth
            className="sm:w-auto"
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
