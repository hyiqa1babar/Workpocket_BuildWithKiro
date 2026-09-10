// Groq REST client (OpenAI-compatible chat completions).
// Sends ONLY the current capture text. Throws GeminiError-compatible errors
// so SmartCaptureService can classify the fallback reason.

import { ParsedItem, GeminiError, GeminiClient } from './geminiClient';

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-20b';

const SYSTEM = [
  'You are a capture parser for a productivity app.',
  'Convert the user text into a JSON array of work items.',
  'Each item: {"type":"task|note|link|code|file","title":string,"content":string,',
  '"dueDate":ISO8601 or omit,"priority":"low|medium|high","tags":string[]}.',
  'Split multiple distinct items into separate objects. A URL is a link,',
  'a shell/code command is code, something with a deadline/action is a task, else a note.',
  'Extract deadlines into dueDate (ISO 8601). Return ONLY the JSON array, no prose, no code fences.',
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

export function createGroqClient(apiKey?: string): GeminiClient {
  const key = apiKey ?? (import.meta as any).env?.VITE_GROQ_API_KEY ?? '';

  return {
    hasKey: () => Boolean(key),

    async generateItems(text, timeoutMs) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      let res: Response;
      try {
        res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: MODEL,
            temperature: 0.2,
            messages: [
              { role: 'system', content: SYSTEM },
              { role: 'user', content: text },
            ],
          }),
        });
      } catch (err) {
        clearTimeout(timer);
        if ((err as Error).name === 'AbortError') {
          throw new GeminiError('timeout', 'Groq request timed out');
        }
        throw new GeminiError('network', 'Network error calling Groq');
      }
      clearTimeout(timer);

      if (!res.ok) throw new GeminiError('http-error', `Groq HTTP ${res.status}`);

      let payload: any;
      try {
        payload = await res.json();
      } catch {
        throw new GeminiError('invalid-json', 'Groq response was not JSON');
      }

      const raw = payload?.choices?.[0]?.message?.content;
      if (typeof raw !== 'string') {
        throw new GeminiError('invalid-json', 'Groq response missing content');
      }

      let parsed: unknown;
      try {
        parsed = extractJson(raw);
      } catch {
        throw new GeminiError('invalid-json', 'Could not parse Groq JSON');
      }
      if (!Array.isArray(parsed)) {
        throw new GeminiError('invalid-json', 'Groq did not return an array');
      }
      return parsed as ParsedItem[];
    },
  };
}
