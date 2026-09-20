import React from 'react';
import {
  BellRing,
  ShieldCheck,
  Stethoscope,
  Clock,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  Building2,
  Lock
} from 'lucide-react';
import { ConsultationSession, MedicalRecord } from '../../types';
import { useSessionStore } from '../../store/sessionStore';
import { useRecordsStore } from '../../store/recordsStore';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

interface IncomingAccessRequestModalProps {
  onAcceptSuccess?: (session: ConsultationSession) => void;
  onDeclineSuccess?: () => void;
}

export const IncomingAccessRequestModal: React.FC<IncomingAccessRequestModalProps> = ({
  onAcceptSuccess,
  onDeclineSuccess
}) => {
  const sessions = useSessionStore((state) => state.sessions);
  const acceptAccessRequest = useSessionStore((state) => state.acceptAccessRequest);
  const denyAccessRequest = useSessionStore((state) => state.denyAccessRequest);
  const getRecordById = useRecordsStore((state) => state.getRecordById);

  // Find any session that is in 'requested' state
  const requestedSession = Object.values(sessions).find((s) => s.status === 'requested');

  if (!requestedSession) return null;

  const handleAccept = () => {
    const res = acceptAccessRequest(requestedSession.id);
    if (res.success && res.session) {
      onAcceptSuccess?.(res.session);
    }
  };

  const handleDecline = () => {
    denyAccessRequest(requestedSession.id);
    onDeclineSuccess?.();
  };

  const authorizedRecords = requestedSession.selectedRecordIds
    .map((id) => getRecordById(id))
    .filter((r): r is MedicalRecord => r !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl shadow-slate-900/25 animate-in zoom-in-95 duration-200">
        {/* Top Header Badge */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 shrink-0">
            <BellRing className="h-6 w-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
              Action Required • Patient Consent
            </span>
            <h3 className="text-lg font-black tracking-tight text-slate-900 leading-snug mt-1">
              Incoming Access Request
            </h3>
          </div>
        </div>

        {/* Requester Identity Card */}
        <div className="mt-4 rounded-2xl bg-blue-50/80 p-4 border border-blue-200/70 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Doctor / Healthcare Provider
          </span>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {requestedSession.requesterName || 'Consulting Physician'}
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                {requestedSession.requesterRole || 'Medical Provider • Specialist'}
              </p>
            </div>
          </div>
        </div>

        {/* Scope of Request */}
        <div className="mt-4 space-y-3 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-medium text-slate-500">Consultation Focus:</span>
            <span className="font-bold text-slate-900">
              {requestedSession.specialty} • {requestedSession.reason}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-medium text-slate-500">Access Duration:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>24 Hours (Read-Only)</span>
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between font-medium text-slate-500 mb-1.5">
              <span>Records to be Disclosed:</span>
              <span className="font-bold text-blue-600">
                {authorizedRecords.length} records
              </span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1.5 rounded-2xl bg-slate-50/90 p-2.5 border border-slate-200/80">
              {authorizedRecords.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">
                    {rec.title}
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                    {rec.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-4 rounded-2xl bg-slate-50/90 p-3 text-[11px] text-slate-600 border border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
          <Lock className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="leading-relaxed">
            Doctor cannot download or alter your files. You can revoke access at any time.
          </span>
        </div>

        {/* Decision Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <SecondaryButton
            onClick={handleDecline}
            size="md"
            icon={<XCircle className="h-4 w-4" />}
          >
            Decline
          </SecondaryButton>

          <PrimaryButton
            onClick={handleAccept}
            size="md"
            variant="primary"
            icon={<CheckCircle2 className="h-4 w-4" />}
          >
            Accept & Grant
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
