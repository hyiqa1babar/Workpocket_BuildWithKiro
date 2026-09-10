import React from 'react';
import { CheckSquare, FileText, Link2, Code2, File, LucideProps } from 'lucide-react';
import { WorkItemType } from '../../types/workItem';

interface WorkItemTypeIconProps extends Omit<LucideProps, 'ref'> {
  type: WorkItemType;
}

export const WorkItemTypeIcon: React.FC<WorkItemTypeIconProps> = ({ type, ...props }) => {
  switch (type) {
    case 'task':
      return <CheckSquare className="text-emerald-400" {...props} />;
    case 'note':
      return <FileText className="text-amber-400" {...props} />;
    case 'link':
      return <Link2 className="text-sky-400" {...props} />;
    case 'code':
      return <Code2 className="text-indigo-400" {...props} />;
    case 'file':
      return <File className="text-purple-400" {...props} />;
    default:
      return <FileText className="text-slate-400" {...props} />;
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
    bgBadge: 'bg-emerald-500/10',
    textBadge: 'text-emerald-400',
    borderBadge: 'border-emerald-500/20',
  },
  note: {
    label: 'Note',
    bgBadge: 'bg-amber-500/10',
    textBadge: 'text-amber-400',
    borderBadge: 'border-amber-500/20',
  },
  link: {
    label: 'Link',
    bgBadge: 'bg-sky-500/10',
    textBadge: 'text-sky-400',
    borderBadge: 'border-sky-500/20',
  },
  code: {
    label: 'Code',
    bgBadge: 'bg-indigo-500/10',
    textBadge: 'text-indigo-400',
    borderBadge: 'border-indigo-500/20',
  },
  file: {
    label: 'File',
    bgBadge: 'bg-purple-500/10',
    textBadge: 'text-purple-400',
    borderBadge: 'border-purple-500/20',
  },
};
