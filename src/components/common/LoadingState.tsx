import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  message?: string;
  isAiAnalysis?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Processing...',
  message = 'Please wait while we prepare your information.',
  isAiAnalysis = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {isAiAnalysis ? (
          <>
            <Sparkles className="h-7 w-7 text-blue-600 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </span>
          </>
        ) : (
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        )}
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-xs text-xs text-slate-500 leading-relaxed">
        {message}
      </p>
    </div>
  );
};
