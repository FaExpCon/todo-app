import { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import './styles.css'

const STORAGE_KEY = 'my-tasks'

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(saved)) return []

    return saved.filter(
      (task) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.dueDate === 'string' &&
        typeof task.completed === 'boolean',
    )
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // The app can still be used if browser storage is unavailable.
    }
  }, [tasks])

  function addTask(title, dueDate) {
    setTasks((current) => [
      ...current,
      { id: crypto.randomUUID(), title, dueDate, completed: false },
    ])
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">A little space to focus</p>
        <h1>My tasks</h1>
        <p className="intro">Keep the important things in one place.</p>
      </header>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">Your to-do list</h2>
        <TaskForm onAddTask={addTask} />
        <TaskList tasks={tasks} />
      </section>
    </main>
  )
}

export default App
