import React from 'react';
import { ShieldCheck, Clock, FileText, User, Stethoscope, AlertTriangle } from 'lucide-react';
import { ConsultationSession } from '../../types';
import { formatRemainingTime } from '../../services/qrService';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

interface VerifyAccessProps {
  session: ConsultationSession;
  onGrantAccess: () => void;
  onCancel: () => void;
  isGranting?: boolean;
}

export const VerifyAccess: React.FC<VerifyAccessProps> = ({
  session,
  onGrantAccess,
  onCancel,
  isGranting = false
}) => {
  const remainingMs = Math.max(0, new Date(session.expiresAt).getTime() - Date.now());
  const { formatted: countdownFormatted } = formatRemainingTime(remainingMs);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      {/* Verification Shield Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-inner mb-4">
        <ShieldCheck className="h-9 w-9 stroke-[2.2]" />
      </div>

      <h2 className="text-2xl font-black tracking-tight text-slate-900 text-center">
        Verify Access Request
      </h2>
      <p className="mt-1 text-xs text-slate-500 text-center max-w-xs">
        Review the patient’s authorization before establishing this temporary clinical session.
      </p>

      {/* Structured Details Card */}
      <div className="mt-6 w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
        {/* Patient Demographic */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shrink-0 font-bold text-lg">
            {session.patientName.charAt(0)}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Patient
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {session.patientName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {session.patientAge} Years • {session.patientGender}
            </p>
          </div>
        </div>

        {/* Consultation Scope */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">
              Consultation Purpose
            </span>
            <span className="text-sm font-bold text-slate-900">
              {session.specialty} • {session.reason}
            </span>
          </div>
        </div>

        {/* Access Validity */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">
              Access Validity
            </span>
            <span className="text-sm font-bold text-slate-900">
              Valid for {countdownFormatted}
            </span>
          </div>
        </div>

        {/* Selected Records count */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 mt-0.5">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">
              Records Authorized
            </span>
            <span className="text-sm font-bold text-blue-600">
              {session.selectedRecordIds.length} records selected by patient
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="rounded-2xl bg-amber-50/70 p-3 text-xs text-amber-800 border border-amber-200/60 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Read-Only Clinical Session</span>
          </div>
          Access is limited strictly to records selected by {session.patientName}. You cannot edit or modify the patient’s files.
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col gap-2.5">
          <PrimaryButton
            onClick={onGrantAccess}
            isLoading={isGranting}
            fullWidth
            size="lg"
            variant="primary"
            icon={<ShieldCheck className="h-5 w-5" />}
          >
            Grant Access
          </PrimaryButton>

          <SecondaryButton onClick={onCancel} fullWidth size="md">
            Cancel & Return
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
