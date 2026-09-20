import React from 'react';
import { ArrowLeft, MoreVertical, ShieldCheck, Lock } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showSecurityBadge?: boolean;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  showSecurityBadge = false,
  className = ''
}) => {
  return (
    <header
      id="app-header"
      className={`relative z-20 flex items-center justify-between border-b border-[#E8EFEF] bg-white/95 px-4 py-3.5 backdrop-blur-md transition-all ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showBack ? (
          <button
            id="header-back-button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-700 shadow-2xs transition-all hover:border-[#1A7A6E]/30 hover:bg-[#E8F6F4]/40 active:scale-95 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#E8EFEF] p-1 shadow-2xs shrink-0">
            <AppLogo className="h-8 w-8" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base sm:text-lg font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {showSecurityBadge && (
              <span
                title="Protected Medical Encryption"
                className="inline-flex items-center gap-1 rounded-full bg-[#E8F6F4] border border-[#C5ECE5] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-[#1A7A6E] shrink-0"
              >
                <Lock className="h-2.5 w-2.5 text-[#1A7A6E]" />
                <span>Encrypted</span>
              </span>
            )}
          </div>
          {subtitle && (
            <p className="truncate text-xs font-medium text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {rightAction}
      </div>
    </header>
  );
};
