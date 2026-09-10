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
      badge: stats.urgentCount > 0 ? `${stats.urgentCount} urgent` : undefined,
      badgeColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    },
    {
      id: 'inbox' as PageView,
      label: 'Inbox',
      icon: Inbox,
      badge: stats.activeCount > 0 ? `${stats.activeCount}` : undefined,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'task' as PageView,
      label: 'Tasks',
      icon: CheckSquare,
      badge: stats.countByType.task > 0 ? `${stats.countByType.task}` : undefined,
      badgeColor: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      id: 'note' as PageView,
      label: 'Notes',
      icon: FileText,
      badge: stats.countByType.note > 0 ? `${stats.countByType.note}` : undefined,
      badgeColor: 'bg-amber-500/10 text-amber-400',
    },
    {
      id: 'link' as PageView,
      label: 'Links',
      icon: Link2,
      badge: stats.countByType.link > 0 ? `${stats.countByType.link}` : undefined,
      badgeColor: 'bg-sky-500/10 text-sky-400',
    },
    {
      id: 'code' as PageView,
      label: 'Code',
      icon: Code2,
      badge: stats.countByType.code > 0 ? `${stats.countByType.code}` : undefined,
      badgeColor: 'bg-indigo-500/10 text-indigo-400',
    },
  ];

  return (
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center font-bold text-white text-base shadow-sm shadow-sky-500/20">
            WP
          </div>
          <div>
            <span className="font-bold tracking-tight text-slate-100 text-sm">WORKPOCKET</span>
            <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">command center</span>
          </div>
        </div>

        {/* Quick + capture button */}
        <button
          onClick={onOpenCapture}
          className="w-7 h-7 rounded-lg bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm shadow-sky-500/30"
          title="Capture item (shortcut: C or Ctrl+N)"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Views
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800/90 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <button
          onClick={onResetData}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 rounded-lg transition-colors"
          title="Reset to sample data"
        >
          <RotateCcw size={14} />
          <span>Reset Sample Data</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors ${
            currentView === 'settings'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
          }`}
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
