import { WorkItemType, WorkItemPriority, CreateWorkItemInput } from '../types/workItem';
import { parseNaturalDate } from './nlDate';

export interface DetectionResult {
  type: WorkItemType;
  confidence: number;
  metadata?: Record<string, string>;
}

export function detectItemType(input: string): DetectionResult {
  const trimmed = input.trim();

  // URL detection
  const urlRegex = /^(https?:\/\/[^\s]+)/i;
  if (urlRegex.test(trimmed)) {
    return {
      type: 'link',
      confidence: 0.95,
      metadata: { url: trimmed },
    };
  }

  // Code snippet detection
  const codeIndicators = [
    /^(const|let|var|function|class|import|export|def|fn|pub|package|func)\s+/m,
    /(npm\s+i|npm\s+install|yarn\s+add|pnpm\s+add|cargo\s+add|pip\s+install)\s+/i,
    /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s+/im,
    /```[\s\S]*```/,
    /[{};]{2,}/,
  ];

  if (codeIndicators.some((regex) => regex.test(trimmed))) {
    return {
      type: 'code',
      confidence: 0.85,
    };
  }

  // Task detection
  const taskIndicators = [
    /^(todo|fix|implement|prepare|review|finish|complete|call|email|submit|read)\s+/i,
    /^\[\s*[xX ]?\s*\]/,
    /\bdue\s+(by|on|tomorrow|today)\b/i,
    /\b(tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today)\b/i,
  ];

  if (taskIndicators.some((regex) => regex.test(trimmed))) {
    return {
      type: 'task',
      confidence: 0.8,
    };
  }

  // Default fallback is note
  return {
    type: 'note',
    confidence: 0.5,
  };
}

export function extractTags(content: string): string[] {
  const tagRegex = /#([\w-]+)/g;
  const matches = content.matchAll(tagRegex);
  const tags: string[] = [];
  for (const match of matches) {
    if (match[1]) tags.push(match[1].toLowerCase());
  }
  return Array.from(new Set(tags));
}

// ---------------------------------------------------------------------------
// Rule-based parser used by Smart Capture as a fallback when AI is unavailable.
// Produces exactly one WorkItemDraft from freeform text with type detection,
// title, priority hints, due-date extraction, and tags.
// ---------------------------------------------------------------------------

export type WorkItemDraft = CreateWorkItemInput & { type: WorkItemType };

const PRIORITY_HIGH_HINTS = /\b(urgent|asap|high\s*priority|critical|important|immediately)\b/i;
const PRIORITY_LOW_HINTS = /\b(low\s*priority|whenever|someday|no\s*rush)\b/i;

function deriveTitle(text: string, type: WorkItemType): string {
  const firstLine = text.split(/\r?\n/)[0].trim();
  const base = firstLine || text.trim();

  if (type === 'link') {
    return base.length > 80 ? base.slice(0, 77) + '...' : base;
  }

  // Strip trailing date phrases for a cleaner task title.
  let title = base
    .replace(/\b(by|due|before|on|at)\b.*$/i, (m) =>
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|tonight|\d)/i.test(m)
        ? ''
        : m
    )
    .trim();

  if (!title) title = base;
  return title.length > 80 ? title.slice(0, 77) + '...' : title;
}

function derivePriority(text: string): WorkItemPriority {
  if (PRIORITY_HIGH_HINTS.test(text)) return 'high';
  if (PRIORITY_LOW_HINTS.test(text)) return 'low';
  return 'medium';
}

export function ruleParse(
  text: string,
  forcedType?: WorkItemType,
  now: Date = new Date()
): WorkItemDraft[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const detection = detectItemType(trimmed);
  const type = forcedType ?? detection.type;

  const title = deriveTitle(trimmed, type) || trimmed.slice(0, 80);
  const priority = derivePriority(trimmed);
  const dueDate = type === 'task' ? parseNaturalDate(trimmed, now) : parseNaturalDate(trimmed, now);
  const tags = extractTags(trimmed);

  const metadata: Record<string, string> = { source: 'smart-capture-rule' };
  if (type === 'link') {
    const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)/i);
    if (urlMatch) metadata.url = urlMatch[0];
  } else if (detection.metadata?.url) {
    metadata.url = detection.metadata.url;
  }

  const draft: WorkItemDraft = {
    title,
    content: trimmed,
    type,
    priority,
    tags,
    metadata,
  };
  if (dueDate) draft.dueDate = dueDate;

  return [draft];
}
