import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Clock,
  Key,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  QrCode,
  Pencil,
  Check,
  X,
  Camera,
  Save,
  Mail,
  Heart
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSessionStore } from '../../store/sessionStore';
import { useRecordsStore } from '../../store/recordsStore';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { PrimaryButton } from '../../components/common/PrimaryButton';

interface PatientProfileScreenProps {
  onSwitchToDoctor: () => void;
  onOpenSessionQR: (sessionId: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const AVATAR_OPTIONS = [
  { label: 'Ananya (Default)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80' },
  { label: 'Profile 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80' },
  { label: 'Profile 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
  { label: 'Profile 4', url: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=256&q=80' }
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  onSwitchToDoctor,
  onOpenSessionQR,
  onShowToast
}) => {
  const patient = useAuthStore((state) => state.patient);
  const updatePatientProfile = useAuthStore((state) => state.updatePatientProfile);
  const sessions = useSessionStore((state) => state.sessions);
  const revokeAccess = useSessionStore((state) => state.revokeAccess);
  const resetDefaultRecords = useRecordsStore((state) => state.resetDefaultRecords);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patient.name,
    email: patient.email,
    age: patient.age || 29,
    gender: (patient.gender || 'Female') as 'Female' | 'Male' | 'Other',
    bloodGroup: patient.bloodGroup || 'B+',
    avatarUrl: patient.avatarUrl || AVATAR_OPTIONS[0].url
  });

  const sessionList = Object.values(sessions);

  const handleStartEdit = () => {
    setFormData({
      name: patient.name,
      email: patient.email,
      age: patient.age || 29,
      gender: (patient.gender || 'Female') as 'Female' | 'Male' | 'Other',
      bloodGroup: patient.bloodGroup || 'B+',
      avatarUrl: patient.avatarUrl || AVATAR_OPTIONS[0].url
    });
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onShowToast('Error', 'Name cannot be empty', 'error');
      return;
    }
    if (formData.age < 1 || formData.age > 120) {
      onShowToast('Error', 'Please enter a valid age', 'error');
      return;
    }

    updatePatientProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      avatarUrl: formData.avatarUrl
    });

    setIsEditing(false);
    onShowToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
  };

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
      {/* Profile Header & Edit View */}
      <div className="rounded-3xl border border-[#E8EFEF] bg-white p-5 sm:p-6 shadow-sm">
        {!isEditing ? (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden bg-[#E8F6F4] text-[#1A7A6E] font-black text-xl border-2 border-[#C5ECE5] shadow-sm shrink-0">
                  {patient.avatarUrl ? (
                    <img
                      src={patient.avatarUrl}
                      alt={patient.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{patient.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">
                    {patient.name}
                  </h2>
                  <p className="text-xs font-medium text-slate-500 truncate">{patient.email}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
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

              {/* Edit Profile Button */}
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#C5ECE5] bg-[#E8F6F4] px-3 py-1.5 text-xs font-bold text-[#1A7A6E] hover:bg-[#d5eee9] transition active:scale-95 shrink-0 shadow-2xs"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        ) : (
          /* Edit Profile Form */
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-[#1A7A6E]" />
                <h3 className="text-sm font-black text-slate-900">Edit Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Choose Profile Photo
              </label>
              <div className="flex items-center gap-3">
                {AVATAR_OPTIONS.map((opt, idx) => {
                  const isSelected = formData.avatarUrl === opt.url;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, avatarUrl: opt.url })}
                      className={`relative h-12 w-12 rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${
                        isSelected
                          ? 'border-[#1A7A6E] ring-2 ring-[#1A7A6E]/30 scale-105 shadow-xs'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={opt.url}
                        alt={opt.label}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#1A7A6E]/30 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-xl border border-[#E8EFEF] bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition"
                placeholder="e.g. Ananya Sharma"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full rounded-xl border border-[#E8EFEF] bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition"
                placeholder="e.g. ananya@example.com"
              />
            </div>

            {/* Age, Gender & Blood Group Row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age (yrs)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  required
                  className="w-full rounded-xl border border-[#E8EFEF] bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Female' | 'Male' | 'Other' })}
                  className="w-full rounded-xl border border-[#E8EFEF] bg-slate-50/70 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full rounded-xl border border-[#E8EFEF] bg-slate-50/70 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#1A7A6E] focus:bg-white focus:outline-none transition"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save & Cancel Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A7A6E] text-white px-4 py-2 text-xs font-bold hover:bg-[#14655B] transition active:scale-95 shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
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
