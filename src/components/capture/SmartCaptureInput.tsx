import React, { useMemo, useState } from 'react';
import { CreateWorkItemInput, WorkItemType, WorkItemPriority } from '../../types/workItem';
import { WorkItemDraft } from '../../utils/categorization';
import {
  createSmartCaptureService,
  ParseSource,
  FallbackReason,
} from '../../services/smartCapture';
import { WorkItemTypeIcon } from '../items/WorkItemTypeIcon';
import { Button } from '../ui/Button';
import { Sparkles, Cpu, Wand2, Trash2 } from 'lucide-react';
import { formatRelativeDate } from '../../utils/dateUtils';

interface SmartCaptureInputProps {
  onSave: (items: CreateWorkItemInput[]) => void;
  onCancel?: () => void;
}

const TYPES: WorkItemType[] = ['task', 'note', 'link', 'code', 'file'];

export const SmartCaptureInput: React.FC<SmartCaptureInputProps> = ({ onSave, onCancel }) => {
  const service = useMemo(() => createSmartCaptureService(), []);
  const [text, setText] = useState('');
  const [drafts, setDrafts] = useState<WorkItemDraft[] | null>(null);
  const [source, setSource] = useState<ParseSource>('rule');
  const [fallbackReason, setFallbackReason] = useState<FallbackReason | undefined>();
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const result = await service.parse(text);
    setDrafts(result.drafts);
    setSource(result.source);
    setFallbackReason(result.fallbackReason);
    setLoading(false);
  };

  const updateDraft = (idx: number, patch: Partial<WorkItemDraft>) => {
    setDrafts((prev) =>
      prev ? prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)) : prev
    );
  };

  const removeDraft = (idx: number) => {
    setDrafts((prev) => (prev ? prev.filter((_, i) => i !== idx) : prev));
  };

  const handleConfirm = () => {
    if (!drafts || drafts.length === 0) return;
    onSave(drafts);
  };

  const aiEnabled = service.isAiEnabled();

  // Review step
  if (drafts) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            {source === 'ai' ? (
              <span className="flex items-center gap-1 text-sky-400 font-medium">
                <Sparkles size={13} /> Parsed by AI
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Cpu size={13} /> Parsed locally
                {fallbackReason && fallbackReason !== 'no-key' ? ' (AI unavailable)' : ''}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500">
            {drafts.length} item{drafts.length !== 1 ? 's' : ''} detected
          </span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {drafts.map((d, i) => (
            <div
              key={i}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <select
                  value={d.type}
                  onChange={(e) => updateDraft(i, { type: e.target.value as WorkItemType })}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <WorkItemTypeIcon type={d.type} size={14} />
                <input
                  value={d.title}
                  onChange={(e) => updateDraft(i, { title: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => removeDraft(i)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pl-1">
                <div className="flex gap-1">
                  {(['low', 'medium', 'high'] as WorkItemPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => updateDraft(i, { priority: p })}
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider border transition-all ${
                        d.priority === p
                          ? p === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                            : p === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {d.dueDate && <span>due {formatRelativeDate(d.dueDate)}</span>}
                {d.tags && d.tags.length > 0 && (
                  <span className="text-sky-400">{d.tags.map((t) => `#${t}`).join(' ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
          <Button type="button" variant="ghost" onClick={() => setDrafts(null)}>
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={drafts.length === 0}
            className="px-6"
          >
            Save {drafts.length > 1 ? `${drafts.length} items` : 'item'}
          </Button>
        </div>
      </div>
    );
  }

  // Input step
  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          rows={4}
          placeholder="Dump anything... e.g. Finish OS assignment by Monday and read https://supabase.com/docs â€” npm install express #dev"
          className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-inner"
        />
        <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Sparkles size={11} className="text-sky-400" />
          {aiEnabled
            ? 'AI detects type, deadlines, priority and tags â€” and splits multiple items.'
            : 'Local parsing detects type, deadlines and tags. Add a Gemini key for AI splitting.'}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={handleParse}
          disabled={!text.trim() || loading}
          icon={<Wand2 size={14} />}
          className="px-6"
        >
          {loading ? 'Parsing...' : 'Parse'}
        </Button>
      </div>
    </div>
  );
};
