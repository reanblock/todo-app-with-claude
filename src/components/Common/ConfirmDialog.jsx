import Modal from './Modal'
import Button from './Button'

function ConfirmDialog({ isOpen, onClose, title, message, actions }) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>

        <div className="flex flex-col gap-2 pt-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              onClick={() => {
                action.onClick()
                onClose()
              }}
            >
              {action.label}
            </Button>
          ))}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
