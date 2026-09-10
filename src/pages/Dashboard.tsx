import React from 'react';
import { WorkItem, UpdateWorkItemInput } from '../types/workItem';
import { WorkItemCard } from '../components/items/WorkItemCard';
import { getGreeting, isDueToday } from '../utils/dateUtils';
import { AlertCircle, Calendar, Plus, Sparkles, Clock, CheckCircle2, Code2 } from 'lucide-react';
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

const SectionHead: React.FC<{ dot: string; color: string; children: React.ReactNode }> = ({
  dot,
  color,
  children,
}) => (
  <div className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full border-2 border-ink ${dot}`} />
    <h2 className={`text-sm font-marker tracking-wide ${color}`}>{children}</h2>
  </div>
);

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
  const urgentItems = activeItems.filter((i) => i.priority === 'high');
  const dueTodayTasks = activeItems.filter((i) => i.type === 'task' && isDueToday(i.dueDate));
  const upcomingTasks = activeItems.filter(
    (i) => i.type === 'task' && i.priority !== 'high' && !isDueToday(i.dueDate)
  );
  const recentSnippets = activeItems.filter((i) => i.type === 'code');
  const recentOthers = activeItems.filter((i) => i.type !== 'task' && i.type !== 'code');

  const metrics = [
    { label: 'Active', value: stats.activeCount, icon: Sparkles, bg: 'bg-marker-sky/15', color: 'text-marker-sky' },
    { label: 'Urgent', value: stats.urgentCount, icon: AlertCircle, bg: 'bg-marker-pink/15', color: 'text-marker-pink' },
    { label: 'Due Today', value: stats.dueTodayCount, icon: Calendar, bg: 'bg-marker-orange/15', color: 'text-marker-orange' },
    {
      label: 'Done',
      value: items.filter((i) => i.status === 'completed').length,
      icon: CheckCircle2,
      bg: 'bg-marker-mint/15',
      color: 'text-marker-mint',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-ink/30">
        <div>
          <h1 className="text-3xl font-marker tracking-tight text-ink">
            <span className="marker-hi">{greeting}!</span>
          </h1>
          <p className="text-sm font-note text-ink-soft mt-2">
            {stats.activeCount === 0 ? (
              <span className="text-marker-mint font-bold">You're all caught up. Nothing pending!</span>
            ) : (
              <>
                You have <span className="text-marker-sky font-bold">{stats.activeCount} things</span> to handle today
                {stats.urgentCount > 0 && (
                  <span className="text-marker-pink ml-1 font-bold">({stats.urgentCount} urgent)</span>
                )}
              </>
            )}
          </p>
        </div>
        <Button onClick={onOpenCapture} size="sm" icon={<Plus size={15} strokeWidth={3} />}>
          Capture Item
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className={`sketch-card p-3.5 ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'} hover:rotate-0 transition-transform`}
            >
              <div className="flex items-center justify-between text-ink-soft text-[13px] font-hand">
                <span>{m.label}</span>
                <span className={`w-6 h-6 rounded-md flex items-center justify-center ${m.bg} ${m.color}`}>
                  <Icon size={13} />
                </span>
              </div>
              <div className={`text-3xl font-marker mt-1 ${m.color}`}>{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {urgentItems.length > 0 && (
          <section className="space-y-3">
            <SectionHead dot="bg-marker-pink" color="text-marker-pink">
              Urgent ({urgentItems.length})
            </SectionHead>
            <div className="space-y-3">
              {urgentItems.map((item) => (
                <WorkItemCard key={item.id} item={item} onToggleComplete={onToggleComplete} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </div>
          </section>
        )}

        {dueTodayTasks.filter((t) => t.priority !== 'high').length > 0 && (
          <section className="space-y-3">
            <SectionHead dot="bg-marker-orange" color="text-marker-orange">
              Due Today
            </SectionHead>
            <div className="space-y-3">
              {dueTodayTasks.filter((t) => t.priority !== 'high').map((item) => (
                <WorkItemCard key={item.id} item={item} onToggleComplete={onToggleComplete} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </div>
          </section>
        )}

        {upcomingTasks.length > 0 && (
          <section className="space-y-3">
            <SectionHead dot="bg-marker-yellow" color="text-ink">
              Upcoming ({upcomingTasks.length})
            </SectionHead>
            <div className="space-y-3">
              {upcomingTasks.slice(0, 3).map((item) => (
                <WorkItemCard key={item.id} item={item} onToggleComplete={onToggleComplete} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </div>
          </section>
        )}

        {recentSnippets.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-marker-purple" strokeWidth={2.4} />
              <h2 className="text-sm font-marker tracking-wide text-marker-purple">
                Code & Commands ({recentSnippets.length})
              </h2>
            </div>
            <div className="space-y-3">
              {recentSnippets.slice(0, 2).map((item) => (
                <WorkItemCard key={item.id} item={item} onToggleComplete={onToggleComplete} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </div>
          </section>
        )}

        {recentOthers.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-ink-soft font-marker text-sm tracking-wide">
              <Clock size={15} />
              <span>Recent Notes & References</span>
            </div>
            <div className="space-y-3">
              {recentOthers.slice(0, 3).map((item) => (
                <WorkItemCard key={item.id} item={item} onToggleComplete={onToggleComplete} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </div>
          </section>
        )}

        {activeItems.length === 0 && (
          <div className="text-center py-12 sketch-card">
            <CheckCircle2 size={44} className="mx-auto text-marker-mint mb-3" />
            <h3 className="text-lg font-hand text-ink">All caught up!</h3>
            <p className="text-sm font-note text-ink-soft mt-1 max-w-sm mx-auto">
              No active items in your pocket. Time to capture something.
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
