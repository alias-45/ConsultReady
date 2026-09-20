import React, { useEffect } from 'react';
import {
  Clock,
  ShieldCheck,
  Smartphone,
  Radio,
  Sparkles,
  ArrowRight,
  User,
  Stethoscope,
  XCircle
} from 'lucide-react';
import { ConsultationSession } from '../../types';
import { useSessionStore } from '../../store/sessionStore';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';

interface WaitingApprovalProps {
  session: ConsultationSession;
  onApproved: () => void;
  onCancel: () => void;
  onSwitchToPatientView: () => void;
}

export const WaitingApproval: React.FC<WaitingApprovalProps> = ({
  session,
  onApproved,
  onCancel,
  onSwitchToPatientView
}) => {
  const getSession = useSessionStore((state) => state.getSession);
  const acceptAccessRequest = useSessionStore((state) => state.acceptAccessRequest);

  // Reactive poll/listener on the session status: if patient accepted, transition immediately!
  const currentSession = getSession(session.id) || session;

  useEffect(() => {
    if (currentSession.status === 'active') {
      onApproved();
    }
  }, [currentSession.status, onApproved]);

  const handleInstantDemoApprove = () => {
    acceptAccessRequest(session.id);
    onApproved();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto animate-in fade-in duration-300">
      {/* Animated Pulsing Beacon */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full bg-[#1A7A6E]/15 animate-ping" />
        <div className="absolute h-20 w-20 rounded-full bg-[#1A7A6E]/25 animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1A7A6E] text-white shadow-xl shadow-[#1A7A6E]/30">
          <Radio className="h-8 w-8 animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 text-center">
        Request Dispatched
      </h2>
      <p className="mt-1 text-xs text-slate-500 text-center max-w-xs leading-relaxed">
        Waiting for <strong className="text-slate-900 font-bold">{session.patientName}</strong> to review and confirm permission on their device.
      </p>

      {/* Details Box */}
      <div className="mt-6 w-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-3.5 text-left">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Request Status
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/80 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Awaiting Patient Consent</span>
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Patient:</span>
            <span className="font-bold text-slate-900">{session.patientName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Purpose:</span>
            <span className="font-semibold text-slate-800">
              {session.specialty} • {session.reason}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Authorized Scope:</span>
            <span className="font-bold text-[#1A7A6E]">
              {session.selectedRecordIds.length} Medical Records
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Requester:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[200px]">
              {session.requesterName || 'Consulting Physician'}
            </span>
          </div>
        </div>

        {/* Live helper message */}
        <div className="mt-2 rounded-2xl bg-[#E8F6F4]/60 p-3.5 text-xs text-[#1A7A6E] border border-[#C5ECE5] flex items-start gap-2.5 shadow-2xs">
          <Smartphone className="h-4 w-4 text-[#1A7A6E] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            The patient has received an interactive prompt on their phone to review and claim acceptance.
          </p>
        </div>
      </div>

      {/* Demonstration & Instant Approval Actions */}
      <div className="mt-6 w-full space-y-2.5">
        {/* Instant 1-Click Simulation Button */}
        <PrimaryButton
          onClick={handleInstantDemoApprove}
          fullWidth
          size="lg"
          icon={<Sparkles className="h-4 w-4" />}
          variant="primary"
        >
          Claim Acceptance as Patient (Instant Demo)
        </PrimaryButton>

        <SecondaryButton
          onClick={onSwitchToPatientView}
          fullWidth
          size="md"
          icon={<Smartphone className="h-4 w-4" />}
        >
          Switch to Patient Screen to Accept
        </SecondaryButton>

        <div className="text-center pt-1">
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
          >
            Cancel Request & Return to Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
