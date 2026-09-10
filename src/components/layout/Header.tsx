import React, { useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';
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
    <header className="h-16 border-b-2 border-dashed border-ink/30 bg-paper-100/80 backdrop-blur-sm sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search size={17} className="absolute left-3.5 text-ink-soft pointer-events-none" strokeWidth={2.4} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your scribbles, tags, snippets... (press /)"
            className="w-full sketch-input pl-10 pr-16 py-2 text-sm font-hand"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 text-ink-soft hover:text-marker-pink"
            >
              <X size={15} strokeWidth={2.6} />
            </button>
          ) : (
            <div className="absolute right-3 flex items-center gap-1 text-[11px] font-mono text-ink-soft bg-paper-200 px-1.5 py-0.5 rounded border border-ink/25 pointer-events-none">
              /
            </div>
          )}
        </div>
      </div>

      {/* Filter and Capture Controls */}
      <div className="flex items-center gap-2.5">
        {/* Status Filter pill */}
        <div className="hidden sm:flex items-center p-1 bg-paper-50 border-2 border-ink rounded-[10px] text-xs shadow-sketch-sm">
          {(['all', 'active', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-2.5 py-1 rounded-md capitalize font-hand text-[13px] transition-all ${
                statusFilter === st
                  ? 'bg-marker-yellow text-ink'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Capture CTA */}
        <button
          onClick={onOpenCapture}
          className="flex items-center gap-1.5 bg-marker-pink hover:bg-marker-pink/90 text-white font-hand text-sm px-3.5 py-2 rounded-[10px] border-2 border-ink shadow-sketch-sm active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          <span className="hidden sm:inline">Capture</span>
        </button>
      </div>
    </header>
  );
};
