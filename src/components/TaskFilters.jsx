const filters = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

function TaskFilters({ filter, onFilterChange, activeCount }) {
  return (
    <div className="task-toolbar">
      <div className="task-filters" role="group" aria-label="할 일 필터">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="task-count" role="status">
        남은 할 일 {activeCount}개
      </p>
    </div>
  )
}

export default TaskFilters
