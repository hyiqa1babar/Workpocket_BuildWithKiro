import React from 'react';
import { WorkItem, UpdateWorkItemInput } from '../types/workItem';
import { WorkItemList } from '../components/items/WorkItemList';
import { Inbox as InboxIcon, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface InboxProps {
  items: WorkItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateWorkItemInput) => void;
  onOpenCapture: () => void;
}

export const Inbox: React.FC<InboxProps> = ({
  items,
  onToggleComplete,
  onDelete,
  onUpdate,
  onOpenCapture,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-ink/30">
        <div>
          <h1 className="text-2xl font-marker text-ink flex items-center gap-2">
            <InboxIcon size={20} className="text-marker-sky" />
            <span>Inbox</span>
          </h1>
          <p className="text-sm font-note text-ink-soft mt-1">
            Raw incoming work stream. Process, organize, and execute.
          </p>
        </div>
        <Button onClick={onOpenCapture} size="sm" icon={<Plus size={14} />}>
          Quick Capture
        </Button>
      </div>

      <WorkItemList
        items={items}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onUpdate={onUpdate}
        emptyTitle="Inbox is clear"
        emptyDescription="Your inbox has zero pending items. Capture something quickly whenever you encounter tasks, snippets, or links."
        emptyIcon={InboxIcon}
        emptyActionLabel="Capture Item"
        onEmptyAction={onOpenCapture}
      />
    </div>
  );
};
