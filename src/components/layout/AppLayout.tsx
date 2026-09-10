import React from 'react';
import { Sidebar, PageView } from './Sidebar';
import { Header } from './Header';
import { WorkItemStatus, WorkItemType } from '../../types/workItem';

interface AppLayoutProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onOpenCapture: () => void;
  onResetData: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: WorkItemStatus | 'all';
  onStatusFilterChange: (status: WorkItemStatus | 'all') => void;
  stats: {
    total: number;
    activeCount: number;
    urgentCount: number;
    countByType: Record<WorkItemType, number>;
  };
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  onNavigate,
  onOpenCapture,
  onResetData,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stats,
  children,
}) => {
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenCapture={onOpenCapture}
        onResetData={onResetData}
        stats={stats}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          onOpenCapture={onOpenCapture}
        />
        <main className="flex-1 px-6 py-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
