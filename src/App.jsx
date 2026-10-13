import { useEffect, useLayoutEffect, useState } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import TaskFilters from './components/TaskFilters.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { getVisibleTasks } from './taskSelectors.js'
import './styles.css'

const STORAGE_KEY = 'my-tasks'
const THEME_KEY = 'my-tasks-theme'

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

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
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useState(loadTheme)
  const visibleTasks = getVisibleTasks(tasks, filter)
  const activeCount = tasks.filter((task) => !task.completed).length

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // The app can still be used if browser storage is unavailable.
    }
  }, [tasks])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#171b19' : '#f5f7f4',
    )
  }, [theme])

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    try {
      localStorage.setItem(THEME_KEY, nextTheme)
    } catch {
      // The toggle remains usable even if browser storage is unavailable.
    }
  }

  function addTask(title, dueDate) {
    setTasks((current) => [
      ...current,
      { id: crypto.randomUUID(), title, dueDate, completed: false },
    ])
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ))
  }

  function editTask(id, title, dueDate) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, title, dueDate } : task,
    ))
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-top">
          <p className="eyebrow">A little space to focus</p>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <h1>My tasks</h1>
        <p className="intro">Keep the important things in one place.</p>
      </header>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">Your to-do list</h2>
        <TaskForm onAddTask={addTask} />
        <TaskFilters
          filter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
        />
        <TaskList
          tasks={visibleTasks}
          filter={filter}
          hasTasks={tasks.length > 0}
          onToggleTask={toggleTask}
          onEditTask={editTask}
          onDeleteTask={deleteTask}
        />
      </section>
    </main>
  )
}

export default App
