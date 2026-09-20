import React from 'react';
import {
  FileText,
  Activity,
  HeartPulse,
  Pill,
  Building2,
  FileCheck2,
  Stethoscope,
  Microscope,
  Eye,
  Bone
} from 'lucide-react';
import { RecordType } from '../../types';

interface RecordIconProps {
  type: RecordType;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RecordIcon: React.FC<RecordIconProps> = ({
  type,
  title = '',
  className = '',
  size = 'md'
}) => {
  const lowerTitle = title.toLowerCase();

  // Match specific medical symbols and refined gradients based on title or type
  let Icon = FileText;
  let bgGradient = 'bg-gradient-to-br from-blue-50 to-indigo-100/80 text-blue-600 border-blue-200/70 shadow-xs shadow-blue-500/10';

  if (lowerTitle.includes('ecg') || lowerTitle.includes('cardiac') || lowerTitle.includes('heart')) {
    Icon = HeartPulse;
    bgGradient = 'bg-gradient-to-br from-rose-50 to-red-100/80 text-rose-600 border-rose-200/70 shadow-xs shadow-rose-500/10';
  } else if (lowerTitle.includes('pressure') || lowerTitle.includes('bp') || type === 'Vitals / History') {
    Icon = Activity;
    bgGradient = 'bg-gradient-to-br from-indigo-50 to-purple-100/80 text-indigo-600 border-indigo-200/70 shadow-xs shadow-indigo-500/10';
  } else if (type === 'Prescription' || lowerTitle.includes('medication')) {
    Icon = Pill;
    bgGradient = 'bg-gradient-to-br from-emerald-50 to-teal-100/80 text-emerald-600 border-emerald-200/70 shadow-xs shadow-emerald-500/10';
  } else if (type === 'Hospital Record' || lowerTitle.includes('discharge')) {
    Icon = Building2;
    bgGradient = 'bg-gradient-to-br from-amber-50 to-yellow-100/80 text-amber-700 border-amber-200/70 shadow-xs shadow-amber-500/10';
  } else if (lowerTitle.includes('bone') || lowerTitle.includes('ortho') || lowerTitle.includes('fracture') || lowerTitle.includes('knee')) {
    Icon = Bone;
    bgGradient = 'bg-gradient-to-br from-cyan-50 to-sky-100/80 text-cyan-700 border-cyan-200/70 shadow-xs shadow-cyan-500/10';
  } else if (type === 'Imaging' || lowerTitle.includes('x-ray') || lowerTitle.includes('mri') || lowerTitle.includes('ct')) {
    Icon = Stethoscope;
    bgGradient = 'bg-gradient-to-br from-sky-50 to-cyan-100/80 text-sky-700 border-sky-200/70 shadow-xs shadow-sky-500/10';
  } else if (type === 'Lab Report' || lowerTitle.includes('blood') || lowerTitle.includes('lipid') || lowerTitle.includes('sugar')) {
    Icon = Microscope;
    bgGradient = 'bg-gradient-to-br from-violet-50 to-blue-100/80 text-violet-700 border-violet-200/70 shadow-xs shadow-violet-500/10';
  }

  const sizeClasses = {
    sm: 'h-8 w-8 rounded-xl p-1.5',
    md: 'h-11 w-11 rounded-2xl p-2.5',
    lg: 'h-13 w-13 rounded-2xl p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4 stroke-[2.2]',
    md: 'h-5 w-5 stroke-[2.2]',
    lg: 'h-6 w-6 stroke-[2.2]'
  };

  return (
    <div
      className={`flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${bgGradient} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
};
