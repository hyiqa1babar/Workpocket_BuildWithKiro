import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { ruleParse, detectItemType, extractTags } from '../utils/categorization';

const NOW = new Date('2026-09-10T09:00:00Z'); // Thursday

describe('rule-based parser', () => {
  it('Property 15: detects link, code, task, note by input class', () => {
    expect(detectItemType('https://github.com/x/y').type).toBe('link');
    expect(detectItemType('npm install express').type).toBe('code');
    expect(detectItemType('Submit AI assignment Friday').type).toBe('task');
    expect(detectItemType('random musings about life').type).toBe('note');
  });

  it('link detection stores url metadata', () => {
    const [d] = ruleParse('https://supabase.com/docs', undefined, NOW);
    expect(d.type).toBe('link');
    expect(d.metadata?.url).toBe('https://supabase.com/docs');
  });

  it('Property 18: priority hints map to high', () => {
    const [d] = ruleParse('Fix login bug urgent', undefined, NOW);
    expect(d.priority).toBe('high');
  });

  it('Property 8: extracts ISO due date, omits when absent', () => {
    const [withDate] = ruleParse('Finish OS assignment by Monday', undefined, NOW);
    expect(withDate.dueDate).toBeDefined();
    expect(new Date(withDate.dueDate as string).getDay()).toBe(1); // Monday
    const [noDate] = ruleParse('Just a plain note', undefined, NOW);
    expect(noDate.dueDate).toBeUndefined();
  });

  it('tomorrow resolves to next day', () => {
    const [d] = ruleParse('Call advisor tomorrow', undefined, NOW);
    expect(new Date(d.dueDate as string).getDate()).toBe(11);
  });

  it('Property 9: tags trimmed, de-duplicated, lowercased', () => {
    expect(extractTags('learn #Dev #dev #Study')).toEqual(['dev', 'study']);
  });

  it('Property 17 + 19: exactly one draft, non-empty title', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0), (s) => {
        const drafts = ruleParse(s, undefined, NOW);
        expect(drafts.length).toBe(1);
        expect(drafts[0].title.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 16: forcedType overrides detection', () => {
    const [d] = ruleParse('https://example.com', 'note', NOW);
    expect(d.type).toBe('note');
  });

  it('empty input yields no drafts', () => {
    expect(ruleParse('   ', undefined, NOW)).toEqual([]);
  });
});
