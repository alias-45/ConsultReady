import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Stethoscope,
  Clock,
  Eye,
  Download,
  PowerOff,
  AlertOctagon,
  Lock,
  FileText
} from 'lucide-react';
import { MedicalRecord, ConsultationSession } from '../../types';
import { useSessionStore } from '../../store/sessionStore';
import { useRecordsStore } from '../../store/recordsStore';
import { TimerCard } from '../../components/common/TimerCard';
import { RecordCard } from '../../components/common/RecordCard';
import { RecordViewerModal } from '../../components/common/RecordViewerModal';
import { ErrorState } from '../../components/common/ErrorState';

interface DoctorRecordsScreenProps {
  sessionId: string;
  onEndSession: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const DoctorRecordsScreen: React.FC<DoctorRecordsScreenProps> = ({
  sessionId,
  onEndSession,
  onShowToast
}) => {
  const getSession = useSessionStore((state) => state.getSession);
  const endDoctorSession = useSessionStore((state) => state.endDoctorSession);
  const expireSession = useSessionStore((state) => state.expireSession);
  const checkSessionStatus = useSessionStore((state) => state.checkSessionStatus);
  const fastForwardSession = useSessionStore((state) => state.fastForwardSession);
  const getRecordById = useRecordsStore((state) => state.getRecordById);

  const [activeViewingRecord, setActiveViewingRecord] = useState<MedicalRecord | null>(null);

  const session = getSession(sessionId);
  const statusCheck = checkSessionStatus(sessionId);

  // If session is revoked by patient or expired
  if (!session || !statusCheck.valid) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <ErrorState
          title={
            statusCheck.status === 'revoked'
              ? 'Access Revoked by Patient'
              : 'Consultation Session Expired'
          }
          message={
            statusCheck.status === 'revoked'
              ? 'The patient has revoked authorization for this consultation. All clinical records have been locked.'
              : 'The authorized 24-hour time limit for this session has reached zero. Records are no longer accessible.'
          }
          errorType={statusCheck.status === 'revoked' ? 'revoked' : 'expired'}
          backLabel="Return to Scanner"
          onBack={onEndSession}
        />
      </div>
    );
  }

  // Security Rule: ONLY records authorized by patient can appear
  const authorizedRecords = session.selectedRecordIds
    .map((id) => getRecordById(id))
    .filter((r): r is MedicalRecord => r !== undefined);

  const handleEndSession = () => {
    endDoctorSession(sessionId);
    onShowToast('Session Ended', 'Consultation records closed and session archived.', 'info');
    onEndSession();
  };

  const handleSessionExpired = () => {
    expireSession(sessionId);
    onShowToast('Session Expired', 'Session reached its time limit and has expired.', 'warning');
  };

  const handleFastForward = (mins: number) => {
    fastForwardSession(sessionId, mins);
    onShowToast('Simulating Expiry', 'Fast-forwarded countdown to test expiration.', 'info');
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 max-w-xl mx-auto pb-24 space-y-5 animate-in fade-in duration-200">
      {/* Patient Profile Header Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden bg-[#E8F6F4] text-[#1A7A6E] font-black text-lg border border-[#C5ECE5] shrink-0 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80"
                alt={session.patientName}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                Patient Records
              </span>
              <h2 className="text-base sm:text-xl font-black tracking-tight text-slate-900 truncate">
                {session.patientName}
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {session.patientAge} Years • {session.patientGender}
              </p>
            </div>
          </div>

          <div className="text-left xs:text-right shrink-0">
            <span className="inline-block rounded-full bg-[#E8F6F4] px-3 py-1 text-xs font-bold text-[#1A7A6E] border border-[#C5ECE5] shadow-2xs">
              {session.specialty}
            </span>
            <span className="block text-xs text-slate-600 font-semibold mt-1">
              {session.reason}
            </span>
          </div>
        </div>

        {/* Read-only Doctor Notice */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            <span>Doctor access is strictly read-only</span>
          </span>
          <span className="font-bold text-[#1A7A6E]">
            {authorizedRecords.length} records authorized
          </span>
        </div>
      </div>

      {/* Active Session Live Timer & Countdown Card */}
      <TimerCard
        session={session}
        onEndSession={handleEndSession}
        onSessionExpired={handleSessionExpired}
        onFastForward={handleFastForward}
      />

      {/* Records List (Only patient-selected records appear) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Authorized Medical Records ({authorizedRecords.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Tap to open clinical viewer
          </span>
        </div>

        {authorizedRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onView={() => setActiveViewingRecord(record)}
            showViewOnlyBadge={true}
          />
        ))}
      </div>

      {/* Record Viewer Modal */}
      <RecordViewerModal
        record={activeViewingRecord}
        isOpen={Boolean(activeViewingRecord)}
        onClose={() => setActiveViewingRecord(null)}
        isDoctorView={true}
      />
    </div>
  );
};
