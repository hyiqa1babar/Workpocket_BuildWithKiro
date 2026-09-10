import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { CaptureInput } from './CaptureInput';
import { SmartCaptureInput } from './SmartCaptureInput';
import { CreateWorkItemInput, WorkItemType } from '../../types/workItem';
import { PlusCircle, Sparkles, Pencil } from 'lucide-react';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CreateWorkItemInput) => void;
  defaultType?: WorkItemType;
}

type Mode = 'smart' | 'manual';

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultType = 'task',
}) => {
  const [mode, setMode] = useState<Mode>('smart');

  const handleSaveOne = (item: CreateWorkItemInput) => {
    onSave(item);
    onClose();
  };

  const handleSaveMany = (items: CreateWorkItemInput[]) => {
    items.forEach((i) => onSave(i));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2 text-slate-100">
          <PlusCircle size={18} className="text-sky-400" />
          <span>Capture something</span>
        </div>
      }
    >
      <div className="mb-4 flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => setMode('smart')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            mode === 'smart'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles size={14} /> Smart Capture
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
            mode === 'manual'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Pencil size={14} /> Manual
        </button>
      </div>

      {mode === 'smart' ? (
        <SmartCaptureInput onSave={handleSaveMany} onCancel={onClose} />
      ) : (
        <CaptureInput
          onSave={handleSaveOne}
          onCancel={onClose}
          defaultType={defaultType}
          isModal
        />
      )}
    </Modal>
  );
};
