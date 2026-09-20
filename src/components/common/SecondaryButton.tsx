import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  variant = 'outline',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    outline:
      'border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-2xs',
    ghost:
      'bg-transparent text-slate-600 hover:bg-[#E8F6F4]/60 hover:text-[#1A7A6E] active:bg-[#E8F6F4]',
    soft:
      'bg-[#E8F6F4] text-[#1A7A6E] hover:bg-[#DCF3EF] active:bg-[#CEEEE8] border border-[#C5ECE5] shadow-2xs'
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm font-bold rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5'
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="tracking-tight">{children}</span>
    </button>
  );
};
