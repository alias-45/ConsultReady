import React, { useEffect, useState } from 'react';
import {
  Download,
  Share2,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Stethoscope,
  FileText,
  Eye,
  RefreshCw,
  BellRing,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ConsultationSession } from '../../types';
import { generateQrDataUrl, downloadQrImage } from '../../services/qrService';
import { useSessionStore } from '../../store/sessionStore';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface QRCardProps {
  session: ConsultationSession;
  onSimulateDoctorScan?: () => void;
  onRevokeAccess?: () => void;
  onFastForwardTime?: (minutes: number) => void;
  onAcceptRequest?: () => void;
}

export const QRCard: React.FC<QRCardProps> = ({
  session,
  onSimulateDoctorScan,
  onRevokeAccess,
  onFastForwardTime,
  onAcceptRequest
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const acceptAccessRequest = useSessionStore((state) => state.acceptAccessRequest);

  useEffect(() => {
    let isMounted = true;
    generateQrDataUrl(session.id).then((url) => {
      if (isMounted) setQrDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [session.id]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(session.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (qrDataUrl) {
      downloadQrImage(qrDataUrl, `ConsultReady_${session.id}.png`);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ConsultReady Medical Access QR',
          text: `Doctor consultation access token for ${session.specialty} (${session.selectedRecordIds.length} records). Session ID: ${session.id}`,
          url: window.location.href
        });
      } else {
        handleCopyId();
      }
    } catch {
      // ignore user cancel
    } finally {
      setIsSharing(false);
    }
  };

  const expiryDate = new Date(session.expiresAt);
  const formattedExpiry = expiryDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex flex-col items-center">
      {/* Outer Card */}
      <div className="w-full max-w-sm rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/60 text-center relative overflow-hidden">
        {/* Subtle top decoration badge */}
        <div className="mx-auto mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/70">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Active • Ready for Provider Scan</span>
        </div>

        {/* Incoming Access Request Banner on the QR card if doctor scanned and requested */}
        {session.status === 'requested' && (
          <div className="mb-4 rounded-2xl bg-amber-50/90 p-4 border border-amber-200 text-left animate-in fade-in duration-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
              <BellRing className="h-4 w-4 text-amber-600 animate-bounce" />
              <span>Incoming Consent Request</span>
            </div>
            <p className="text-xs text-amber-800 leading-snug">
              <strong>{session.requesterName || 'Doctor'}</strong> ({session.requesterRole || 'Clinician'}) is requesting to unlock your records.
            </p>
            <button
              onClick={() => {
                acceptAccessRequest(session.id);
                onAcceptRequest?.();
              }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Accept & Unlock Records Now</span>
            </button>
          </div>
        )}

        {/* QR container with high-tech corner brackets */}
        <div className="relative mx-auto flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm">
          {/* 4 corner alignment markers */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#1A7A6E] rounded-tl-sm pointer-events-none" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#1A7A6E] rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#1A7A6E] rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#1A7A6E] rounded-br-sm pointer-events-none" />

          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Consultation QR Code"
              className="h-full w-full object-contain rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin text-[#1A7A6E] mb-2" />
              <span className="text-xs font-medium">Generating encrypted token...</span>
            </div>
          )}
        </div>

        {/* Session ID Token display (Opaque token) */}
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 border border-slate-200/70 max-w-full">
          <span className="font-mono text-xs font-bold text-slate-800 tracking-wider truncate">
            {session.id}
          </span>
          <button
            onClick={handleCopyId}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition active:scale-95 shrink-0"
            title="Copy Session ID"
            aria-label="Copy session ID"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Validity and Meta Details */}
        <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3.5">
          <div className="flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="h-3.5 w-3.5 text-[#1A7A6E]" />
              <span>Validity</span>
            </span>
            <span className="font-bold text-slate-800">24 Hours (Read-Only)</span>
          </div>

          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-500">Auto-expires on</span>
            <span className="font-semibold text-slate-700 truncate">{formattedExpiry}</span>
          </div>

          <div className="flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-slate-500">
              <FileText className="h-3.5 w-3.5 text-[#1A7A6E]" />
              <span>Included Records</span>
            </span>
            <span className="font-bold text-[#1A7A6E]">
              {session.selectedRecordIds.length} records selected
            </span>
          </div>

          <div className="flex items-center justify-between font-medium gap-2">
            <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
              <Stethoscope className="h-3.5 w-3.5 text-[#1A7A6E]" />
              <span>Consultation</span>
            </span>
            <span className="font-semibold text-slate-800 truncate text-right">
              {session.specialty} • {session.reason}
            </span>
          </div>
        </div>

        {/* Buttons: Download QR & Share */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <SecondaryButton
            onClick={handleDownload}
            icon={<Download className="h-4 w-4" />}
            size="md"
          >
            Download QR
          </SecondaryButton>
          <PrimaryButton
            onClick={handleShare}
            isLoading={isSharing}
            icon={<Share2 className="h-4 w-4" />}
            size="md"
          >
            Share
          </PrimaryButton>
        </div>
      </div>

      {/* Demo helper card for single-device verification */}
      <div className="mt-4 w-full max-w-sm rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 text-left shadow-2xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span>Interactive Demo Action</span>
          </span>
          <span className="rounded-full bg-blue-100/90 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-800">
            1-Click Demo
          </span>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed mb-3">
          Simulate a doctor scanning this QR code and requesting clinical access on the same device.
        </p>

        <div className="flex flex-col gap-2">
          {onSimulateDoctorScan && (
            <button
              onClick={onSimulateDoctorScan}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-95 transition shadow-sm shadow-blue-500/25"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Simulate Doctor Scan & Request</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            {onRevokeAccess && (
              <button
                onClick={onRevokeAccess}
                className="flex-1 rounded-xl border border-rose-200 bg-white py-1.5 px-2.5 text-center text-xs font-semibold text-rose-700 hover:bg-rose-50 transition active:scale-95"
              >
                Revoke Access
              </button>
            )}
            {onFastForwardTime && (
              <button
                onClick={() => onFastForwardTime(1440)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 px-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95"
                title="Fast forward 24 hours to test expiration"
              >
                Fast-Forward Expiry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
