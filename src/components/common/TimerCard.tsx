import React, { useEffect, useState } from 'react';
import { Clock, ShieldAlert, AlertTriangle, PowerOff, ShieldCheck, Sparkles } from 'lucide-react';
import { ConsultationSession } from '../../types';
import { formatRemainingTime } from '../../services/qrService';
import { VALID_SESSION_DURATION_MS } from '../../constants';
import { StatusBadge } from './StatusBadge';
import { PrimaryButton } from './PrimaryButton';

interface TimerCardProps {
  session: ConsultationSession;
  onEndSession: () => void;
  onSessionExpired: () => void;
  onFastForward?: (minutes: number) => void;
}

export const TimerCard: React.FC<TimerCardProps> = ({
  session,
  onEndSession,
  onSessionExpired,
  onFastForward
}) => {
  const [remainingMs, setRemainingMs] = useState<number>(() => {
    const expires = new Date(session.expiresAt).getTime();
    return Math.max(0, expires - Date.now());
  });

  useEffect(() => {
    const updateCountdown = () => {
      const expires = new Date(session.expiresAt).getTime();
      const diff = expires - Date.now();
      if (diff <= 0) {
        setRemainingMs(0);
        onSessionExpired();
      } else {
        setRemainingMs(diff);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [session.expiresAt, onSessionExpired]);

  const { hours, minutes, seconds, isExpired } = formatRemainingTime(remainingMs);
  
  // Progress percentage (0% = expired, 100% = just created 24hr)
  const totalDuration = VALID_SESSION_DURATION_MS;
  const progressPercent = Math.min(100, Math.max(0, (remainingMs / totalDuration) * 100));

  return (
    <div className="w-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Consultation Session
          </span>
        </div>
        <StatusBadge status={session.status} />
      </div>

      {/* Large Live Countdown Display */}
      <div className="my-5 flex flex-col items-center justify-center">
        <div className="flex items-baseline gap-1 font-mono tracking-tight text-slate-900">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{hours}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Hours</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-slate-300 mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{minutes}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Mins</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-slate-300 mx-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black text-blue-600">{seconds}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Secs</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              progressPercent < 15
                ? 'bg-rose-500'
                : progressPercent < 35
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="mt-2.5 text-xs font-semibold text-slate-600">
          {session.selectedRecordIds.length} records • <span className="text-blue-600">Encrypted view-only</span>
        </p>
      </div>

      {/* Security note & info */}
      <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-slate-50/80 p-3 text-xs text-slate-600 border border-slate-200/70">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Access is strictly temporary. Patient can revoke immediately at any moment. Zero download or copy privileges are granted.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <PrimaryButton
          onClick={onEndSession}
          variant="danger"
          size="md"
          fullWidth
          icon={<PowerOff className="h-4 w-4" />}
        >
          End Session Now
        </PrimaryButton>

        {onFastForward && (
          <button
            onClick={() => onFastForward(1440)}
            className="rounded-2xl border border-slate-200/90 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition active:scale-95"
            title="Simulate timer reaching zero"
          >
            Expire Now (Demo)
          </button>
        )}
      </div>
    </div>
  );
};
