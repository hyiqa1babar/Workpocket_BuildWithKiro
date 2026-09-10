import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  FileText,
  Link2,
  Code2,
  Settings,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { WorkItemType } from '../../types/workItem';

export type PageView = 'dashboard' | 'inbox' | WorkItemType | 'settings';

interface SidebarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onOpenCapture: () => void;
  onResetData: () => void;
  stats: {
    total: number;
    activeCount: number;
    urgentCount: number;
    countByType: Record<WorkItemType, number>;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenCapture,
  onResetData,
  stats,
}) => {
  const navItems = [
    {
      id: 'dashboard' as PageView,
      label: 'Today',
      icon: LayoutDashboard,
      accent: 'text-marker-pink',
      badge: stats.urgentCount > 0 ? `${stats.urgentCount} urgent` : undefined,
      badgeColor: 'bg-marker-pink text-white',
    },
    {
      id: 'inbox' as PageView,
      label: 'Inbox',
      icon: Inbox,
      accent: 'text-ink',
      badge: stats.activeCount > 0 ? `${stats.activeCount}` : undefined,
      badgeColor: 'bg-ink text-paper-50',
    },
    {
      id: 'task' as PageView,
      label: 'Tasks',
      icon: CheckSquare,
      accent: 'text-marker-mint',
      badge: stats.countByType.task > 0 ? `${stats.countByType.task}` : undefined,
      badgeColor: 'bg-marker-mint text-white',
    },
    {
      id: 'note' as PageView,
      label: 'Notes',
      icon: FileText,
      accent: 'text-marker-orange',
      badge: stats.countByType.note > 0 ? `${stats.countByType.note}` : undefined,
      badgeColor: 'bg-marker-orange text-white',
    },
    {
      id: 'link' as PageView,
      label: 'Links',
      icon: Link2,
      accent: 'text-marker-sky',
      badge: stats.countByType.link > 0 ? `${stats.countByType.link}` : undefined,
      badgeColor: 'bg-marker-sky text-white',
    },
    {
      id: 'code' as PageView,
      label: 'Code',
      icon: Code2,
      accent: 'text-marker-purple',
      badge: stats.countByType.code > 0 ? `${stats.countByType.code}` : undefined,
      badgeColor: 'bg-marker-purple text-white',
    },
  ];

  return (
    <aside className="w-64 bg-paper-50 border-r-2 border-ink flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b-2 border-dashed border-ink/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sketch-edge bg-marker-yellow border-2 border-ink flex items-center justify-center font-marker text-ink text-sm -rotate-3">
            WP
          </div>
          <div>
            <span className="font-marker tracking-tight text-ink text-base leading-none">WorkPocket</span>
            <span className="block text-[10px] font-note text-ink-soft">your work, one pocket</span>
          </div>
        </div>

        <button
          onClick={onOpenCapture}
          className="w-8 h-8 sketch-edge bg-marker-pink hover:bg-marker-pink/90 text-white flex items-center justify-center transition-transform active:scale-90 border-2 border-ink shadow-sketch-sm"
          title="Capture item (shortcut: C)"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="text-[11px] font-note font-bold text-ink-soft px-3 mb-2">
          my notebook
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-sm font-hand transition-all border-2 ${
                isActive
                  ? 'bg-paper-200 text-ink border-ink shadow-sketch-sm -rotate-1'
                  : 'text-ink-soft border-transparent hover:border-ink/30 hover:bg-paper-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={17} className={item.accent} strokeWidth={2.2} />
                <span className="text-[15px]">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full border border-ink/20 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t-2 border-dashed border-ink/30 space-y-1">
        <button
          onClick={onResetData}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm font-hand text-ink-soft hover:text-ink hover:bg-paper-100 rounded-[10px] transition-colors"
          title="Reset to sample data"
        >
          <RotateCcw size={15} strokeWidth={2.2} />
          <span>Reset Samples</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm font-hand rounded-[10px] transition-colors border-2 ${
            currentView === 'settings'
              ? 'bg-paper-200 text-ink border-ink shadow-sketch-sm'
              : 'text-ink-soft border-transparent hover:text-ink hover:bg-paper-100'
          }`}
        >
          <Settings size={15} strokeWidth={2.2} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
