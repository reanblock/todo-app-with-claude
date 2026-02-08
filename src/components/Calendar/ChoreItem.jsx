import clsx from 'clsx'

function ChoreItem({ chore, onClick, onToggleComplete }) {
  const handleCheckboxClick = (e) => {
    e.stopPropagation() // Prevent triggering onClick
    onToggleComplete?.(chore.id)
  }

  return (
    <div
      onClick={() => onClick?.(chore)}
      className={clsx(
        'text-xs px-2 py-1 mb-1 rounded cursor-pointer transition-colors flex items-center gap-1',
        'hover:opacity-80',
        chore.completed
          ? 'bg-green-100 text-green-800 opacity-70'
          : 'bg-blue-100 text-blue-800'
      )}
      title={chore.description || chore.title}
    >
      <input
        type="checkbox"
        checked={chore.completed}
        onChange={handleCheckboxClick}
        onClick={(e) => e.stopPropagation()}
        className="cursor-pointer flex-shrink-0"
      />
      <div className={clsx('font-medium truncate', chore.completed && 'line-through')}>
        {chore.title}
      </div>
    </div>
  )
}

export default ChoreItem
