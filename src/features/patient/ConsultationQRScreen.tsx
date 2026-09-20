import React from 'react';
import { ArrowLeft, Plus, CheckCircle2, ShieldCheck, AlertOctagon } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { QRCard } from '../../components/common/QRCard';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { StatusBadge } from '../../components/common/StatusBadge';

interface ConsultationQRScreenProps {
  onBackToRecords: () => void;
  onSimulateDoctorScan: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ConsultationQRScreen: React.FC<ConsultationQRScreenProps> = ({
  onBackToRecords,
  onSimulateDoctorScan,
  onShowToast
}) => {
  const currentSessionId = useSessionStore((state) => state.currentSessionId);
  const getSession = useSessionStore((state) => state.getSession);
  const revokeAccess = useSessionStore((state) => state.revokeAccess);
  const fastForwardSession = useSessionStore((state) => state.fastForwardSession);

  const session = currentSessionId ? getSession(currentSessionId) : undefined;

  const handleRevoke = () => {
    if (!currentSessionId) return;
    revokeAccess(currentSessionId);
    onShowToast('Access Revoked', 'Doctor will no longer be able to access these records.', 'warning');
  };

  const handleFastForward = (mins: number) => {
    if (!currentSessionId) return;
    fastForwardSession(currentSessionId, mins);
    onShowToast('Time Fast-Forwarded', 'Simulated 24-hour expiration.', 'info');
  };

  if (!session) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-slate-500">No active consultation QR found.</p>
        <SecondaryButton onClick={onBackToRecords} className="mt-4">
          Return to My Records
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 max-w-md mx-auto pb-24 sm:pb-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBackToRecords}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition active:scale-95 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>My Records</span>
          </button>
          <StatusBadge status={session.status} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Consultation QR
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Present this secure QR code to your doctor or intake staff.
        </p>
      </div>

      {/* QR Card with session metadata, download, and share */}
      <QRCard
        session={session}
        onSimulateDoctorScan={onSimulateDoctorScan}
        onRevokeAccess={handleRevoke}
        onFastForwardTime={handleFastForward}
        onAcceptRequest={() => {
          onShowToast('Access Granted', 'Healthcare provider can now view your authorized records.', 'success');
        }}
      />

      {/* Done button */}
      <div className="mt-6 text-center">
        <button
          onClick={onBackToRecords}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition py-2 px-4 rounded-xl hover:bg-slate-100"
        >
          Done, return to My Records
        </button>
      </div>
    </div>
  );
};
