import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  FileText,
  User,
  Stethoscope,
  Send,
  AlertTriangle,
  Building2,
  Lock
} from 'lucide-react';
import { ConsultationSession } from '../../types';
import { formatRemainingTime } from '../../services/qrService';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

interface RequestAccessProps {
  session: ConsultationSession;
  onRequestAccess: (requesterName: string, requesterRole: string) => void;
  onCancel: () => void;
  isSending?: boolean;
}

export const RequestAccess: React.FC<RequestAccessProps> = ({
  session,
  onRequestAccess,
  onCancel,
  isSending = false
}) => {
  const [requesterName, setRequesterName] = useState('Dr. Sameer Kulkarni');
  const [requesterRole, setRequesterRole] = useState('Cardiology Specialist • Metro Heart Clinic');

  const remainingMs = Math.max(0, new Date(session.expiresAt).getTime() - Date.now());
  const { formatted: countdownFormatted } = formatRemainingTime(remainingMs);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestAccess(requesterName, requesterRole);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Verification Shield Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 mb-4">
        <ShieldCheck className="h-9 w-9 stroke-[2.2]" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 text-center">
        Access Request
      </h2>
      <p className="mt-1 text-xs text-slate-500 text-center max-w-xs leading-relaxed">
        Send a real-time request to the patient. Once approved on their device, their records will unlock instantly.
      </p>

      {/* Structured Patient Overview Card */}
      <div className="mt-5 w-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        {/* Patient Demographic */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shrink-0 font-black text-lg border border-blue-100">
            {session.patientName.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Patient
            </span>
            <h3 className="text-base font-black text-slate-900">
              {session.patientName}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {session.patientAge} Years • {session.patientGender}
            </p>
          </div>
        </div>

        {/* Consultation Scope */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Consultation Purpose
            </span>
            <span className="text-sm font-bold text-slate-900">
              {session.specialty} • {session.reason}
            </span>
          </div>
        </div>

        {/* Access Validity */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Time Window
            </span>
            <span className="text-sm font-bold text-slate-900">
              Valid for {countdownFormatted} after approval
            </span>
          </div>
        </div>

        {/* Selected Records count */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 border border-indigo-100">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Records Pre-Selected
            </span>
            <span className="text-sm font-bold text-blue-600">
              {session.selectedRecordIds.length} medical records authorized
            </span>
          </div>
        </div>

        {/* Scanner Information Input Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-100 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Name / Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="e.g. Dr. Sameer Kulkarni"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-3.5 pr-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
                required
              />
              <User className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Clinic / Specialty Affiliation
            </label>
            <div className="relative">
              <input
                type="text"
                value={requesterRole}
                onChange={(e) => setRequesterRole(e.target.value)}
                placeholder="e.g. Cardiology Specialist • Metro Heart Clinic"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-3.5 pr-8 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none transition shadow-2xs"
                required
              />
              <Building2 className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          {/* Warning Banner */}
          <div className="rounded-2xl bg-amber-50/80 p-3.5 text-xs text-amber-900 border border-amber-200/80 leading-relaxed shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold mb-0.5 text-amber-800">
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>Consent-First Architecture</span>
            </div>
            A notification will be transmitted to {session.patientName}. Records will only unlock after the patient claims acceptance.
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <PrimaryButton
              type="submit"
              isLoading={isSending}
              fullWidth
              size="lg"
              variant="primary"
              icon={<Send className="h-4 w-4" />}
            >
              Send Access Request to Patient
            </PrimaryButton>

            <SecondaryButton onClick={onCancel} fullWidth size="md">
              Cancel & Scan Again
            </SecondaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
