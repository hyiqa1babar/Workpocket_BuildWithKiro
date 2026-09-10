import React, { useState } from 'react';
import { WorkItem, UpdateWorkItemInput, WorkItemPriority } from '../types/workItem';
import { WorkItemList } from '../components/items/WorkItemList';
import { CheckSquare, Plus, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface TasksProps {
  items: WorkItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateWorkItemInput) => void;
  onOpenCapture: () => void;
}

export const Tasks: React.FC<TasksProps> = ({
  items,
  onToggleComplete,
  onDelete,
  onUpdate,
  onOpenCapture,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<WorkItemPriority | 'all'>('all');
  const [statusTab, setStatusTab] = useState<'pending' | 'completed' | 'all'>('pending');

  const taskItems = items.filter((item) => {
    if (item.type !== 'task') return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (statusTab === 'pending' && item.status !== 'active') return false;
    if (statusTab === 'completed' && item.status !== 'completed') return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-ink/30">
        <div>
          <h1 className="text-2xl font-marker text-ink flex items-center gap-2">
            <CheckSquare size={20} className="text-marker-mint" />
            <span>Tasks</span>
          </h1>
          <p className="text-sm font-note text-ink-soft mt-1">
            Actionable work items with priorities and due dates.
          </p>
        </div>
        <Button onClick={onOpenCapture} size="sm" icon={<Plus size={14} />}>
          Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1 bg-paper-50 border-2 border-ink p-1 rounded-[10px] shadow-sketch-sm">
          {(['pending', 'completed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                statusTab === tab
                  ? 'bg-marker-yellow text-ink'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-ink-faint" />
          <span className="text-ink-soft text-xs font-hand">Priority:</span>
          <div className="flex items-center gap-1 bg-paper-50 border-2 border-ink p-1 rounded-[10px] shadow-sketch-sm">
            {(['all', 'high', 'medium', 'low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-0.5 rounded capitalize text-[11px] font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-marker-yellow text-ink font-bold'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <WorkItemList
        items={taskItems}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onUpdate={onUpdate}
        emptyTitle="No tasks in this view"
        emptyDescription="Keep your day structured by adding tasks with due dates and priorities."
        emptyIcon={CheckSquare}
        emptyActionLabel="Create Task"
        onEmptyAction={onOpenCapture}
      />
    </div>
  );
};
