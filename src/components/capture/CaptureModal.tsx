import React from 'react';
import { Modal } from '../ui/Modal';
import { CaptureInput } from './CaptureInput';
import { CreateWorkItemInput, WorkItemType } from '../../types/workItem';
import { PlusCircle } from 'lucide-react';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CreateWorkItemInput) => void;
  defaultType?: WorkItemType;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultType = 'task',
}) => {
  const handleSave = (item: CreateWorkItemInput) => {
    onSave(item);
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
      <CaptureInput
        onSave={handleSave}
        onCancel={onClose}
        defaultType={defaultType}
        isModal
      />
    </Modal>
  );
};
