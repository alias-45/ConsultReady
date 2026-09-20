import React from 'react';
import { FolderOpen, Search } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'folder' | 'search';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'folder'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        {icon === 'search' ? <Search className="h-8 w-8" /> : <FolderOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <PrimaryButton onClick={onAction} size="sm">
            {actionLabel}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
