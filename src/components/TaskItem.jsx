import { useEffect, useRef, useState } from 'react'
import { formatDueDate } from '../dueDates.js'

function TaskItem({ task, today, onToggleTask, onEditTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [dueDate, setDueDate] = useState(task.dueDate)
  const [error, setError] = useState('')
  const editButtonRef = useRef(null)
  const restoreFocus = useRef(false)
  const due = task.dueDate ? formatDueDate(task.dueDate, today, task.completed) : null

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
      setError('할 일을 입력해 주세요.')
      return
    }

    onEditTask(task.id, trimmedTitle, dueDate)
    restoreFocus.current = true
    setIsEditing(false)
    setError('')
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
              <label htmlFor={`edit-title-${task.id}`}>할 일</label>
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
              <label htmlFor={`edit-date-${task.id}`}>마감일 <span>(선택)</span></label>
              <input
                id={`edit-date-${task.id}`}
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </div>
          <div className="task-actions">
            <button className="add-button" type="submit">저장</button>
            <button className="secondary-button" type="button" onClick={cancelEditing}>취소</button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`task-item${task.completed ? ' task-item-completed' : ''}${due?.overdue ? ' task-item-overdue' : ''}`}>
      <div className="task-content">
        <input
          id={`complete-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
        />
        <div className="task-details">
          <label className="task-title" htmlFor={`complete-${task.id}`}>{task.title}</label>
          {due && <span className="task-date" title={`마감일: ${task.dueDate}`}>{due.label}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button ref={editButtonRef} className="secondary-button" type="button" onClick={startEditing} aria-label={`${task.title} 수정`}>
          수정
        </button>
        <button className="delete-button" type="button" onClick={() => onDeleteTask(task.id)} aria-label={`${task.title} 삭제`}>
          삭제
        </button>
      </div>
    </li>
  )
}

export default TaskItem
