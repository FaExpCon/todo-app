export function getVisibleTasks(tasks, filter) {
  return tasks
    .filter((task) => {
      if (filter === 'active') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })
    .sort((a, b) => {
      if (a.dueDate === b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate < b.dueDate ? -1 : 1
    })
}
