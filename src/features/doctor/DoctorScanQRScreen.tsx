import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, QrCode, UserCheck } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { CameraQRScanner } from '../../components/doctor/CameraQRScanner';
import { ErrorState } from '../../components/common/ErrorState';
import { AppLogo } from '../../components/common/AppLogo';

interface DoctorScanQRScreenProps {
  onSessionVerified: (sessionId: string) => void;
  onSwitchToPatient?: () => void;
}

export const DoctorScanQRScreen: React.FC<DoctorScanQRScreenProps> = ({
  onSessionVerified,
  onSwitchToPatient
}) => {
  const currentSessionId = useSessionStore((state) => state.currentSessionId);
  const checkSessionStatus = useSessionStore((state) => state.checkSessionStatus);

  const [scanError, setScanError] = useState<{
    title: string;
    message: string;
    type: 'expired' | 'revoked' | 'invalid-qr' | 'general';
  } | null>(null);

  const handleScan = (scannedCode: string) => {
    setScanError(null);
    const cleanId = scannedCode.trim();

    // Check session existence & validity
    const validity = checkSessionStatus(cleanId);

    if (!validity.valid) {
      if (validity.status === 'revoked') {
        setScanError({
          title: 'Access Revoked by Patient',
          message: 'The patient has revoked authorization for this consultation QR.',
          type: 'revoked'
        });
      } else if (validity.status === 'expired') {
        setScanError({
          title: 'QR Code Expired',
          message: 'This consultation session has expired. Please ask the patient to generate a new QR.',
          type: 'expired'
        });
      } else if (validity.status === 'denied') {
        setScanError({
          title: 'Request Declined',
          message: 'The patient previously declined access for this consultation session.',
          type: 'revoked'
        });
      } else {
        setScanError({
          title: 'Invalid Consultation QR',
          message: 'QR code invalid or not found. Please ensure you are scanning a ConsultReady patient code.',
          type: 'invalid-qr'
        });
      }
      return;
    }

    // Valid session found!
    onSessionVerified(cleanId);
  };

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 max-w-md mx-auto pb-20 animate-in fade-in duration-200">
      {/* Scanner Portal Info Strip */}
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200/90 p-1 shadow-2xs">
            <AppLogo className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              Clinical Scanner
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              For Doctors & Clinical Staff (No Login Required)
            </p>
          </div>
        </div>

        {onSwitchToPatient && (
          <button
            onClick={onSwitchToPatient}
            className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100/80 transition"
          >
            <span>Patient View</span>
          </button>
        )}
      </div>

      {/* Screen Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Scan Patient QR
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Scan patient’s ConsultReady QR to request access to their authorized records
        </p>
      </div>

      {/* Scan Error State if failed */}
      {scanError ? (
        <ErrorState
          title={scanError.title}
          message={scanError.message}
          errorType={scanError.type}
          retryLabel="Scan Again"
          onRetry={() => setScanError(null)}
        />
      ) : (
        <CameraQRScanner
          onScanSuccess={handleScan}
          onScanError={(msg) =>
            setScanError({
              title: 'Scanning Error',
              message: msg,
              type: 'invalid-qr'
            })
          }
          demoSessionId={currentSessionId || 'CONSULT_SESSION_8F72A91C'}
        />
      )}
    </div>
  );
};

