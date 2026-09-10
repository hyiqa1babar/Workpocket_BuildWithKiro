import React from 'react';
import { WorkItem, UpdateWorkItemInput } from '../types/workItem';
import { WorkItemList } from '../components/items/WorkItemList';
import { Code2, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface CodeSnippetsProps {
  items: WorkItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateWorkItemInput) => void;
  onOpenCapture: () => void;
}

export const CodeSnippets: React.FC<CodeSnippetsProps> = ({
  items,
  onToggleComplete,
  onDelete,
  onUpdate,
  onOpenCapture,
}) => {
  const codeItems = items.filter((item) => item.type === 'code');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-ink/30">
        <div>
          <h1 className="text-2xl font-marker text-ink flex items-center gap-2">
            <Code2 size={20} className="text-marker-purple" />
            <span>Code Snippets & Terminal Commands</span>
          </h1>
          <p className="text-sm font-note text-ink-soft mt-1">
            Frequently used bash commands, docker configs, SQL queries, and scripts.
          </p>
        </div>
        <Button onClick={onOpenCapture} size="sm" icon={<Plus size={14} />}>
          New Snippet
        </Button>
      </div>

      <WorkItemList
        items={codeItems}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onUpdate={onUpdate}
        emptyTitle="No snippets captured"
        emptyDescription="Keep your one-liner terminal commands and utility scripts handy in one place."
        emptyIcon={Code2}
        emptyActionLabel="Save Snippet"
        onEmptyAction={onOpenCapture}
      />
    </div>
  );
};
