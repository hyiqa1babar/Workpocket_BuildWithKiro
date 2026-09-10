import { WorkItemType } from '../types/workItem';

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
    /due\s+(by|on|tomorrow|today)/i,
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
