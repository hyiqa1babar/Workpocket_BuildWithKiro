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
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  }[item.priority];

  const dueToday = isDueToday(item.dueDate);
  const overdue = isOverdue(item.dueDate) && !dueToday && !isCompleted;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 p-4 ${
        isCompleted
          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/20'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox for tasks or any item complete toggle */}
        <button
          type="button"
          onClick={() => onToggleComplete?.(item.id)}
          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-700 hover:border-slate-500 bg-slate-800/60 text-transparent hover:text-slate-400'
          }`}
          title={isCompleted ? 'Mark as active' : 'Mark as completed'}
        >
          <Check size={13} strokeWidth={3} />
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2 mb-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                placeholder="Item title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                placeholder="Item content"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4
                  className={`text-sm font-semibold tracking-tight ${
                    isCompleted
                      ? 'line-through text-slate-500'
                      : 'text-slate-100'
                  }`}
                >
                  {item.title}
                </h4>

                {/* Type Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border ${typeConfig.bgBadge} ${typeConfig.textBadge} ${typeConfig.borderBadge}`}
                >
                  <WorkItemTypeIcon type={item.type} size={11} />
                  {typeConfig.label}
                </span>

                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${priorityColor}`}
                >
                  {item.priority}
                </span>
              </div>

              {/* Item Content Rendering Based on Type */}
              {item.type === 'code' ? (
                <div className="relative mt-2.5 bg-[#070a12] border border-slate-800/80 rounded-lg p-3 font-mono text-xs text-emerald-300/90 overflow-x-auto">
                  <div className="absolute top-2 right-2 flex items-center">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.content)}
                      className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy snippet"
                    >
                      {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <pre className="whitespace-pre">{item.content}</pre>
                </div>
              ) : item.type === 'link' ? (
                <div className="mt-2 text-xs">
                  <a
                    href={item.metadata?.url || item.content}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline break-all"
                  >
                    <span>{item.metadata?.url || item.content}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                </div>
              ) : (
                item.content && (
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                    {item.content}
                  </p>
                )
              )}

              {/* Metadata row: Due date, tags, timestamp */}
              <div className="flex items-center gap-3 flex-wrap mt-3 text-[11px] text-slate-500">
                {item.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      dueToday
                        ? 'text-amber-400'
                        : overdue
                        ? 'text-rose-400'
                        : 'text-slate-400'
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
                    <Tag size={11} className="text-slate-500" />
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 text-[10px] rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <span className="inline-flex items-center gap-1 text-slate-500 ml-auto">
                  <Clock size={11} />
                  {formatRelativeDate(item.createdAt)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hover Action Buttons */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Edit item"
            >
              <Edit2 size={13} />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
              title="Delete item"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
