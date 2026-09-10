export type WorkItemType = 'task' | 'note' | 'link' | 'code' | 'file';

export type WorkItemPriority = 'low' | 'medium' | 'high';

export type WorkItemStatus = 'active' | 'completed' | 'archived';

export interface WorkItemMetadata {
  url?: string;
  language?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  source?: string;
  [key: string]: unknown;
}

export interface WorkItem {
  id: string;
  title: string;
  content: string;
  type: WorkItemType;
  priority: WorkItemPriority;
  status: WorkItemStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  dueDate?: string;  // ISO date string
  tags: string[];
  metadata?: WorkItemMetadata;
}

export type CreateWorkItemInput = Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: WorkItemStatus;
};

export type UpdateWorkItemInput = Partial<Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>>;
