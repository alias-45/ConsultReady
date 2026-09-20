import React from 'react';
import { ShieldCheck, ArrowRight, Lock, Sparkles, QrCode, HeartPulse, CheckCircle2 } from 'lucide-react';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { AppLogo } from '../../components/common/AppLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onDoctorLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onDoctorLogin
}) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[85vh] p-5 sm:p-6 max-w-md mx-auto text-center animate-in fade-in duration-300">
      {/* Top Emblem & Brand */}
      <div className="pt-4 sm:pt-6">
        <div className="mx-auto relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/70 p-2">
          <AppLogo className="h-16 w-16" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          ConsultReady
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-600 max-w-xs leading-relaxed mx-auto">
          The right medical records for the right consultation. Time-limited, patient-controlled sharing.
        </p>
      </div>

      {/* Realistic Healthcare Pass Preview Card */}
      <div className="my-6 relative w-full max-w-[320px] mx-auto">
        <div className="relative z-10 w-full rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/70 p-5 shadow-xl shadow-slate-200/60 text-left">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-[#E8F6F4] text-[#1A7A6E] font-bold text-xs border border-[#C5ECE5] shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80"
                  alt="Ananya Sharma"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Ananya Sharma</span>
                <span className="text-[10px] text-slate-400 font-medium">B+ • 29 yrs</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6F4] border border-[#C5ECE5] px-2 py-0.5 text-[10px] font-bold text-[#1A7A6E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A7A6E]" />
              <span>Pass Active</span>
            </span>
          </div>

          {/* Consultation Focus Preview */}
          <div className="py-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Focus:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <HeartPulse className="h-3.5 w-3.5 text-rose-500" />
                <span>Cardiology Review</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Selected:</span>
              <span className="font-bold text-[#1A7A6E]">3 Relevant Records</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Security:</span>
              <span className="font-medium text-slate-700">24h Auto-Expiry</span>
            </div>
          </div>

          {/* QR mini preview bar */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <QrCode className="h-4 w-4 text-[#1A7A6E]" />
              <span className="font-mono text-[11px] font-semibold text-slate-700">CONSULT_QR_PASS</span>
            </div>
            <span className="text-[10px] font-bold text-[#1A7A6E] bg-[#E8F6F4] px-2 py-0.5 rounded-md border border-[#C5ECE5]">
              Encrypted
            </span>
          </div>
        </div>

        {/* Floating Trust Pills */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E8EFEF] px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>Zero Data Leakage</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E8EFEF] px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs">
            <Lock className="h-3 w-3 text-[#1A7A6E]" />
            <span>Patient Consent First</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3 pb-4">
        <PrimaryButton
          onClick={onGetStarted}
          fullWidth
          size="lg"
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Get Started as Patient
        </PrimaryButton>

        <SecondaryButton
          onClick={onDoctorLogin}
          fullWidth
          size="md"
          variant="ghost"
        >
          Healthcare provider or clinic? <strong className="text-[#1A7A6E] ml-1">Scan Patient QR</strong>
        </SecondaryButton>
      </div>
    </div>
  );
};
