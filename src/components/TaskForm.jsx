import { useState } from 'react'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Enter a task title.')
      return
    }

    onAddTask(trimmedTitle, dueDate)
    setTitle('')
    setDueDate('')
    setError('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-fields">
        <div className="form-field title-field">
          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) setError('')
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'task-title-error' : undefined}
            placeholder="What needs doing?"
          />
          {error && <p className="form-error" id="task-title-error">{error}</p>}
        </div>
        <div className="form-field date-field">
          <label htmlFor="task-due-date">Due date <span>(optional)</span></label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>
      <button className="add-button" type="submit">Add task</button>
    </form>
  )
}

export default TaskForm
