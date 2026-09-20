import React from 'react';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-gradient-to-b from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 shadow-sm shadow-blue-500/25 border border-blue-500/30',
    success:
      'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-800 shadow-sm shadow-emerald-500/25 border border-emerald-500/30',
    danger:
      'bg-gradient-to-b from-rose-600 to-rose-700 text-white hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 shadow-sm shadow-rose-500/25 border border-rose-500/30'
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
    md: 'px-4.5 py-2.5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base font-semibold rounded-2xl gap-2.5'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span className="tracking-tight">{children}</span>
    </button>
  );
};
