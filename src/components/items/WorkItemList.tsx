import React from 'react';
import { WorkItem, UpdateWorkItemInput } from '../../types/workItem';
import { WorkItemCard } from './WorkItemCard';
import { EmptyState } from '../ui/EmptyState';
import { LucideIcon, Inbox } from 'lucide-react';

interface WorkItemListProps {
  items: WorkItem[];
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: UpdateWorkItemInput) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export const WorkItemList: React.FC<WorkItemListProps> = ({
  items,
  onToggleComplete,
  onDelete,
  onUpdate,
  emptyTitle = 'No items found',
  emptyDescription = 'No work items match your current filter or view.',
  emptyIcon = Inbox,
  onEmptyAction,
  emptyActionLabel,
}) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        onAction={onEmptyAction}
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <WorkItemCard
          key={item.id}
          item={item}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
