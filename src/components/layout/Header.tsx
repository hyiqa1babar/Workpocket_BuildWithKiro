import React, { useRef } from 'react';
import { Search, Plus, X, Command } from 'lucide-react';
import { WorkItemStatus } from '../../types/workItem';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: WorkItemStatus | 'all';
  onStatusFilterChange: (status: WorkItemStatus | 'all') => void;
  onOpenCapture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenCapture,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items, tags, code snippets... (Press / to focus)"
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-20 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-200"
            >
              <X size={14} />
            </button>
          ) : (
            <div className="absolute right-3 flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60 pointer-events-none">
              <Command size={10} />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Capture Controls */}
      <div className="flex items-center gap-2.5">
        {/* Status Filter pill */}
        <div className="hidden sm:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {(['all', 'active', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Capture CTA */}
        <button
          onClick={onOpenCapture}
          className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs px-3.5 py-2 rounded-lg shadow-sm shadow-sky-500/20 active:scale-95 transition-all"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">Capture</span>
        </button>
      </div>
    </header>
  );
};
