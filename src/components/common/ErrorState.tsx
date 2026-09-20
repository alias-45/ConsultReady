import React from 'react';
import { AlertOctagon, RefreshCw, ArrowLeft, ShieldX } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface ErrorStateProps {
  title: string;
  message: string;
  errorType?: 'expired' | 'revoked' | 'invalid-qr' | 'permission' | 'general';
  onRetry?: () => void;
  onBack?: () => void;
  retryLabel?: string;
  backLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  errorType = 'general',
  onRetry,
  onBack,
  retryLabel = 'Try Again',
  backLabel = 'Go Back'
}) => {
  const isSecurity = errorType === 'revoked' || errorType === 'invalid-qr';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-4 max-w-md mx-auto">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-4 ${
          isSecurity ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
        }`}
      >
        {isSecurity ? <ShieldX className="h-8 w-8" /> : <AlertOctagon className="h-8 w-8" />}
      </div>

      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600 max-w-sm">
        {message}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center">
        {onBack && (
          <SecondaryButton
            onClick={onBack}
            size="sm"
            icon={<ArrowLeft className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            {backLabel}
          </SecondaryButton>
        )}
        {onRetry && (
          <PrimaryButton
            onClick={onRetry}
            size="sm"
            variant={isSecurity ? 'primary' : 'primary'}
            icon={<RefreshCw className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            {retryLabel}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};
