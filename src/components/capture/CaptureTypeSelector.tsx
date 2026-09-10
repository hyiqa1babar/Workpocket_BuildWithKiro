import React from 'react';
import { WorkItemType } from '../../types/workItem';
import { WorkItemTypeIcon, WORK_ITEM_CONFIG } from '../items/WorkItemTypeIcon';

interface CaptureTypeSelectorProps {
  selectedType: WorkItemType;
  onSelectType: (type: WorkItemType) => void;
}

const TYPES: WorkItemType[] = ['task', 'note', 'link', 'code', 'file'];

export const CaptureTypeSelector: React.FC<CaptureTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
      {TYPES.map((type) => {
        const isSelected = selectedType === type;
        const config = WORK_ITEM_CONFIG[type];

        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelectType(type)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <WorkItemTypeIcon type={type} size={14} />
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
};
