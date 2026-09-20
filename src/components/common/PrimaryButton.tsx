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
      'bg-[#1A7A6E] hover:bg-[#14655B] active:bg-[#0F524A] text-white shadow-sm shadow-[#1A7A6E]/25 border border-[#1A7A6E]/30',
    success:
      'bg-[#22A392] hover:bg-[#1C8A7B] active:bg-[#167064] text-white shadow-sm shadow-[#22A392]/25 border border-[#22A392]/30',
    danger:
      'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-sm shadow-rose-500/25 border border-rose-500/30'
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm font-bold rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5'
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
