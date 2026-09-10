import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-ink/30 rounded-[14px] bg-paper-50/60 my-4">
      <div className="w-14 h-14 sketch-edge bg-marker-yellow/50 flex items-center justify-center text-ink mb-4 border-2 border-ink -rotate-3">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-hand text-ink">{title}</h3>
      <p className="text-sm font-note text-ink-soft max-w-sm mt-1 mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
