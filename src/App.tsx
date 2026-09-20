import React, { useState } from 'react';
import {
  Stethoscope,
  User,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  QrCode,
  Lock,
  ArrowRight,
  LogOut,
  FolderHeart
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Types & Stores
import { MedicalRecord, PatientScreen, DoctorScreen, AppRole, ToastMessage } from './types';
import { useAuthStore } from './store/authStore';
import { useSessionStore } from './store/sessionStore';
import { useRecordsStore } from './store/recordsStore';
import { useConsultationStore } from './store/consultationStore';

// Common Components
import { AppHeader } from './components/common/AppHeader';
import { AppLogo } from './components/common/AppLogo';
import { BottomNavigation } from './components/common/BottomNavigation';
import { ToastSnackbar } from './components/common/ToastSnackbar';
import { RecordViewerModal } from './components/common/RecordViewerModal';

// Patient Features
import { WelcomeScreen } from './features/patient/WelcomeScreen';
import { MyRecordsScreen } from './features/patient/MyRecordsScreen';
import { CreateConsultationScreen } from './features/patient/CreateConsultationScreen';
import { SmartSuggestionsScreen } from './features/patient/SmartSuggestionsScreen';
import { ReviewApproveScreen } from './features/patient/ReviewApproveScreen';
import { ConsultationQRScreen } from './features/patient/ConsultationQRScreen';
import { PatientProfileScreen } from './features/patient/PatientProfileScreen';
import { IncomingAccessRequestModal } from './components/patient/IncomingAccessRequestModal';

// Doctor / Scanner Features
import { DoctorScanQRScreen } from './features/doctor/DoctorScanQRScreen';
import { DoctorVerifyScreen } from './features/doctor/DoctorVerifyScreen';
import { DoctorRecordsScreen } from './features/doctor/DoctorRecordsScreen';

export default function App() {
  const { currentRole, setRole } = useAuthStore();
  const { currentSessionId, setCurrentSessionId, activeDoctorSessionId, setActiveDoctorSessionId } =
    useSessionStore();
  const records = useRecordsStore((state) => state.records);
  const { setSpecialty, setReason, generateSuggestions } = useConsultationStore();

  // Navigation States
  const [patientScreen, setPatientScreen] = useState<PatientScreen>('welcome');
  const [doctorScreen, setDoctorScreen] = useState<DoctorScreen>('scan-qr');
  const [bottomTab, setBottomTab] = useState<'home' | 'records' | 'consult' | 'profile'>('home');
  const [scannedSessionId, setScannedSessionId] = useState<string>('CONSULT_SESSION_8F72A91C');
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);

  // Responsive device simulation toggle ('mobile' | 'tablet' | 'responsive')
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'responsive'>('responsive');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch to Doctor View with session preloaded (No login required)
  const handleSimulateDoctorScan = () => {
    if (currentSessionId) {
      setScannedSessionId(currentSessionId);
    }
    setRole('doctor');
    setDoctorScreen('verify-access');
    addToast(
      'Switched to Scanner Portal',
      'Simulating scan of patient QR (no login required).',
      'info'
    );
  };

  // Quick 1-click End-to-End Demo Setup
  const handleQuickDemoFlow = () => {
    setRole('patient');
    setSpecialty('Cardiology');
    setReason('Chest pain');
    generateSuggestions(records);
    setPatientScreen('smart-suggestions');
    setBottomTab('consult');
    addToast('Cardiology Demo Initialized', 'Loaded Cardiology • Chest pain smart suggestions.', 'success');
  };

  // Celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Global Role & Demo Simulation Switcher Bar */}
      <nav
        aria-label="Simulation Bar"
        className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-slate-900 px-3 sm:px-4 py-2 text-white shadow-md gap-2"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white p-0.5 shrink-0 shadow-2xs">
            <AppLogo className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-xs sm:text-sm tracking-tight hidden sm:inline truncate">
            ConsultReady
          </span>

          {/* Role Switcher Pill */}
          <div className="flex items-center rounded-xl bg-slate-800 p-0.5 border border-slate-700 shrink-0">
            <button
              onClick={() => setRole('patient')}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-bold transition whitespace-nowrap ${
                currentRole === 'patient'
                  ? 'bg-[#1A7A6E] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-3 w-3" />
              <span>Patient</span>
            </button>
            <button
              onClick={() => {
                setRole('doctor');
                if (activeDoctorSessionId) {
                  setDoctorScreen('patient-records');
                } else {
                  setDoctorScreen('scan-qr');
                }
              }}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-bold transition whitespace-nowrap ${
                currentRole === 'doctor'
                  ? 'bg-[#1A7A6E] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="h-3 w-3" />
              <span className="hidden xs:inline">Doctor Portal</span>
              <span className="xs:hidden">Doctor</span>
            </button>
          </div>
        </div>

        {/* Device Viewport Simulation & Demo Helper */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Demo Workflow CTA */}
          <button
            onClick={handleQuickDemoFlow}
            className="flex items-center gap-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 px-2 py-1 text-[11px] sm:text-xs font-bold text-white transition active:scale-95 whitespace-nowrap"
            title="Auto-load Cardiology Chest Pain flow"
          >
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">Cardiology Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Viewport Frame toggles */}
          <div className="hidden sm:flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-md transition ${
                deviceView === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (380px)"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded-md transition ${
                deviceView === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (640px)"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeviceView('responsive')}
              className={`p-1.5 rounded-md transition ${
                deviceView === 'responsive'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Full Responsive Web"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Application Container */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 lg:p-6 overflow-x-hidden">
        <main
          className={`w-full bg-slate-50 border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 min-h-[92vh] sm:min-h-[840px] ${
            deviceView === 'mobile'
              ? 'max-w-[400px] sm:rounded-[40px] ring-12 ring-slate-800/10'
              : deviceView === 'tablet'
              ? 'max-w-[680px] sm:rounded-[32px]'
              : 'max-w-4xl sm:rounded-3xl'
          }`}
        >
          {/* PATIENT VIEW FLOW */}
          {currentRole === 'patient' && (
            <div className="flex-1 flex flex-col">
              {/* Patient App Header */}
              {patientScreen !== 'welcome' && (
                <AppHeader
                  title={
                    patientScreen === 'records'
                      ? 'ConsultReady'
                      : patientScreen === 'consultation-details'
                      ? 'Consultation Bundle'
                      : patientScreen === 'smart-suggestions'
                      ? 'Smart Suggestions'
                      : patientScreen === 'review-approve'
                      ? 'Review & Approve'
                      : patientScreen === 'consultation-qr'
                      ? 'Consultation QR'
                      : 'My Profile'
                  }
                  subtitle={
                    patientScreen === 'records'
                      ? 'Patient Record Sharing'
                      : 'Ananya Sharma • 29/F'
                  }
                  showBack={patientScreen !== 'records'}
                  onBack={() => {
                    if (patientScreen === 'smart-suggestions') {
                      setPatientScreen('consultation-details');
                    } else if (patientScreen === 'review-approve') {
                      setPatientScreen('smart-suggestions');
                    } else if (patientScreen === 'consultation-qr') {
                      setPatientScreen('records');
                    } else {
                      setPatientScreen('records');
                    }
                  }}
                  showSecurityBadge={true}
                  rightAction={
                    <button
                      onClick={() => {
                        setRole('doctor');
                        setDoctorScreen('scan-qr');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200/80 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-blue-700 hover:bg-blue-100 transition shrink-0 active:scale-95 shadow-2xs"
                      title="Healthcare Provider Scanner Portal"
                    >
                      <QrCode className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="hidden xs:inline">Scanner</span>
                      <span className="hidden md:inline">Portal</span>
                    </button>
                  }
                />
              )}

              {/* Patient Screen Routing */}
              <div className="flex-1 overflow-y-auto">
                {patientScreen === 'welcome' && (
                  <WelcomeScreen
                    onGetStarted={() => {
                      setPatientScreen('records');
                      setBottomTab('records');
                    }}
                    onDoctorLogin={() => {
                      setRole('doctor');
                      setDoctorScreen('scan-qr');
                    }}
                  />
                )}

                {patientScreen === 'records' && (
                  <MyRecordsScreen
                    onViewRecord={(rec) => setViewingRecord(rec)}
                    onCreateConsultation={(spec?: string) => {
                      if (spec) {
                        setSpecialty(spec);
                      }
                      setPatientScreen('consultation-details');
                      setBottomTab('consult');
                    }}
                    onShowToast={addToast}
                  />
                )}

                {patientScreen === 'consultation-details' && (
                  <CreateConsultationScreen
                    onSuggestionsReady={() => {
                      setPatientScreen('smart-suggestions');
                    }}
                    onCancel={() => {
                      setPatientScreen('records');
                      setBottomTab('records');
                    }}
                  />
                )}

                {patientScreen === 'smart-suggestions' && (
                  <SmartSuggestionsScreen
                    onNext={() => {
                      setPatientScreen('review-approve');
                    }}
                    onBack={() => {
                      setPatientScreen('consultation-details');
                    }}
                  />
                )}

                {patientScreen === 'review-approve' && (
                  <ReviewApproveScreen
                    onQrGenerated={() => {
                      triggerConfetti();
                      setPatientScreen('consultation-qr');
                    }}
                    onEdit={() => {
                      setPatientScreen('smart-suggestions');
                    }}
                    onBack={() => {
                      setPatientScreen('smart-suggestions');
                    }}
                    onShowToast={addToast}
                  />
                )}

                {patientScreen === 'consultation-qr' && (
                  <ConsultationQRScreen
                    onBackToRecords={() => {
                      setPatientScreen('records');
                      setBottomTab('records');
                    }}
                    onSimulateDoctorScan={handleSimulateDoctorScan}
                    onShowToast={addToast}
                  />
                )}

                {patientScreen === 'active-session-patient' && (
                  <PatientProfileScreen
                    onSwitchToDoctor={() => {
                      setRole('doctor');
                      setDoctorScreen('scan-qr');
                    }}
                    onOpenSessionQR={(sessionId) => {
                      setCurrentSessionId(sessionId);
                      setPatientScreen('consultation-qr');
                    }}
                    onShowToast={addToast}
                  />
                )}
              </div>

              {/* Bottom Navigation for Patient */}
              {patientScreen !== 'welcome' && (
                <BottomNavigation
                  activeTab={bottomTab}
                  onSelectTab={(tab) => {
                    setBottomTab(tab);
                    if (tab === 'home' || tab === 'records') {
                      setPatientScreen('records');
                    } else if (tab === 'consult') {
                      setPatientScreen('consultation-details');
                    } else if (tab === 'profile') {
                      setPatientScreen('active-session-patient');
                    }
                  }}
                  onSwitchToDoctor={() => setRole('doctor')}
                />
              )}
            </div>
          )}

          {/* DOCTOR / SCANNER VIEW FLOW */}
          {currentRole === 'doctor' && (
            <div className="flex-1 flex flex-col">
              {/* Doctor Header */}
              <AppHeader
                title={
                  doctorScreen === 'scan-qr'
                    ? 'Clinical Scanner'
                    : doctorScreen === 'verify-access'
                    ? 'Request Access'
                    : 'Patient Records (Read-Only)'
                }
                subtitle="Open Scanner Portal • Patient Consent Required"
                showBack={true}
                onBack={() => {
                  if (doctorScreen === 'patient-records') {
                    setDoctorScreen('scan-qr');
                  } else if (doctorScreen === 'verify-access') {
                    setDoctorScreen('scan-qr');
                  } else if (doctorScreen === 'scan-qr') {
                    setRole('patient');
                  }
                }}
                showSecurityBadge={true}
                rightAction={
                  <button
                    onClick={() => setRole('patient')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200/80 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-blue-700 hover:bg-blue-100 transition shrink-0 active:scale-95 shadow-2xs"
                    title="Switch to Patient Mode"
                  >
                    <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="hidden xs:inline">Patient</span>
                    <span className="hidden md:inline">Mode</span>
                  </button>
                }
              />

              {/* Doctor Screen Routing */}
              <div className="flex-1 overflow-y-auto">
                {doctorScreen === 'scan-qr' && (
                  <DoctorScanQRScreen
                    onSessionVerified={(sessId) => {
                      setScannedSessionId(sessId);
                      setDoctorScreen('verify-access');
                    }}
                    onSwitchToPatient={() => setRole('patient')}
                  />
                )}

                {doctorScreen === 'verify-access' && (
                  <DoctorVerifyScreen
                    sessionId={scannedSessionId}
                    onAccessGranted={() => {
                      triggerConfetti();
                      setActiveDoctorSessionId(scannedSessionId);
                      setDoctorScreen('patient-records');
                    }}
                    onCancel={() => setDoctorScreen('scan-qr')}
                    onSwitchToPatientView={() => setRole('patient')}
                    onShowToast={addToast}
                  />
                )}

                {doctorScreen === 'patient-records' && (
                  <DoctorRecordsScreen
                    sessionId={scannedSessionId}
                    onEndSession={() => {
                      setActiveDoctorSessionId(null);
                      setDoctorScreen('scan-qr');
                    }}
                    onShowToast={addToast}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Patient Incoming Request Notification Dialog */}
      <IncomingAccessRequestModal
        onAcceptSuccess={(acceptedSession) => {
          triggerConfetti();
          addToast(
            'Access Granted',
            `Approved consultation access for ${acceptedSession.requesterName || 'Doctor'}.`,
            'success'
          );
        }}
        onDeclineSuccess={() => {
          addToast('Request Declined', 'Access request was declined.', 'info');
        }}
      />

      {/* Global Record Viewer Modal for Patient View */}
      <RecordViewerModal
        record={viewingRecord}
        isOpen={Boolean(viewingRecord)}
        onClose={() => setViewingRecord(null)}
        isDoctorView={currentRole === 'doctor'}
      />

      {/* Global Toast / Snackbar Notifications */}
      <ToastSnackbar toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
