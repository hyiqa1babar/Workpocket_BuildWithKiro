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
              <span className="flex items-center gap-1 text-marker-sky font-bold">
                <Sparkles size={13} /> Parsed by AI
              </span>
            ) : (
              <span className="flex items-center gap-1 text-marker-orange font-bold">
                <Cpu size={13} /> Parsed locally
                {fallbackReason && fallbackReason !== 'no-key' ? ' (AI unavailable)' : ''}
              </span>
            )}
          </div>
          <span className="text-[11px] font-note text-ink-faint">
            {drafts.length} item{drafts.length !== 1 ? 's' : ''} detected
          </span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {drafts.map((d, i) => (
            <div
              key={i}
              className="sketch-card p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <select
                  value={d.type}
                  onChange={(e) => updateDraft(i, { type: e.target.value as WorkItemType })}
                  className="sketch-input px-2 py-1 text-[11px] font-hand"
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
                  className="flex-1 sketch-input px-2 py-1 text-xs font-hand"
                />
                <button
                  type="button"
                  onClick={() => removeDraft(i)}
                  className="text-ink-faint hover:text-marker-pink transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-note text-ink-soft pl-1">
                <div className="flex gap-1">
                  {(['low', 'medium', 'high'] as WorkItemPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => updateDraft(i, { priority: p })}
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider border transition-all ${
                        d.priority === p
                          ? p === 'high'
                            ? 'bg-marker-pink/20 text-marker-pink border-marker-pink/50'
                            : p === 'medium'
                            ? 'bg-marker-orange/20 text-marker-orange border-marker-orange/50'
                            : 'bg-marker-mint/20 text-marker-mint border-marker-mint/50'
                          : 'bg-paper-100 border-ink/30 text-ink-faint hover:text-ink'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {d.dueDate && <span>due {formatRelativeDate(d.dueDate)}</span>}
                {d.tags && d.tags.length > 0 && (
                  <span className="text-marker-sky">{d.tags.map((t) => `#${t}`).join(' ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-dashed border-ink/30">
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
          placeholder="Dump anything... e.g. Finish OS assignment by Monday and read https://supabase.com/docs ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â npm install express #dev"
          className="w-full sketch-input px-4 py-3 text-sm font-hand"
        />
        <p className="mt-2 text-[11px] font-note text-ink-faint flex items-center gap-1">
          <Sparkles size={11} className="text-marker-sky" />
          {aiEnabled
            ? 'AI detects type, deadlines, priority and tags ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â and splits multiple items.'
            : 'Local parsing detects type, deadlines and tags. Add a Gemini key for AI splitting.'}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-dashed border-ink/30">
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
