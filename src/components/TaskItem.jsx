import { useEffect, useRef, useState } from 'react'

function TaskItem({ task, onToggleTask, onEditTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [dueDate, setDueDate] = useState(task.dueDate)
  const [error, setError] = useState('')
  const editButtonRef = useRef(null)
  const restoreFocus = useRef(false)

  useEffect(() => {
    if (!isEditing && restoreFocus.current) {
      editButtonRef.current?.focus()
      restoreFocus.current = false
    }
  }, [isEditing])

  function startEditing() {
    setTitle(task.title)
    setDueDate(task.dueDate)
    setError('')
    setIsEditing(true)
  }

  function cancelEditing() {
    restoreFocus.current = true
    setIsEditing(false)
    setError('')
  }

  function saveChanges(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Enter a task title.')
      return
    }

    onEditTask(task.id, trimmedTitle, dueDate)
    restoreFocus.current = true
    setIsEditing(false)
    setError('')
  }

  function confirmDelete() {
    if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) {
      onDeleteTask(task.id)
    }
  }

  if (isEditing) {
    return (
      <li className="task-item">
        <form
          className="edit-form"
          onSubmit={saveChanges}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              cancelEditing()
            }
          }}
        >
          <div className="form-fields">
            <div className="form-field title-field">
              <label htmlFor={`edit-title-${task.id}`}>Task title</label>
              <input
                id={`edit-title-${task.id}`}
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  if (error) setError('')
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `edit-error-${task.id}` : undefined}
                autoFocus
              />
              {error && <p className="form-error" id={`edit-error-${task.id}`}>{error}</p>}
            </div>
            <div className="form-field date-field">
              <label htmlFor={`edit-date-${task.id}`}>Due date <span>(optional)</span></label>
              <input
                id={`edit-date-${task.id}`}
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </div>
          <div className="task-actions">
            <button className="add-button" type="submit">Save</button>
            <button className="secondary-button" type="button" onClick={cancelEditing}>Cancel</button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`task-item${task.completed ? ' task-item-completed' : ''}`}>
      <div className="task-content">
        <input
          id={`complete-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
        />
        <div className="task-details">
          <label className="task-title" htmlFor={`complete-${task.id}`}>{task.title}</label>
          {task.dueDate && <span className="task-date">Due {task.dueDate}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button ref={editButtonRef} className="secondary-button" type="button" onClick={startEditing} aria-label={`Edit ${task.title}`}>
          Edit
        </button>
        <button className="delete-button" type="button" onClick={confirmDelete} aria-label={`Delete ${task.title}`}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskItem
