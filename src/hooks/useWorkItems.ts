import { useState, useEffect, useMemo, useCallback } from 'react';
import { WorkItem, WorkItemType, CreateWorkItemInput, UpdateWorkItemInput, WorkItemPriority, WorkItemStatus } from '../types/workItem';
import { storageService } from '../services/storage';
import { isDueToday } from '../utils/dateUtils';

export function useWorkItems() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<WorkItemType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<WorkItemPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<WorkItemStatus | 'all'>('all');

  // Load items from storage on mount
  useEffect(() => {
    const loaded = storageService.getItems();
    setItems(loaded);
    setIsLoading(false);
  }, []);

  const addItem = useCallback((input: CreateWorkItemInput) => {
    const created = storageService.addItem(input);
    setItems((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateItem = useCallback((id: string, updates: UpdateWorkItemInput) => {
    const updated = storageService.updateItem(id, updates);
    if (updated) {
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
    return updated;
  }, []);

  const deleteItem = useCallback((id: string) => {
    const success = storageService.deleteItem(id);
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    return success;
  }, []);

  const toggleComplete = useCallback((id: string) => {
    const updated = storageService.toggleComplete(id);
    if (updated) {
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
    return updated;
  }, []);

  const resetToSampleData = useCallback(() => {
    const reset = storageService.resetToDefault();
    setItems(reset);
  }, []);

  // Filtered items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Search query (title, content, tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesContent = item.content.toLowerCase().includes(query);
        const matchesTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesMetadata = item.metadata?.fileName?.toLowerCase().includes(query) ||
          item.metadata?.url?.toLowerCase().includes(query) ||
          item.metadata?.language?.toLowerCase().includes(query);

        return matchesTitle || matchesContent || matchesTags || matchesMetadata;
      }

      return true;
    });
  }, [items, typeFilter, priorityFilter, statusFilter, searchQuery]);

  // Key metrics for Dashboard and badges
  const stats = useMemo(() => {
    const active = items.filter((i) => i.status === 'active');
    const completed = items.filter((i) => i.status === 'completed');
    const urgent = active.filter((i) => i.priority === 'high');
    const dueToday = active.filter((i) => i.type === 'task' && isDueToday(i.dueDate));

    const countByType = {
      task: items.filter((i) => i.type === 'task').length,
      note: items.filter((i) => i.type === 'note').length,
      link: items.filter((i) => i.type === 'link').length,
      code: items.filter((i) => i.type === 'code').length,
      file: items.filter((i) => i.type === 'file').length,
    };

    return {
      total: items.length,
      activeCount: active.length,
      completedCount: completed.length,
      urgentCount: urgent.length,
      dueTodayCount: dueToday.length,
      countByType,
    };
  }, [items]);

  return {
    items,
    filteredItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete,
    resetToSampleData,
    stats,
  };
}
