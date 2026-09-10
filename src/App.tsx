import { useState, useMemo } from 'react';
import { useWorkItems } from './hooks/useWorkItems';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { AppLayout } from './components/layout/AppLayout';
import { PageView } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Inbox } from './pages/Inbox';
import { Tasks } from './pages/Tasks';
import { Notes } from './pages/Notes';
import { Links } from './pages/Links';
import { CodeSnippets } from './pages/CodeSnippets';
import { WorkItemList } from './components/items/WorkItemList';
import { CaptureModal } from './components/capture/CaptureModal';
import { WorkItemType } from './types/workItem';
import { File, Database, Download, RotateCcw } from 'lucide-react';
import { Button } from './components/ui/Button';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('dashboard');
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [captureDefaultType, setCaptureDefaultType] = useState<WorkItemType>('task');

  const {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete,
    resetToSampleData,
    stats,
  } = useWorkItems();

  // Keyboard shortcut: 'c' opens capture modal (when not typing in an input)
  useKeyboardShortcut({ key: 'c' }, () => {
    openCapture('task');
  });

  // Keyboard shortcut: 'Ctrl+k' focuses search or opens capture
  useKeyboardShortcut({ key: 'k', ctrlKey: true }, () => {
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  // Keyboard shortcut: '/' focuses search
  useKeyboardShortcut({ key: '/' }, () => {
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  const openCapture = (type: WorkItemType = 'task') => {
    setCaptureDefaultType(type);
    setIsCaptureOpen(true);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workpocket-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Content to render depending on current page view
  const currentContent = useMemo(() => {
    // If a search query is typed, show the matching search results view
    if (searchQuery.trim()) {
      return (
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">
              Search results for "{searchQuery}"
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Found {filteredItems.length} matching work items
            </p>
          </div>
          <WorkItemList
            items={filteredItems}
            onToggleComplete={toggleComplete}
            onDelete={deleteItem}
            onUpdate={updateItem}
            emptyTitle="No results found"
            emptyDescription={`No items match "${searchQuery}". Try a different keyword or tag.`}
          />
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            items={items}
            onToggleComplete={toggleComplete}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onOpenCapture={() => openCapture('task')}
            stats={stats}
          />
        );

      case 'inbox':
        return (
          <Inbox
            items={items.filter((i) => i.status === 'active')}
            onToggleComplete={toggleComplete}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onOpenCapture={() => openCapture('note')}
          />
        );

      case 'task':
        return (
          <Tasks
            items={items}
            onToggleComplete={toggleComplete}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onOpenCapture={() => openCapture('task')}
          />
        );

      case 'note':
        return (
          <Notes
            items={items}
            onToggleComplete={toggleComplete}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onOpenCapture={() => openCapture('note')}
          />
        );

      case 'link':
        return (
          <Links
            items={items}
            onToggleComplete={toggleComplete}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onOpenCapture={() => openCapture('link')}
          />
        );

      case 'code':
        return (
          <CodeSnippets
            items={items}
            onToggleComplete={toggleComplete}
            onDelete={deleteItem}
            onUpdate={updateItem}
            onOpenCapture={() => openCapture('code')}
          />
        );

      case 'file':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <File size={20} className="text-purple-400" />
                  <span>Files & Documents</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Tracked PDFs, syllabi, assets, and project files.
                </p>
              </div>
              <Button onClick={() => openCapture('file')} size="sm">
                Add File
              </Button>
            </div>
            <WorkItemList
              items={items.filter((i) => i.type === 'file')}
              onToggleComplete={toggleComplete}
              onDelete={deleteItem}
              onUpdate={updateItem}
              emptyTitle="No tracked files"
              emptyDescription="Save references to local PDFs, project specs, and cheat sheets."
              emptyIcon={File}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl font-bold text-white">WorkPocket Settings</h1>
              <p className="text-xs text-slate-400 mt-1">
                Data persistence, export options, and command center status.
              </p>
            </div>

            <div className="space-y-4">
              {/* Storage Info Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Database size={18} className="text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">Local Browser Storage</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All work items are stored locally in your browser via localStorage. Zero telemetry, zero external database calls.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total WorkItems stored:</span>
                  <span className="text-xs font-mono font-bold text-sky-400">{items.length} items</span>
                </div>
              </div>

              {/* Data Actions */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Data Management</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleExportJSON}
                    icon={<Download size={14} />}
                  >
                    Export Items JSON
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={resetToSampleData}
                    icon={<RotateCcw size={14} />}
                  >
                    Reset to Default Sample Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [
    currentView,
    searchQuery,
    filteredItems,
    items,
    stats,
    toggleComplete,
    deleteItem,
    updateItem,
    resetToSampleData,
  ]);

  return (
    <AppLayout
      currentView={currentView}
      onNavigate={(view) => {
        setSearchQuery('');
        setCurrentView(view);
      }}
      onOpenCapture={() => openCapture('task')}
      onResetData={resetToSampleData}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      stats={stats}
    >
      {currentContent}

      {/* Reusable Capture Modal */}
      <CaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onSave={addItem}
        defaultType={captureDefaultType}
      />
    </AppLayout>
  );
}
