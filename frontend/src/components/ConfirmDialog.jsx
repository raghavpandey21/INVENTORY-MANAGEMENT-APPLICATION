import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  confirmColor = 'bg-red-600 hover:bg-red-700',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg text-white transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
