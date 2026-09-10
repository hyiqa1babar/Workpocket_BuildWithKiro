import React from 'react';
import { CheckSquare, FileText, Link2, Code2, File, LucideProps } from 'lucide-react';
import { WorkItemType } from '../../types/workItem';

interface WorkItemTypeIconProps extends Omit<LucideProps, 'ref'> {
  type: WorkItemType;
}

export const WorkItemTypeIcon: React.FC<WorkItemTypeIconProps> = ({ type, ...props }) => {
  switch (type) {
    case 'task':
      return <CheckSquare className="text-marker-mint" strokeWidth={2.4} {...props} />;
    case 'note':
      return <FileText className="text-marker-orange" strokeWidth={2.4} {...props} />;
    case 'link':
      return <Link2 className="text-marker-sky" strokeWidth={2.4} {...props} />;
    case 'code':
      return <Code2 className="text-marker-purple" strokeWidth={2.4} {...props} />;
    case 'file':
      return <File className="text-marker-pink" strokeWidth={2.4} {...props} />;
    default:
      return <FileText className="text-ink-soft" strokeWidth={2.4} {...props} />;
  }
};

export const WORK_ITEM_CONFIG: Record<
  WorkItemType,
  {
    label: string;
    bgBadge: string;
    textBadge: string;
    borderBadge: string;
  }
> = {
  task: {
    label: 'Task',
    bgBadge: 'bg-marker-mint/15',
    textBadge: 'text-marker-mint',
    borderBadge: 'border-marker-mint/40',
  },
  note: {
    label: 'Note',
    bgBadge: 'bg-marker-orange/15',
    textBadge: 'text-marker-orange',
    borderBadge: 'border-marker-orange/40',
  },
  link: {
    label: 'Link',
    bgBadge: 'bg-marker-sky/15',
    textBadge: 'text-marker-sky',
    borderBadge: 'border-marker-sky/40',
  },
  code: {
    label: 'Code',
    bgBadge: 'bg-marker-purple/15',
    textBadge: 'text-marker-purple',
    borderBadge: 'border-marker-purple/40',
  },
  file: {
    label: 'File',
    bgBadge: 'bg-marker-pink/15',
    textBadge: 'text-marker-pink',
    borderBadge: 'border-marker-pink/40',
  },
};
