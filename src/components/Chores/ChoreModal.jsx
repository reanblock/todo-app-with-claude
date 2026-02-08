import Modal from '../Common/Modal'
import ChoreForm from './ChoreForm'

function ChoreModal({ isOpen, onClose, chore, onSubmit, onDelete }) {
  const handleSubmit = (formData) => {
    onSubmit(formData)
    onClose()
  }

  const handleDelete = () => {
    if (onDelete && chore) {
      onDelete(chore)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={chore ? 'Edit Chore' : 'Add New Chore'}
    >
      <ChoreForm
        chore={chore}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={chore ? handleDelete : undefined}
      />
    </Modal>
  )
}

export default ChoreModal
