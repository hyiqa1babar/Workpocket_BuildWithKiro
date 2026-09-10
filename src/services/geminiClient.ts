// Thin REST client for Google Gemini (gemini-1.5-flash).
// Sends ONLY the current capture text. Throws GeminiError on failure so
// SmartCaptureService can classify the fallback reason.

export interface ParsedItem {
  type: 'task' | 'note' | 'link' | 'code' | 'file';
  title: string;
  content?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export type GeminiErrorKind = 'network' | 'timeout' | 'http-error' | 'invalid-json';

export class GeminiError extends Error {
  constructor(public kind: GeminiErrorKind, message: string) {
    super(message);
    this.name = 'GeminiError';
  }
}

export interface GeminiClient {
  hasKey(): boolean;
  generateItems(text: string, timeoutMs: number): Promise<ParsedItem[]>;
}

const MODEL = 'gemini-1.5-flash';
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

const PROMPT = [
  'You are a capture parser for a productivity app.',
  'Convert the user text into a JSON array of work items.',
  'Each item: {"type":"task|note|link|code|file","title":string,"content":string,',
  '"dueDate":ISO8601 or omit,"priority":"low|medium|high","tags":string[]}.',
  'Split multiple distinct items into separate objects. Infer type: a URL is a link,',
  'a shell/code command is code, something with a deadline/action is a task, else a note.',
  'Extract deadlines into dueDate (ISO). Return ONLY the JSON array, no prose, no code fences.',
].join(' ');

function extractJson(raw: string): unknown {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf('[');
  const end = s.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) s = s.slice(start, end + 1);
  return JSON.parse(s);
}

export function createGeminiClient(apiKey?: string): GeminiClient {
  const key = apiKey ?? (import.meta as any).env?.VITE_GEMINI_API_KEY ?? '';

  return {
    hasKey: () => Boolean(key),

    async generateItems(text, timeoutMs) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      let res: Response;
      try {
        res = await fetch(`${ENDPOINT}/${MODEL}:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${PROMPT}\n\nUSER TEXT:\n${text}` }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
        });
      } catch (err) {
        clearTimeout(timer);
        if ((err as Error).name === 'AbortError') {
          throw new GeminiError('timeout', 'Gemini request timed out');
        }
        throw new GeminiError('network', 'Network error calling Gemini');
      }
      clearTimeout(timer);

      if (!res.ok) {
        throw new GeminiError('http-error', `Gemini HTTP ${res.status}`);
      }

      let payload: any;
      try {
        payload = await res.json();
      } catch {
        throw new GeminiError('invalid-json', 'Gemini response was not JSON');
      }

      const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof raw !== 'string') {
        throw new GeminiError('invalid-json', 'Gemini response missing text');
      }

      let parsed: unknown;
      try {
        parsed = extractJson(raw);
      } catch {
        throw new GeminiError('invalid-json', 'Could not parse Gemini JSON');
      }
      if (!Array.isArray(parsed)) {
        throw new GeminiError('invalid-json', 'Gemini did not return an array');
      }
      return parsed as ParsedItem[];
    },
  };
}
