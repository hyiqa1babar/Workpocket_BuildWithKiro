import React from 'react';
import { WorkItem, UpdateWorkItemInput } from '../types/workItem';
import { WorkItemCard } from '../components/items/WorkItemCard';
import { getGreeting, isDueToday } from '../utils/dateUtils';
import { AlertCircle, Calendar, Plus, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface DashboardProps {
  items: WorkItem[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateWorkItemInput) => void;
  onOpenCapture: () => void;
  stats: {
    total: number;
    activeCount: number;
    urgentCount: number;
    dueTodayCount: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({
  items,
  onToggleComplete,
  onDelete,
  onUpdate,
  onOpenCapture,
  stats,
}) => {
  const greeting = getGreeting();
  const activeItems = items.filter((i) => i.status === 'active');

  // Urgent items
  const urgentItems = activeItems.filter((i) => i.priority === 'high');

  // Tasks due today or upcoming
  const dueTodayTasks = activeItems.filter(
    (i) => i.type === 'task' && isDueToday(i.dueDate)
  );

  const upcomingTasks = activeItems.filter(
    (i) => i.type === 'task' && i.priority !== 'high' && !isDueToday(i.dueDate)
  );

  // Recent code/links/notes
  const recentSnippets = activeItems.filter((i) => i.type === 'code');
  const recentOthers = activeItems.filter((i) => i.type !== 'task' && i.type !== 'code');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{greeting}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {stats.activeCount === 0 ? (
              <span className="text-emerald-400 font-medium">You're all caught up! Zero pending items.</span>
            ) : (
              <>
                You have <span className="text-sky-400 font-semibold">{stats.activeCount} things</span> to handle today
                {stats.urgentCount > 0 && (
                  <span className="text-rose-400 ml-1">({stats.urgentCount} marked urgent)</span>
                )}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onOpenCapture} size="sm" icon={<Plus size={15} />}>
            Capture Item
          </Button>
        </div>
      </div>

      {/* Metrics Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Items</span>
            <Sparkles size={14} className="text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{stats.activeCount}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Urgent</span>
            <AlertCircle size={14} className="text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{stats.urgentCount}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Due Today</span>
            <Calendar size={14} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stats.dueTodayCount}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Completed</span>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {items.filter((i) => i.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Main Section matching the mockup visual structure */}
      <div className="space-y-6">
        {/* 🔴 URGENT SECTION */}
        {urgentItems.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                Urgent Priority ({urgentItems.length})
              </h2>
            </div>
            <div className="space-y-2.5">
              {urgentItems.map((item) => (
                <WorkItemCard
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </section>
        )}

        {/* 📅 DUE TODAY (if not already high priority) */}
        {dueTodayTasks.filter((t) => t.priority !== 'high').length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Due Today
              </h2>
            </div>
            <div className="space-y-2.5">
              {dueTodayTasks
                .filter((t) => t.priority !== 'high')
                .map((item) => (
                  <WorkItemCard
                    key={item.id}
                    item={item}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                  />
                ))}
            </div>
          </section>
        )}

        {/* 🟡 UPCOMING TASKS */}
        {upcomingTasks.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-yellow-400 font-mono">
                Upcoming ({upcomingTasks.length})
              </h2>
            </div>
            <div className="space-y-2.5">
              {upcomingTasks.slice(0, 3).map((item) => (
                <WorkItemCard
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </section>
        )}

        {/* 💻 CODE SNIPPETS & RECENT WORK */}
        {recentSnippets.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-mono text-xs font-bold">💻</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
                Code & Commands ({recentSnippets.length})
              </h2>
            </div>
            <div className="space-y-2.5">
              {recentSnippets.slice(0, 2).map((item) => (
                <WorkItemCard
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently captured items */}
        {recentOthers.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Clock size={13} />
              <span>Other Recent Notes & References</span>
            </div>
            <div className="space-y-2.5">
              {recentOthers.slice(0, 3).map((item) => (
                <WorkItemCard
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </section>
        )}

        {activeItems.length === 0 && (
          <div className="text-center py-12 border border-slate-800 rounded-2xl bg-slate-900/30">
            <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-3" />
            <h3 className="text-base font-semibold text-slate-100">All caught up!</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              You have no active tasks or items in your command center.
            </p>
            <div className="mt-4">
              <Button onClick={onOpenCapture} size="sm">
                Capture new item
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
