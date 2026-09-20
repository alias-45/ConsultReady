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
      'bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:bg-slate-200',
    soft:
      'bg-blue-50/80 text-blue-700 hover:bg-blue-100/90 active:bg-blue-200 border border-blue-200/60 shadow-2xs'
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
    md: 'px-4.5 py-2.5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base font-semibold rounded-2xl gap-2.5'
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
