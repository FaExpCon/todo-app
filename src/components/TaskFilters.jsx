const filters = ['all', 'active', 'completed']

function TaskFilters({ filter, onFilterChange, activeCount }) {
  return (
    <div className="task-toolbar">
      <div className="task-filters" role="group" aria-label="Filter tasks">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => onFilterChange(value)}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
      <p className="task-count" role="status">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
      </p>
    </div>
  )
}

export default TaskFilters
