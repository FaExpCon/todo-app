import TaskItem from './TaskItem.jsx'

function TaskList({ tasks, filter, hasTasks, today, onToggleTask, onEditTask, onDeleteTask }) {
  if (tasks.length === 0) {
    let message = '아직 할 일이 없어요. 하나 추가해 보세요!'
    if (hasTasks && filter === 'active') message = '진행 중인 할 일이 없어요.'
    if (hasTasks && filter === 'completed') message = '완료한 할 일이 없어요.'
    return <p className="empty-state">{message}</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          today={today}
          onToggleTask={onToggleTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  )
}

export default TaskList
