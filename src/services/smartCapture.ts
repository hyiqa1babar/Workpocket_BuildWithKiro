// Smart Capture orchestrator: AI-first parsing with rule-based fallback.
// Never throws for expected failures; always yields >=1 draft for non-empty input.

import { WorkItemType, WorkItemPriority } from '../types/workItem';
import { ruleParse, extractTags, WorkItemDraft } from '../utils/categorization';
import { GeminiClient, ParsedItem, createGeminiClient } from './geminiClient';
import { createGroqClient } from './groqClient';

// Provider auto-selection: prefer Groq when its key is set, else Gemini.
function resolveClient(): GeminiClient {
  const groq = createGroqClient();
  if (groq.hasKey()) return groq;
  return createGeminiClient();
}

export type ParseSource = 'ai' | 'rule';
export type FallbackReason = 'no-key' | 'network' | 'timeout' | 'http-error' | 'invalid-json';

export interface SmartParseResult {
  drafts: WorkItemDraft[];
  source: ParseSource;
  fallbackReason?: FallbackReason;
}

export interface SmartCaptureOptions {
  forcedType?: WorkItemType;
  timeoutMs?: number;
}

export interface SmartCaptureService {
  isAiEnabled(): boolean;
  parse(text: string, options?: SmartCaptureOptions): Promise<SmartParseResult>;
}

const VALID_TYPES: WorkItemType[] = ['task', 'note', 'link', 'code', 'file'];
const VALID_PRIORITIES: WorkItemPriority[] = ['low', 'medium', 'high'];

function normalize(item: ParsedItem, forcedType?: WorkItemType): WorkItemDraft | null {
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  if (!title) return null;

  const detectedType =
    item.type && VALID_TYPES.includes(item.type as WorkItemType)
      ? (item.type as WorkItemType)
      : 'note';
  const type = forcedType ?? detectedType;

  const priority: WorkItemPriority =
    item.priority && VALID_PRIORITIES.includes(item.priority as WorkItemPriority)
      ? (item.priority as WorkItemPriority)
      : 'medium';

  let dueDate: string | undefined;
  if (item.dueDate) {
    const d = new Date(item.dueDate);
    if (!isNaN(d.getTime())) dueDate = d.toISOString();
  }

  const content = typeof item.content === 'string' ? item.content : title;
  const aiTags = Array.isArray(item.tags)
    ? item.tags.filter((t) => typeof t === 'string').map((t) => t.toLowerCase())
    : [];
  const tags = Array.from(new Set([...aiTags, ...extractTags(`${title} ${content}`)]));

  const metadata: Record<string, string> = { source: 'smart-capture-ai' };
  if (type === 'link') {
    const urlMatch = `${title} ${content}`.match(/(https?:\/\/[^\s]+)/i);
    if (urlMatch) metadata.url = urlMatch[0];
  }

  const draft: WorkItemDraft = { title, content, type, priority, tags, metadata };
  if (dueDate) draft.dueDate = dueDate;
  return draft;
}

export function createSmartCaptureService(deps?: {
  gemini?: GeminiClient;
  ruleParse?: (text: string, forcedType?: WorkItemType) => WorkItemDraft[];
}): SmartCaptureService {
  const gemini = deps?.gemini ?? resolveClient();
  const rule = deps?.ruleParse ?? ((t, f) => ruleParse(t, f));

  const fallback = (text: string, reason: FallbackReason, forcedType?: WorkItemType): SmartParseResult => ({
    drafts: rule(text, forcedType),
    source: 'rule',
    fallbackReason: reason,
  });

  return {
    isAiEnabled: () => gemini.hasKey(),

    async parse(text, options = {}) {
      const trimmed = text.trim();
      if (!trimmed) return { drafts: [], source: 'rule' };

      const { forcedType, timeoutMs = 8000 } = options;

      if (!gemini.hasKey()) return fallback(trimmed, 'no-key', forcedType);

      let items: ParsedItem[];
      try {
        items = await gemini.generateItems(trimmed, timeoutMs);
      } catch (err: any) {
        const kind = (err?.kind as FallbackReason) ?? 'network';
        return fallback(trimmed, kind, forcedType);
      }

      const drafts = items
        .map((it) => normalize(it, forcedType))
        .filter((d): d is WorkItemDraft => d !== null);

      if (drafts.length === 0) return fallback(trimmed, 'invalid-json', forcedType);
      return { drafts, source: 'ai' };
    },
  };
}
