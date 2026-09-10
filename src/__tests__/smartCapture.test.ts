import { describe, it, expect, vi } from 'vitest';
import { createSmartCaptureService } from '../services/smartCapture';
import { GeminiClient, GeminiError, ParsedItem } from '../services/geminiClient';

function mockClient(over: Partial<GeminiClient>): GeminiClient {
  return { hasKey: () => true, generateItems: async () => [], ...over };
}

describe('SmartCaptureService', () => {
  it('Property 21: uses AI when configured and successful', async () => {
    const items: ParsedItem[] = [
      { type: 'task', title: 'Finish OS assignment', dueDate: '2026-09-14', priority: 'high', tags: [] },
    ];
    const svc = createSmartCaptureService({ gemini: mockClient({ generateItems: async () => items }) });
    const res = await svc.parse('finish OS assignment monday urgent');
    expect(res.source).toBe('ai');
    expect(res.drafts[0].title).toBe('Finish OS assignment');
    expect(res.drafts[0].priority).toBe('high');
  });

  it('Property 20: multi-item response normalizes independently', async () => {
    const items: ParsedItem[] = [
      { type: 'task', title: 'Finish OS assignment', priority: 'high' },
      { type: 'link', title: 'GitHub pipe repo', content: 'https://github.com/x/pipe' },
    ];
    const svc = createSmartCaptureService({ gemini: mockClient({ generateItems: async () => items }) });
    const res = await svc.parse('two things');
    expect(res.drafts).toHaveLength(2);
    expect(res.drafts[0].type).toBe('task');
    expect(res.drafts[1].type).toBe('link');
    expect(res.drafts[1].metadata?.url).toBe('https://github.com/x/pipe');
  });

  it('Property 22: any AI failure falls back to rule parser', async () => {
    for (const kind of ['network', 'timeout', 'http-error', 'invalid-json'] as const) {
      const svc = createSmartCaptureService({
        gemini: mockClient({
          generateItems: async () => {
            throw new GeminiError(kind, kind);
          },
        }),
      });
      const res = await svc.parse('Fix login bug urgent');
      expect(res.source).toBe('rule');
      expect(res.fallbackReason).toBe(kind);
      expect(res.drafts.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('invalid AI array (no valid titles) falls back', async () => {
    const svc = createSmartCaptureService({
      gemini: mockClient({ generateItems: async () => [{ type: 'note', title: '' } as ParsedItem] }),
    });
    const res = await svc.parse('something');
    expect(res.source).toBe('rule');
    expect(res.fallbackReason).toBe('invalid-json');
  });

  it('Property 24: no key => no network call, rule source', async () => {
    const gen = vi.fn();
    const svc = createSmartCaptureService({ gemini: mockClient({ hasKey: () => false, generateItems: gen as any }) });
    const res = await svc.parse('plain note');
    expect(res.source).toBe('rule');
    expect(res.fallbackReason).toBe('no-key');
    expect(gen).not.toHaveBeenCalled();
  });

  it('Property 23: only capture text is sent to AI', async () => {
    let received = '';
    const svc = createSmartCaptureService({
      gemini: mockClient({
        generateItems: async (text) => {
          received = text;
          return [{ type: 'note', title: 'x' }];
        },
      }),
    });
    await svc.parse('SECRET_CAPTURE_TEXT');
    expect(received).toBe('SECRET_CAPTURE_TEXT');
  });

  it('empty input yields no drafts', async () => {
    const svc = createSmartCaptureService({ gemini: mockClient({}) });
    const res = await svc.parse('   ');
    expect(res.drafts).toEqual([]);
  });

  it('forcedType applies to AI drafts', async () => {
    const svc = createSmartCaptureService({
      gemini: mockClient({ generateItems: async () => [{ type: 'task', title: 'x' }] }),
    });
    const res = await svc.parse('x', { forcedType: 'note' });
    expect(res.drafts[0].type).toBe('note');
  });
});
