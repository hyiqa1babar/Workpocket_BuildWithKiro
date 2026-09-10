import React from 'react';
import { WorkItem, UpdateWorkItemInput } from '../types/workItem';
import { WorkItemList } from '../components/items/WorkItemList';
import { FileText, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface NotesProps {
  items: WorkItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateWorkItemInput) => void;
  onOpenCapture: () => void;
}

export const Notes: React.FC<NotesProps> = ({
  items,
  onToggleComplete,
  onDelete,
  onUpdate,
  onOpenCapture,
}) => {
  const noteItems = items.filter((item) => item.type === 'note');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-ink/30">
        <div>
          <h1 className="text-2xl font-marker text-ink flex items-center gap-2">
            <FileText size={20} className="text-marker-orange" />
            <span>Notes</span>
          </h1>
          <p className="text-sm font-note text-ink-soft mt-1">
            Thoughts, references, system design takeaways, and meeting notes.
          </p>
        </div>
        <Button onClick={onOpenCapture} size="sm" icon={<Plus size={14} />}>
          New Note
        </Button>
      </div>

      <WorkItemList
        items={noteItems}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onUpdate={onUpdate}
        emptyTitle="No notes captured yet"
        emptyDescription="Capture quick thoughts, lecture notes, or ideas without leaving your flow."
        emptyIcon={FileText}
        emptyActionLabel="Write a Note"
        onEmptyAction={onOpenCapture}
      />
    </div>
  );
};
