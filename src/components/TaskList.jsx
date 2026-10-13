import TaskItem from './TaskItem.jsx'

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Your tasks will appear here.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => <TaskItem key={task.id} task={task} />)}
    </ul>
  )
}

export default TaskList
