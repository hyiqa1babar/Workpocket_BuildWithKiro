import React, { useState } from 'react';
import {
  Check,
  Trash2,
  Edit2,
  ExternalLink,
  Copy,
  Calendar,
  Clock,
  Tag,
} from 'lucide-react';
import { WorkItem, UpdateWorkItemInput } from '../../types/workItem';
import { WorkItemTypeIcon, WORK_ITEM_CONFIG } from './WorkItemTypeIcon';
import { formatRelativeDate, isDueToday, isOverdue } from '../../utils/dateUtils';

interface WorkItemCardProps {
  item: WorkItem;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: UpdateWorkItemInput) => void;
}

export const WorkItemCard: React.FC<WorkItemCardProps> = ({
  item,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);

  const typeConfig = WORK_ITEM_CONFIG[item.type] || WORK_ITEM_CONFIG.note;
  const isCompleted = item.status === 'completed';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    if (onUpdate && editTitle.trim()) {
      onUpdate(item.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
    }
    setIsEditing(false);
  };

  const priorityColor = {
    high: 'text-marker-pink bg-marker-pink/12 border-marker-pink/40',
    medium: 'text-marker-orange bg-marker-orange/12 border-marker-orange/40',
    low: 'text-marker-mint bg-marker-mint/12 border-marker-mint/40',
  }[item.priority];

  const dueToday = isDueToday(item.dueDate);
  const overdue = isOverdue(item.dueDate) && !dueToday && !isCompleted;

  return (
    <div
      className={`group relative sketch-card p-4 transition-transform duration-200 hover:-rotate-1 hover:-translate-y-0.5 ${
        isCompleted ? 'opacity-55' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox complete toggle */}
        <button
          type="button"
          onClick={() => onToggleComplete?.(item.id)}
          className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center border-2 border-ink transition-all shrink-0 ${
            isCompleted
              ? 'bg-marker-mint text-white'
              : 'bg-paper-50 text-transparent hover:text-ink-faint hover:bg-paper-200'
          }`}
          title={isCompleted ? 'Mark as active' : 'Mark as done'}
        >
          <Check size={14} strokeWidth={3.5} />
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2 mb-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full sketch-input px-2.5 py-1 text-sm font-hand"
                placeholder="Item title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full sketch-input px-2.5 py-1 text-xs font-note"
                placeholder="Item content"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-marker-mint text-white text-xs font-hand rounded-md border-2 border-ink shadow-sketch-sm active:scale-95"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-paper-200 text-ink text-xs font-hand rounded-md border-2 border-ink/40"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4
                  className={`text-[17px] font-hand tracking-tight ${
                    isCompleted ? 'line-through text-ink-faint' : 'text-ink'
                  }`}
                >
                  {item.title}
                </h4>

                {/* Type Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-sans font-bold rounded-full border ${typeConfig.bgBadge} ${typeConfig.textBadge} ${typeConfig.borderBadge}`}
                >
                  <WorkItemTypeIcon type={item.type} size={11} />
                  {typeConfig.label}
                </span>

                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded border ${priorityColor}`}
                >
                  {item.priority}
                </span>
              </div>

              {/* Item Content by Type */}
              {item.type === 'code' ? (
                <div className="relative mt-2.5 bg-ink text-marker-mint border-2 border-ink rounded-[10px] p-3 font-mono text-xs overflow-x-auto shadow-sketch-sm">
                  <div className="absolute top-2 right-2 flex items-center">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.content)}
                      className="p-1 rounded bg-paper-50/10 hover:bg-paper-50/20 text-paper-200 transition-colors"
                      title="Copy snippet"
                    >
                      {isCopied ? <Check size={13} className="text-marker-mint" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <pre className="whitespace-pre">{item.content}</pre>
                </div>
              ) : item.type === 'link' ? (
                <div className="mt-2 text-sm font-note">
                  <a
                    href={item.metadata?.url || item.content}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-marker-sky hover:underline break-all"
                  >
                    <span>{item.metadata?.url || item.content}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                </div>
              ) : (
                item.content && (
                  <p className="mt-1.5 text-sm font-note text-ink-soft leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {item.content}
                  </p>
                )
              )}

              {/* Metadata row */}
              <div className="flex items-center gap-3 flex-wrap mt-3 text-[11px] text-ink-faint">
                {item.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 font-sans font-bold ${
                      dueToday ? 'text-marker-orange' : overdue ? 'text-marker-pink' : 'text-ink-soft'
                    }`}
                  >
                    <Calendar size={12} />
                    <span>
                      {dueToday ? 'Due Today' : overdue ? `Overdue (${formatRelativeDate(item.dueDate)})` : `Due ${formatRelativeDate(item.dueDate)}`}
                    </span>
                  </span>
                )}

                {item.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag size={11} className="text-ink-faint" />
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-marker-yellow/40 text-ink text-[10px] font-note rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <span className="inline-flex items-center gap-1 text-ink-faint ml-auto font-sans">
                  <Clock size={11} />
                  {formatRelativeDate(item.createdAt)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hover Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-md hover:bg-marker-sky/15 text-ink-soft hover:text-marker-sky transition-colors"
              title="Edit item"
            >
              <Edit2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              className="p-1.5 rounded-md hover:bg-marker-pink/15 text-ink-soft hover:text-marker-pink transition-colors"
              title="Delete item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
