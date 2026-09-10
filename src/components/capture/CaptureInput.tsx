import React, { useState } from 'react';
import { WorkItemType, WorkItemPriority, CreateWorkItemInput } from '../../types/workItem';
import { CaptureTypeSelector } from './CaptureTypeSelector';
import { detectItemType, extractTags } from '../../utils/categorization';
import { Sparkles, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface CaptureInputProps {
  onSave: (item: CreateWorkItemInput) => void;
  onCancel?: () => void;
  defaultType?: WorkItemType;
  isModal?: boolean;
}

export const CaptureInput: React.FC<CaptureInputProps> = ({
  onSave,
  onCancel,
  defaultType = 'task',
  isModal = false,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<WorkItemType>(defaultType);
  const [hasManuallySelectedType, setHasManuallySelectedType] = useState(false);
  const [priority, setPriority] = useState<WorkItemPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // Dynamic intelligent detection when typing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);

    if (!hasManuallySelectedType && val.length > 2) {
      const detected = detectItemType(val);
      if (detected.confidence > 0.7) {
        setType(detected.type);
      }
    }
  };

  const handleTypeSelect = (selected: WorkItemType) => {
    setType(selected);
    setHasManuallySelectedType(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Combine manual tags and tags extracted from content/title
    const extracted = extractTags(title + ' ' + content);
    const manualTags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);
    const allTags = Array.from(new Set([...extracted, ...manualTags]));

    // Construct metadata
    const metadata: Record<string, string> = {};
    if (type === 'link') {
      const urlMatch = (content || title).match(/(https?:\/\/[^\s]+)/i);
      if (urlMatch) metadata.url = urlMatch[0];
    } else if (type === 'file') {
      metadata.fileName = title;
      metadata.fileType = 'document';
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      type,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      tags: allTags,
      metadata,
    });

    // Reset fields
    setTitle('');
    setContent('');
    setTagInput('');
    setDueDate('');
    setPriority('medium');
    setHasManuallySelectedType(false);
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'task':
        return 'What task needs to be done? e.g. Finish DBMS assignment';
      case 'note':
        return 'Note title or main takeaway...';
      case 'link':
        return 'Link title or paste URL directly...';
      case 'code':
        return 'Snippet description or command... e.g. Docker run postgres';
      case 'file':
        return 'File name or reference...';
      default:
        return 'What do you want to save?';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Selector matching the prompt mockup */}
      <CaptureTypeSelector
        selectedType={type}
        onSelectType={handleTypeSelect}
      />

      {/* Main input: "What do you want to save?" */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder={getPlaceholder()}
            autoFocus
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-inner"
          />
          {!hasManuallySelectedType && title.length > 2 && (
            <div className="absolute right-3 top-3 flex items-center gap-1 text-[11px] text-sky-400 font-mono pointer-events-none bg-slate-900/90 px-1.5 py-0.5 rounded border border-sky-500/30">
              <Sparkles size={11} />
              auto-detected
            </div>
          )}
        </div>
      </div>

      {/* Content / Detail Field */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={type === 'code' ? 4 : 2}
          placeholder={
            type === 'code'
              ? '// Paste your code snippet or command here'
              : type === 'link'
              ? 'https://example.com/useful-article'
              : 'Add details, description, or notes (optional)...'
          }
          className={`w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors ${
            type === 'code' ? 'font-mono' : ''
          }`}
        />
      </div>

      {/* Toggle options (Priority, Due Date, Tags) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{showOptions ? 'Fewer options' : 'More options (priority, due date, tags)'}</span>
        </button>

        {showOptions && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl mt-2 animate-fadeIn">
            {/* Priority */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Priority
              </label>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as WorkItemPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1 text-xs rounded uppercase font-semibold tracking-wider border transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : p === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Calendar size={12} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Tag size={12} /> Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="dev, urgent, study"
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
        {isModal && onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={!title.trim()}
          className="w-full sm:w-auto px-6"
        >
          Save
        </Button>
      </div>
    </form>
  );
};
