import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Sparkles,
  QrCode,
  CheckCircle2,
  Clock,
  Building2,
  ChevronRight,
  Share2
} from 'lucide-react';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { AppLogo } from '../../components/common/AppLogo';
import { generateQrDataUrl } from '../../services/qrService';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onDoctorLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onDoctorLogin
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    generateQrDataUrl('CONSULT_PASS_ANANYA_SHARMA_B89').then((url) => {
      if (isMounted) setQrUrl(url);
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-[85vh] p-4 sm:p-6 max-w-md mx-auto text-center animate-in fade-in duration-300">
      {/* Top Emblem & Brand */}
      <div className="pt-2 sm:pt-4">
        <div className="mx-auto relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/70 p-2">
          <AppLogo className="h-14 w-14 sm:h-16 sm:w-16" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          ConsultReady
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 max-w-xs leading-relaxed mx-auto">
          The right medical records for the right consultation. Time-limited, patient-controlled sharing.
        </p>
      </div>

      {/* Ticket Container Wrapper */}
      <div className="my-5 w-full max-w-[340px] sm:max-w-[360px] mx-auto">
        {/* Ticket Header Label (like "Your Ticket" in the reference) */}
        <div className="flex items-center justify-between px-2 mb-2 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wider uppercase text-slate-700">
              Your Pass
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#E8F6F4] px-2 py-0.5 text-[10px] font-bold text-[#1A7A6E] border border-[#C5ECE5]">
              Live
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Share2 className="h-3.5 w-3.5 hover:text-slate-600 transition cursor-pointer" />
          </div>
        </div>

        {/* The Ticket Shape Card with Notches & Perforation */}
        <div className="relative w-full rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/70 text-left overflow-hidden">
          
          {/* Top Ticket Segment: Poster + Clinical Details + Vertical M-Pass Label */}
          <div className="relative p-4 pb-3">
            {/* Vertical rotated M-Pass Badge on right edge (inspired by reference image) */}
            <div className="absolute top-5 right-2 select-none pointer-events-none">
              <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase [writing-mode:vertical-rl] rotate-180">
                M-PASS
              </span>
            </div>

            <div className="flex items-start gap-3.5 pr-5">
              {/* Patient Photo Frame with Verified Ribbon */}
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
                  alt="Ananya Sharma"
                  className="h-24 w-18 sm:h-26 sm:w-20 rounded-2xl object-cover shadow-sm border border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1.5 inset-x-0 flex justify-center">
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#1A7A6E] px-2 py-0.5 text-[9px] font-extrabold text-white shadow-2xs">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              {/* Patient Demographics & Consultation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate">
                    Ananya Sharma
                  </h3>
                  <span className="text-xs font-bold text-slate-400 shrink-0">(Self)</span>
                </div>

                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 truncate">
                  Female, 29 yrs • Blood: B+
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-800">
                  <Clock className="h-3 w-3 text-[#1A7A6E] shrink-0" />
                  <span className="truncate">Today | 24-Hr Time Lock</span>
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 truncate">
                  <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">City Heart & Multispecialty</span>
                </p>
              </div>
            </div>

            {/* Quick Action Pill (Inspired by "Tap for support, details & more actions") */}
            <div className="mt-3.5">
              <div className="flex items-center justify-between gap-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition border border-slate-200/70">
                <div className="flex items-center gap-1.5 min-w-0">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1A7A6E] shrink-0" />
                  <span className="truncate">Encrypted Pass • 3 Records Authorized</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* Perforation Divider with Left & Right Cutout Notches */}
          <div className="relative flex items-center justify-center my-1 py-1">
            {/* Left cutout notch */}
            <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-50 border border-slate-200/90 shadow-inner z-10" />
            
            {/* Perforated dashed tear line */}
            <div className="w-full border-t-2 border-dashed border-slate-200 mx-5" />
            
            {/* Right cutout notch */}
            <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-50 border border-slate-200/90 shadow-inner z-10" />
          </div>

          {/* Middle Ticket Segment: Scannable QR + Room/Cabin/Token Details */}
          <div className="p-4 pt-2 flex items-center justify-between gap-3">
            {/* Left QR Code with framing */}
            <div className="shrink-0 p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-center">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Encrypted Consultation Pass QR"
                  className="h-20 w-20 sm:h-22 sm:w-22 rounded-xl object-contain"
                />
              ) : (
                <div className="h-20 w-20 sm:h-22 sm:w-22 flex items-center justify-center bg-slate-50 rounded-xl">
                  <QrCode className="h-14 w-14 text-slate-800" />
                </div>
              )}
            </div>

            {/* Right Booking / Seat Style Information */}
            <div className="flex-1 min-w-0 text-right sm:text-left">
              <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                3 Records Attached
              </span>
              <h4 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight mt-0.5">
                CONSULT PASS
              </h4>
              <span className="block text-[11px] font-bold text-slate-600 mt-0.5 truncate">
                OPD ROOM 4 • TOKEN #14
              </span>
              <div className="mt-1.5 inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-black text-slate-800 tracking-wider border border-slate-200/80">
                PASS ID: CR-AN89-KUL
              </div>
            </div>
          </div>

          {/* Ticket Cut-off / Expiry Strip (Inspired by cancellation notice strip in reference) */}
          <div className="bg-slate-50/90 px-3.5 py-2 border-y border-slate-100 text-center">
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-snug">
              Time-lock enforced : 24-hour read-only access for verified doctor only
            </p>
          </div>

          {/* Ticket Footer (Total / Permission Protocol) */}
          <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-800 bg-white">
            <span className="text-slate-500 font-medium">Access Permission</span>
            <span className="text-[#1A7A6E] font-black tracking-tight">Time-Bound (Read-Only)</span>
          </div>
        </div>

        {/* Floating Trust Badges */}
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

      {/* Primary Action Buttons */}
      <div className="w-full space-y-3 pb-4">
        <PrimaryButton
          onClick={onGetStarted}
          fullWidth
          size="lg"
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Prepare Consultation Pass
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
