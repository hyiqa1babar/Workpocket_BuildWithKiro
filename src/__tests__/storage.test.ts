import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storage';
import { WorkItem } from '../types/workItem';

beforeEach(() => localStorage.clear());

function make(over: Partial<WorkItem> = {}): any {
  return { title: 't', content: 'c', type: 'task', priority: 'medium', tags: [], ...over };
}

describe('storageService', () => {
  it('first launch seeds sample data', () => {
    const items = storageService.getItems();
    expect(items.length).toBeGreaterThan(0);
  });

  it('Property 1: addItem sets id, timestamps, active status', () => {
    localStorage.clear();
    const created = storageService.addItem(make({ title: 'New' }));
    expect(created.id).toBeTruthy();
    expect(created.status).toBe('active');
    expect(new Date(created.createdAt).toString()).not.toBe('Invalid Date');
  });

  it('Property 10: new items appear first', () => {
    localStorage.clear();
    storageService.getItems();
    storageService.addItem(make({ title: 'first' }));
    const second = storageService.addItem(make({ title: 'second' }));
    expect(storageService.getItems()[0].id).toBe(second.id);
  });

  it('Property 4 + 5: update preserves identity; absent id fails', () => {
    localStorage.clear();
    storageService.getItems();
    const c = storageService.addItem(make({ title: 'orig' }));
    const u = storageService.updateItem(c.id, { title: 'edited' });
    expect(u?.title).toBe('edited');
    expect(u?.id).toBe(c.id);
    expect(u?.createdAt).toBe(c.createdAt);
    expect(storageService.updateItem('nope', { title: 'x' })).toBeNull();
  });

  it('Property 6: delete removes matching; absent id is no-op', () => {
    localStorage.clear();
    storageService.getItems();
    const c = storageService.addItem(make());
    expect(storageService.deleteItem(c.id)).toBe(true);
    expect(storageService.deleteItem('nope')).toBe(false);
  });

  it('Property 7: toggleComplete round-trips', () => {
    localStorage.clear();
    storageService.getItems();
    const c = storageService.addItem(make());
    const done = storageService.toggleComplete(c.id);
    expect(done?.status).toBe('completed');
    const back = storageService.toggleComplete(c.id);
    expect(back?.status).toBe('active');
  });

  it('Property 13: persistence round-trip', () => {
    localStorage.clear();
    storageService.getItems();
    const c = storageService.addItem(make({ title: 'persist' }));
    expect(storageService.getItems().find((i) => i.id === c.id)).toBeTruthy();
  });
});
