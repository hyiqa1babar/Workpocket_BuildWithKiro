import { WorkItem, CreateWorkItemInput, UpdateWorkItemInput } from '../types/workItem';
import { INITIAL_SAMPLE_ITEMS } from '../data/sampleData';

const STORAGE_KEY = 'workpocket_items_v1';

export const storageService = {
  getItems(): WorkItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // First launch: initialize with sample data
        this.saveItems(INITIAL_SAMPLE_ITEMS);
        return INITIAL_SAMPLE_ITEMS;
      }
      return JSON.parse(data) as WorkItem[];
    } catch (error) {
      console.error('Failed to read from localStorage', error);
      return INITIAL_SAMPLE_ITEMS;
    }
  },

  saveItems(items: WorkItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save to localStorage', error);
    }
  },

  addItem(input: CreateWorkItemInput): WorkItem {
    const items = this.getItems();
    const now = new Date().toISOString();
    const newItem: WorkItem = {
      ...input,
      id: 'wp-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      status: input.status || 'active',
      createdAt: now,
      updatedAt: now,
      tags: input.tags || [],
    };
    const updatedItems = [newItem, ...items];
    this.saveItems(updatedItems);
    return newItem;
  },

  updateItem(id: string, updates: UpdateWorkItemInput): WorkItem | null {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const updatedItem: WorkItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updatedItem;
    this.saveItems(items);
    return updatedItem;
  },

  deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    this.saveItems(filtered);
    return true;
  },

  toggleComplete(id: string): WorkItem | null {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const current = items[index];
    const newStatus = current.status === 'completed' ? 'active' : 'completed';
    return this.updateItem(id, { status: newStatus });
  },

  resetToDefault(): WorkItem[] {
    this.saveItems(INITIAL_SAMPLE_ITEMS);
    return INITIAL_SAMPLE_ITEMS;
  },
};
