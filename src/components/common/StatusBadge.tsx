import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Radio } from 'lucide-react';
import { SessionStatus } from '../../types';

interface StatusBadgeProps {
  status: SessionStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md'
}) => {
  const configs = {
    pending: {
      bg: 'bg-amber-50/90',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      dotColor: 'bg-amber-500',
      pulse: true,
      icon: Clock,
      defaultLabel: 'Ready to Scan'
    },
    requested: {
      bg: 'bg-blue-50/90',
      text: 'text-blue-800',
      border: 'border-blue-200/80',
      dotColor: 'bg-blue-600',
      pulse: true,
      icon: Clock,
      defaultLabel: 'Awaiting Patient Consent'
    },
    active: {
      bg: 'bg-emerald-50/90',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      dotColor: 'bg-emerald-500',
      pulse: true,
      icon: CheckCircle2,
      defaultLabel: 'Active Consultation'
    },
    expired: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      dotColor: 'bg-slate-400',
      pulse: false,
      icon: AlertTriangle,
      defaultLabel: 'Expired'
    },
    revoked: {
      bg: 'bg-rose-50/90',
      text: 'text-rose-800',
      border: 'border-rose-200/80',
      dotColor: 'bg-rose-500',
      pulse: false,
      icon: XCircle,
      defaultLabel: 'Revoked'
    },
    denied: {
      bg: 'bg-rose-50/90',
      text: 'text-rose-800',
      border: 'border-rose-200/80',
      dotColor: 'bg-rose-500',
      pulse: false,
      icon: XCircle,
      defaultLabel: 'Declined'
    }
  };

  const current = configs[status] || configs.pending;
  const displayText = label || current.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight shadow-2xs transition-all ${
        current.bg
      } ${current.text} ${current.border} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <span className="relative flex h-2 w-2">
        {current.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dotColor}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`}
        />
      </span>
      <span>{displayText}</span>
    </span>
  );
};
