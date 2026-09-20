import React from 'react';
import { User, ShieldCheck, Clock, Key, RotateCcw, Stethoscope, ChevronRight, AlertTriangle, Sparkles, QrCode } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSessionStore } from '../../store/sessionStore';
import { useRecordsStore } from '../../store/recordsStore';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SecondaryButton } from '../../components/common/SecondaryButton';

interface PatientProfileScreenProps {
  onSwitchToDoctor: () => void;
  onOpenSessionQR: (sessionId: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  onSwitchToDoctor,
  onOpenSessionQR,
  onShowToast
}) => {
  const patient = useAuthStore((state) => state.patient);
  const sessions = useSessionStore((state) => state.sessions);
  const revokeAccess = useSessionStore((state) => state.revokeAccess);
  const resetDefaultRecords = useRecordsStore((state) => state.resetDefaultRecords);

  const sessionList = Object.values(sessions);

  const handleRevoke = (id: string) => {
    revokeAccess(id);
    onShowToast('Session Revoked', `Session ${id} has been revoked.`, 'warning');
  };

  const handleResetData = () => {
    resetDefaultRecords();
    onShowToast('Data Reset', 'Records reset to default demo catalog.', 'info');
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 max-w-lg mx-auto pb-24 space-y-5 animate-in fade-in duration-200">
      {/* Profile Header */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl shadow-md shadow-blue-500/20">
            {patient.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {patient.name}
            </h2>
            <p className="text-xs font-medium text-slate-500">{patient.email}</p>
            <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>{patient.age} yrs</span>
              <span className="text-slate-300">•</span>
              <span>{patient.gender}</span>
              <span className="text-slate-300">•</span>
              <span className="rounded-full bg-rose-50 border border-rose-200/60 px-2 py-0.5 text-rose-700 font-bold text-[11px]">
                {patient.bloodGroup}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sharing History & Active Sessions */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Consultation Access Passes
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {sessionList.length} Sessions
          </span>
        </div>

        {sessionList.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No consultation sessions created yet.
          </p>
        ) : (
          <div className="space-y-3">
            {sessionList.map((sess) => (
              <div
                key={sess.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4 hover:bg-slate-50 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 truncate">
                      {sess.id}
                    </span>
                    <StatusBadge status={sess.status} size="sm" />
                  </div>
                  <p className="mt-1 text-xs text-slate-600 font-medium">
                    {sess.specialty} • {sess.reason} ({sess.selectedRecordIds.length} records)
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {sess.status !== 'revoked' && sess.status !== 'expired' && (
                    <>
                      <button
                        onClick={() => onOpenSessionQR(sess.id)}
                        className="rounded-xl bg-white border border-slate-200/90 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition active:scale-95 shadow-2xs"
                      >
                        QR
                      </button>
                      <button
                        onClick={() => handleRevoke(sess.id)}
                        className="rounded-xl bg-white border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition active:scale-95"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Portal Quick Link */}
      <div className="rounded-3xl border border-blue-200/80 bg-blue-50/60 p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shrink-0">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">
              Healthcare Provider & Scanner Portal
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Experience the clinician flow: Scan patient QR codes and request instant, time-limited access with zero login required.
            </p>
            <button
              onClick={onSwitchToDoctor}
              className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition active:scale-95 bg-white border border-blue-200 px-3 py-1.5 rounded-xl shadow-2xs"
            >
              <span>Launch Clinical Scanner</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Demo Data */}
      <div className="text-center pt-2">
        <SecondaryButton
          onClick={handleResetData}
          size="sm"
          icon={<RotateCcw className="h-3.5 w-3.5" />}
        >
          Reset Demo Data to Initial State
        </SecondaryButton>
      </div>
    </div>
  );
};
