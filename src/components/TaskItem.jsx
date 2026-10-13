function TaskItem({ task }) {
  return (
    <li className="task-item">
      <span className="task-title">{task.title}</span>
      {task.dueDate && <span className="task-date">Due {task.dueDate}</span>}
    </li>
  )
}

export default TaskItem
