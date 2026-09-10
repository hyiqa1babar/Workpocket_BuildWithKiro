import React from 'react';
import { WorkItem, UpdateWorkItemInput } from '../types/workItem';
import { WorkItemList } from '../components/items/WorkItemList';
import { Link2, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface LinksProps {
  items: WorkItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateWorkItemInput) => void;
  onOpenCapture: () => void;
}

export const Links: React.FC<LinksProps> = ({
  items,
  onToggleComplete,
  onDelete,
  onUpdate,
  onOpenCapture,
}) => {
  const linkItems = items.filter((item) => item.type === 'link');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Link2 size={20} className="text-sky-400" />
            <span>Saved Links & Bookmarks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Documentation, research papers, repositories, and articles to read.
          </p>
        </div>
        <Button onClick={onOpenCapture} size="sm" icon={<Plus size={14} />}>
          Save Link
        </Button>
      </div>

      <WorkItemList
        items={linkItems}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onUpdate={onUpdate}
        emptyTitle="No links saved yet"
        emptyDescription="Save URLs directly to your command center instead of cluttering browser tabs."
        emptyIcon={Link2}
        emptyActionLabel="Save a Link"
        onEmptyAction={onOpenCapture}
      />
    </div>
  );
};
