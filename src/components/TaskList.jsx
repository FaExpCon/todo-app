import TaskItem from './TaskItem.jsx'

function TaskList({ tasks, filter, hasTasks, onToggleTask, onEditTask, onDeleteTask }) {
  if (tasks.length === 0) {
    let message = 'No tasks yet. Add one above to get started.'
    if (hasTasks && filter === 'active') message = 'No active tasks.'
    if (hasTasks && filter === 'completed') message = 'No completed tasks.'
    return <p className="empty-state">{message}</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  )
}

export default TaskList
